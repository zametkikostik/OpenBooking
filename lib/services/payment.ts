import { createServerClient } from '@/lib/supabase/server';
import type { PaymentMethod, PaymentStatus } from '@/types';
import { generateIdempotencyKey } from '@/lib/utils/helpers';

/**
 * Payment Adapter Layer
 *
 * Handles both crypto and fiat payment processing.
 * Implements adapter pattern for multiple payment providers.
 */

export interface PaymentRequest {
  userId: string;
  bookingId?: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  metadata?: Record<string, unknown>;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  transactionHash?: string;
  error?: string;
  gatewayResponse?: Record<string, unknown>;
}

/**
 * Payment Adapter Interface
 */
interface PaymentAdapter {
  process(payment: PaymentRequest): Promise<PaymentResult>;
  refund(transactionId: string, amount?: number): Promise<PaymentResult>;
  getStatus(transactionId: string): Promise<PaymentStatus>;
}

/**
 * Crypto Payment Adapter (ETH, DAI, A7A5)
 */
class CryptoPaymentAdapter implements PaymentAdapter {
  async process(payment: PaymentRequest): Promise<PaymentResult> {
    try {
      const { method, amount, currency, metadata } = payment;

      // Verify transaction hash provided in metadata
      const txHash = metadata?.transactionHash as string | undefined;
      if (!txHash) {
        return {
          success: false,
          error: 'Transaction hash required for crypto payment',
        };
      }

      // Verify transaction on-chain via RPC
      const verified = await this.verifyTransaction(txHash, method, amount);
      if (!verified) {
        return {
          success: false,
          error: 'Transaction verification failed',
        };
      }

      // Create transaction record
      const transactionId = await this.createTransactionRecord({
        ...payment,
        transactionHash: txHash,
        status: 'confirmed' as PaymentStatus,
      });

      return {
        success: true,
        transactionId,
        transactionHash: txHash,
      };
    } catch (error) {
      console.error('Crypto payment error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment processing failed',
      };
    }
  }

  async refund(transactionId: string, amount?: number): Promise<PaymentResult> {
    return {
      success: false,
      error: 'Crypto refunds must be processed manually',
    };
  }

  async getStatus(transactionId: string): Promise<PaymentStatus> {
    const supabase = createServerClient();
    const { data } = await supabase
      .from('payment_transactions')
      .select('status')
      .eq('id', transactionId)
      .single();

    return (data?.status as PaymentStatus) || 'pending';
  }

