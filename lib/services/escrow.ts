import { createServerClient } from '@/lib/supabase/server';
import type { BookingStatus, PaymentTransaction } from '@/types';
import { ESCROW_CONFIG } from '@/config/web3';

/**
 * Escrow Financial Protocol Service
 *
 * Manages the booking state machine and escrow ledger entries.
 * All state transitions are logged and verified.
 */

export class EscrowService {
  private supabase: ReturnType<typeof createServerClient>;

  constructor() {
    this.supabase = createServerClient();
  }

  /**
   * Get current booking status
   */
  async getBookingStatus(bookingId: string): Promise<BookingStatus | null> {
    const { data, error } = await this.supabase
      .from('bookings')
      .select('status')
      .eq('id', bookingId)
      .single();

    if (error) {
      console.error('Error getting booking status:', error);
      return null;
    }

    return data?.status as BookingStatus | null;
  }

  /**
   * Transition booking state
   * Validates state machine rules before transition
   */
  async transitionState(
    bookingId: string,
    newStatus: BookingStatus,
    userId: string,
    metadata?: Record<string, unknown>
  ): Promise<{ success: boolean; error?: string }> {
    // Get current status
    const currentStatus = await this.getBookingStatus(bookingId);
    if (!currentStatus) {
      return { success: false, error: 'Booking not found' };
    }

    // Validate transition
    const currentStateConfig =
      ESCROW_CONFIG.states[currentStatus as keyof typeof ESCROW_CONFIG.states];
    const nextStates = currentStateConfig?.nextStates as readonly string[] | undefined;
    if (!nextStates || !nextStates.includes(newStatus)) {
      return {
        success: false,
        error: `Invalid state transition from ${currentStatus} to ${newStatus}`,
      };
    }

    // Update booking status
    const updateData: Record<string, unknown> = {
      status: newStatus,
      updated_at: new Date().toISOString(),
    };

    if (newStatus === 'checked_in') {
      updateData.checked_in_at = new Date().toISOString();
    }

    const { error: updateError } = await this.supabase
      .from('bookings')
      .update(updateData)
      .eq('id', bookingId);

    if (updateError) {
      console.error('Error updating booking status:', updateError);
      return { success: false, error: updateError.message };
    }

    // Log the transition
    await this.logStateTransition(bookingId, currentStatus, newStatus, userId, metadata);

    return { success: true };
  }

  /**
   * Lock payment in escrow
   */
  async lockPayment(
    bookingId: string,
    amount: number,
    currency: string,
    assetType: 'eth' | 'dai' | 'a7a5' | 'fiat',
    transactionHash?: string,
    walletFrom?: string
  ): Promise<{ success: boolean; error?: string }> {
    // Create escrow ledger entry
    const { error } = await this.supabase.from('escrow_ledger').insert({
      booking_id: bookingId,
      amount,
      currency,
      asset_type: assetType,
      transaction_hash: transactionHash,
      wallet_from: walletFrom,
      escrow_status: 'locked',
      locked_at: new Date().toISOString(),
      confirmations: 0,
      required_confirmations: assetType === 'fiat' ? 1 : 12,
      metadata: {
        locked_by: 'system',
      },
    });

    if (error) {
      console.error('Error locking payment:', error);
      return { success: false, error: error.message };
    }

    // Transition booking to payment_locked
    const booking = await this.getBooking(bookingId);
    if (booking) {
      await this.transitionState(bookingId, 'payment_locked', booking.guest_id);
    }

    return { success: true };
  }

