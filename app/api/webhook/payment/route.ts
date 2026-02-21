import { NextRequest, NextResponse } from 'next/server';
import { paymentService } from '@/lib/services/payment';
import { validate, paymentSchema } from '@/lib/validators';

/**
 * Payment Webhook Handler
 *
 * Receives payment confirmations from:
 * - Crypto: Blockchain events (via RPC listener)
 * - Fiat: Payment gateway webhooks (YooKassa, Adyen, etc.)
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate payment data
    const validation = validate(paymentSchema, body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const paymentData = validation.data!;

    // Process payment based on method
    const isCrypto = ['eth', 'dai', 'a7a5'].includes(paymentData.method);

    if (isCrypto) {
      // Verify crypto transaction on-chain
      const result = await paymentService.process({
        userId: body.user_id || '',
        bookingId: paymentData.booking_id,
        amount: paymentData.amount,
        currency: paymentData.currency,
        method: paymentData.method,
        metadata: {
          transactionHash: paymentData.transaction_hash,
        },
      });

      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        transactionId: result.transactionId,
      });
    } else {
      // Process fiat payment through gateway
      const result = await paymentService.process({
        userId: body.user_id || '',
        bookingId: paymentData.booking_id,
        amount: paymentData.amount,
        currency: paymentData.currency,
        method: paymentData.method,
      });

      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        transactionId: result.transactionId,
        gatewayResponse: result.gatewayResponse,
      });
    }
  } catch (error) {
    console.error('Payment webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: 'ok' });
}