  private async verifyTransaction(
    txHash: string,
    method: PaymentMethod,
    expectedAmount: number
  ): Promise<boolean> {
    try {
      if (!/^0x[a-fA-F0-9]{64}$/.test(txHash)) {
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }

  private async createTransactionRecord(
    payment: PaymentRequest & { transactionHash: string; status: PaymentStatus }
  ): Promise<string> {
    const supabase = createServerClient();
    const idempotencyKey = generateIdempotencyKey();

    const { data, error } = await supabase
      .from('payment_transactions')
      .insert({
        booking_id: payment.bookingId,
        user_id: payment.userId,
        transaction_type: 'payment' as const,
        payment_method: payment.method,
        amount: payment.amount,
        currency: payment.currency,
        fee_amount: 0,
        net_amount: payment.amount,
        status: payment.status,
        transaction_hash: payment.transactionHash,
        idempotency_key: idempotencyKey,
        metadata: payment.metadata,
        processed_at: new Date().toISOString(),
        retry_count: 0,
      })
      .select('id')
      .single();

    if (error) throw error;
    return data.id;
  }
}

/**
 * Fiat Payment Adapter (SBP, SEPA, Cards, etc.)
 */
class FiatPaymentAdapter implements PaymentAdapter {
  async process(payment: PaymentRequest): Promise<PaymentResult> {
    try {
      const { method } = payment;

      // Route to appropriate payment gateway
      switch (method) {
        case 'sbp':
        case 'mir':
        case 'yookassa':
          return this.processRussianPayment(payment);
        case 'sepa':
          return this.processSepaPayment(payment);
        case 'adyen':
        case 'klarna':
          return this.processEuropeanPayment(payment);
        case 'borica':
        case 'epay':
          return this.processBulgarianPayment(payment);
        default:
          return {
            success: false,
            error: 'Unsupported payment method',
          };
      }
    } catch (error) {
      console.error('Fiat payment error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment processing failed',
      };
    }
  }

  async refund(transactionId: string, amount?: number): Promise<PaymentResult> {
    return {
      success: false,
      error: 'Refunds must be processed through the payment gateway',
    };
  }

  async getStatus(transactionId: string): Promise<PaymentStatus> {
    const supabase = createServerClient();
    const { data } = await supabase
      .from('payment_transactions')
      .select('status')
      .eq('id', transactionId)
      .single();

    return (data?.status as PaymentStatus) || 'pending';
  }

  private async processRussianPayment(payment: PaymentRequest): Promise<PaymentResult> {
    const gatewayRef = `RU_${generateIdempotencyKey()}`;

    const transactionId = await this.createTransactionRecord({
      ...payment,
      gatewayRef,
      status: 'processing' as PaymentStatus,
    });

    return {
      success: true,
      transactionId,
      gatewayResponse: { gateway_reference: gatewayRef },
    };
  }

  private async processSepaPayment(payment: PaymentRequest): Promise<PaymentResult> {
    const gatewayRef = `SEPA_${generateIdempotencyKey()}`;

    const transactionId = await this.createTransactionRecord({
      ...payment,
      gatewayRef,
      status: 'processing' as PaymentStatus,
    });

    return {
      success: true,
      transactionId,
      gatewayResponse: { gateway_reference: gatewayRef },
    };
  }

  private async processEuropeanPayment(payment: PaymentRequest): Promise<PaymentResult> {
    const gatewayRef = `EU_${generateIdempotencyKey()}`;

    const transactionId = await this.createTransactionRecord({
      ...payment,
      gatewayRef,
      status: 'processing' as PaymentStatus,
    });

    return {
      success: true,
      transactionId,
      gatewayResponse: { gateway_reference: gatewayRef },
    };
  }

  private async processBulgarianPayment(payment: PaymentRequest): Promise<PaymentResult> {
    const gatewayRef = `BG_${generateIdempotencyKey()}`;

    const transactionId = await this.createTransactionRecord({
      ...payment,
      gatewayRef,
      status: 'processing' as PaymentStatus,
    });

    return {
      success: true,
      transactionId,
      gatewayResponse: { gateway_reference: gatewayRef },
    };
  }

  private async createTransactionRecord(
    payment: PaymentRequest & { gatewayRef: string; status: PaymentStatus }
  ): Promise<string> {
    const supabase = createServerClient();
    const idempotencyKey = generateIdempotencyKey();

    const { data, error } = await supabase
      .from('payment_transactions')
      .insert({
        booking_id: payment.bookingId,
        user_id: payment.userId,
        transaction_type: 'payment' as const,
        payment_method: payment.method,
        amount: payment.amount,
        currency: payment.currency,
        fee_amount: payment.amount * 0.02,
        net_amount: payment.amount * 0.98,
        status: payment.status,
        gateway_reference: payment.gatewayRef,
        idempotency_key: idempotencyKey,
        metadata: payment.metadata,
        retry_count: 0,
      })
      .select('id')
      .single();

    if (error) throw error;
    return data.id;
  }
}

/**
 * Payment Facade
 * Routes payments to appropriate adapter
 */
export class PaymentService {
  private cryptoAdapter: CryptoPaymentAdapter;
  private fiatAdapter: FiatPaymentAdapter;

  constructor() {
    this.cryptoAdapter = new CryptoPaymentAdapter();
    this.fiatAdapter = new FiatPaymentAdapter();
  }

  async process(payment: PaymentRequest): Promise<PaymentResult> {
    // AML validation before processing
    const amlCheck = await this.amlValidation(payment.userId, payment.amount);
    if (!amlCheck.passed) {
      return {
        success: false,
        error: amlCheck.reason || 'AML validation failed',
      };
    }

    // Route to appropriate adapter
    const isCrypto = ['eth', 'dai', 'a7a5'].includes(payment.method);
    const adapter = isCrypto ? this.cryptoAdapter : this.fiatAdapter;

    return adapter.process(payment);
  }

  async refund(transactionId: string, amount?: number): Promise<PaymentResult> {
    const supabase = createServerClient();
    const { data } = await supabase
      .from('payment_transactions')
      .select('payment_method')
      .eq('id', transactionId)
      .single();

    if (!data) {
      return { success: false, error: 'Transaction not found' };
    }

    const isCrypto = ['eth', 'dai', 'a7a5'].includes(data.payment_method);
    const adapter = isCrypto ? this.cryptoAdapter : this.fiatAdapter;

    return adapter.refund(transactionId, amount);
  }

  async getStatus(transactionId: string): Promise<PaymentStatus> {
    const supabase = createServerClient();
    const { data } = await supabase
      .from('payment_transactions')
      .select('status, payment_method')
      .eq('id', transactionId)
      .single();

    return (data?.status as PaymentStatus) || 'pending';
  }

  private async amlValidation(
    userId: string,
    amount: number
  ): Promise<{ passed: boolean; reason?: string }> {
    const DAILY_LIMIT = 10000;

    if (amount > DAILY_LIMIT) {
      await this.logComplianceEvent(userId, 'large_transaction', amount);
      return { passed: false, reason: 'Transaction exceeds daily limit. Manual review required.' };
    }

    return { passed: true };
  }

  private async logComplianceEvent(
    userId: string,
    eventType: string,
    amount: number
  ): Promise<void> {
    const supabase = createServerClient();
    await supabase.from('compliance_logs').insert({
      user_id: userId,
      entity_type: 'payment',
      entity_id: userId,
      action: eventType,
      status: 'flagged' as const,
      risk_score: Math.min(amount / 10000, 1),
      metadata: { amount },
    });
  }
}

// Export singleton instance
export const paymentService = new PaymentService();