  /**
   * Release payment from escrow to host
   */
  async releasePayment(
    bookingId: string,
    releasedTo: string,
    reason: string = 'Booking completed'
  ): Promise<{ success: boolean; error?: string }> {
    // Get escrow entry
    const { data: escrow, error: fetchError } = await this.supabase
      .from('escrow_ledger')
      .select('*')
      .eq('booking_id', bookingId)
      .eq('escrow_status', 'locked')
      .single();

    if (fetchError || !escrow) {
      return { success: false, error: 'No locked escrow found for this booking' };
    }

    // Check if release is allowed
    const bookingStatus = await this.getBookingStatus(bookingId);
    if (bookingStatus !== 'completed' && bookingStatus !== 'settled') {
      return { success: false, error: 'Cannot release payment before booking is completed' };
    }

    // Update escrow status
    const { error: updateError } = await this.supabase
      .from('escrow_ledger')
      .update({
        escrow_status: 'released',
        released_at: new Date().toISOString(),
        released_to: releasedTo,
        release_reason: reason,
      })
      .eq('id', escrow.id);

    if (updateError) {
      console.error('Error releasing payment:', updateError);
      return { success: false, error: updateError.message };
    }

    // Transition booking to settled
    await this.transitionState(bookingId, 'settled', releasedTo);

    // Create payment transaction for the release
    await this.createPaymentTransaction({
      booking_id: bookingId,
      user_id: releasedTo,
      transaction_type: 'escrow_release',
      payment_method: escrow.asset_type as 'eth' | 'dai' | 'a7a5',
      amount: escrow.amount,
      currency: escrow.currency,
      fee_amount: 0,
      net_amount: escrow.amount,
      status: 'confirmed',
      transaction_hash: escrow.transaction_hash || undefined,
      retry_count: 0,
      metadata: {
        escrow_id: escrow.id,
        release_reason: reason,
      },
    });

    return { success: true };
  }

  /**
   * Refund payment from escrow
   */
  async refundPayment(
    bookingId: string,
    reason: string
  ): Promise<{ success: boolean; error?: string }> {
    // Get escrow entry
    const { data: escrow, error: fetchError } = await this.supabase
      .from('escrow_ledger')
      .select('*')
      .eq('booking_id', bookingId)
      .eq('escrow_status', 'locked')
      .single();

    if (fetchError || !escrow) {
      return { success: false, error: 'No locked escrow found for this booking' };
    }

    // Update escrow status
    const { error: updateError } = await this.supabase
      .from('escrow_ledger')
      .update({
        escrow_status: 'refunded',
        released_at: new Date().toISOString(),
        release_reason: `Refund: ${reason}`,
      })
      .eq('id', escrow.id);

    if (updateError) {
      console.error('Error refunding payment:', updateError);
      return { success: false, error: updateError.message };
    }

    // Transition booking to cancelled
    const booking = await this.getBooking(bookingId);
    if (booking) {
      await this.transitionState(bookingId, 'cancelled', booking.guest_id);
    }

    return { success: true };
  }

  /**
   * Update transaction confirmations
   */
  async updateConfirmations(
    transactionHash: string,
    confirmations: number,
    blockNumber?: number
  ): Promise<void> {
    await this.supabase
      .from('escrow_ledger')
      .update({
        confirmations,
      })
      .eq('transaction_hash', transactionHash);
  }

  /**
   * Get escrow by booking ID
   */
  async getEscrowByBooking(bookingId: string) {
    const { data, error } = await this.supabase
      .from('escrow_ledger')
      .select('*')
      .eq('booking_id', bookingId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) return null;
    return data;
  }

  /**
   * Log state transition
   */
  private async logStateTransition(
    bookingId: string,
    fromStatus: string,
    toStatus: string,
    userId: string,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    await this.supabase.from('compliance_logs').insert({
      entity_type: 'booking',
      entity_id: bookingId,
      action: `state_transition:${fromStatus}->${toStatus}`,
      status: 'approved',
      user_id: userId,
      metadata: {
        from: fromStatus,
        to: toStatus,
        ...metadata,
      },
    });
  }

  /**
   * Get booking details
   */
  private async getBooking(bookingId: string) {
    const { data } = await this.supabase.from('bookings').select('*').eq('id', bookingId).single();
    return data;
  }

  /**
   * Create payment transaction record
   */
  private async createPaymentTransaction(
    transaction: Omit<PaymentTransaction, 'id' | 'created_at'>
  ): Promise<void> {
    await this.supabase.from('payment_transactions').insert(transaction);
  }
}

// Export singleton instance
export const escrowService = new EscrowService();
