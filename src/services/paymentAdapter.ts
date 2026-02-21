import { PaymentMethod, PaymentStatus, Currency, Booking } from '@/types/database'

// Payment Adapter Interface
export interface PaymentAdapter {
  name: string
  supportedMethods: PaymentMethod[]
  supportedRegions: string[]
  
  // Payment processing
  processPayment(params: PaymentParams): Promise<PaymentResult>
  refundPayment(params: RefundParams): Promise<RefundResult>
  getPaymentStatus(paymentId: string): Promise<PaymentStatusResult>
  
  // AML/KYC validation
  validateAML(params: AMLValidationParams): Promise<AMLValidationResult>
  
  // Settlement
  initiateSettlement(params: SettlementParams): Promise<SettlementResult>
}

export interface PaymentParams {
  bookingId: string
  userId: string
  amount: number
  currency: Currency
  method: PaymentMethod
  metadata?: Record<string, any>
}

export interface PaymentResult {
  success: boolean
  paymentId: string
  transactionHash?: string
  status: PaymentStatus
  processorResponse?: any
  error?: string
}

export interface RefundParams {
  paymentId: string
  amount?: number // Full refund if not specified
  reason?: string
}

export interface RefundResult {
  success: boolean
  refundId: string
  amount: number
  status: PaymentStatus
  error?: string
}

export interface PaymentStatusResult {
  paymentId: string
  status: PaymentStatus
  amount: number
  currency: Currency
  lastUpdated: Date
}

export interface AMLValidationParams {
  userId: string
  amount: number
  currency: Currency
  country: string
  riskFactors?: Record<string, any>
}

export interface AMLValidationResult {
  passed: boolean
  riskScore: number // 0-100
  requiresManualReview: boolean
  reasons?: string[]
}

export interface SettlementParams {
  bookingId: string
  hostId: string
  amount: number
  currency: Currency
  releaseDate: Date
}

export interface SettlementResult {
  success: boolean
  settlementId: string
  amount: number
  fee: number
  netAmount: number
  status: string
  error?: string
}

// Crypto Payment Adapter (Web3)
export class CryptoPaymentAdapter implements PaymentAdapter {
  name = 'Crypto Payment Adapter'
  supportedMethods: PaymentMethod[] = [
    'usdt',
    'usdc',
    'eth',
    'openbooking_token',
    'a7a5_stablecoin',
  ]
  supportedRegions = ['GLOBAL']

  async processPayment(params: PaymentParams): Promise<PaymentResult> {
    // Web3 payment logic - integrate with smart contract
    // This will be implemented in Stage 5
    console.log(`Processing crypto payment: ${params.amount} ${params.currency}`)
    
    return {
      success: true,
      paymentId: `crypto_${Date.now()}`,
      status: 'completed',
      transactionHash: '0x...',
    }
  }

  async refundPayment(params: RefundParams): Promise<RefundResult> {
    console.log(`Processing crypto refund: ${params.paymentId}`)
    
    return {
      success: true,
      refundId: `refund_${Date.now()}`,
      amount: params.amount || 0,
      status: 'completed',
    }
  }

  async getPaymentStatus(paymentId: string): Promise<PaymentStatusResult> {
    return {
      paymentId,
      status: 'completed',
      amount: 0,
      currency: 'USD',
      lastUpdated: new Date(),
    }
  }

  async validateAML(params: AMLValidationParams): Promise<AMLValidationResult> {
    // Basic AML check for crypto
    const highRiskCountries = ['KP', 'IR', 'SY', 'CU']
    const isHighRisk = highRiskCountries.includes(params.country)
    
    return {
      passed: !isHighRisk,
      riskScore: isHighRisk ? 80 : 20,
      requiresManualReview: isHighRisk,
      reasons: isHighRisk ? ['High-risk country'] : [],
    }
  }

  async initiateSettlement(params: SettlementParams): Promise<SettlementResult> {
    const fee = params.amount * 0.025 // 2.5% fee
    const netAmount = params.amount - fee
    
    return {
      success: true,
      settlementId: `settle_${Date.now()}`,
      amount: params.amount,
      fee,
      netAmount,
      status: 'pending',
    }
  }
}

// Fiat Payment Adapter (Regional providers)
export class FiatPaymentAdapter implements PaymentAdapter {
  name = 'Fiat Payment Adapter'
  supportedMethods: PaymentMethod[] = [
    'sbp',
    'sepa',
    'mir',
    'yookassa',
    'klarna',
    'epay_bg',
    'borica',
    'adyen',
  ]
  supportedRegions = ['RU', 'EU', 'BG', 'GLOBAL']

  private getProvider(method: PaymentMethod): string {
    const providers: Record<PaymentMethod, string> = {
      sbp: 'yookassa',
      mir: 'yookassa',
      yookassa: 'yookassa',
      sepa: 'adyen',
      klarna: 'klarna',
      epay_bg: 'epay',
      borica: 'borica',
      adyen: 'adyen',
      usdt: 'crypto',
      usdc: 'crypto',
      eth: 'crypto',
      openbooking_token: 'crypto',
      a7a5_stablecoin: 'crypto',
    }
    return providers[method] || 'unknown'
  }

  async processPayment(params: PaymentParams): Promise<PaymentResult> {
    const provider = this.getProvider(params.method)
    console.log(`Processing fiat payment via ${provider}: ${params.amount} ${params.currency}`)
    
    // Provider-specific logic would go here
    return {
      success: true,
      paymentId: `fiat_${Date.now()}`,
      status: 'completed',
      processorResponse: { provider, reference: `ref_${Date.now()}` },
    }
  }

  async refundPayment(params: RefundParams): Promise<RefundResult> {
    console.log(`Processing fiat refund: ${params.paymentId}`)
    
    return {
      success: true,
      refundId: `refund_${Date.now()}`,
      amount: params.amount || 0,
      status: 'pending',
    }
  }

  async getPaymentStatus(paymentId: string): Promise<PaymentStatusResult> {
    return {
      paymentId,
      status: 'completed',
      amount: 0,
      currency: 'USD',
      lastUpdated: new Date(),
    }
  }

  async validateAML(params: AMLValidationParams): Promise<AMLValidationResult> {
    // Fiat AML checks
    const threshold = params.currency === 'EUR' ? 10000 : 
                      params.currency === 'RUB' ? 1000000 : 
                      params.currency === 'BGN' ? 20000 : 10000
    
    const requiresReview = params.amount >= threshold
    
    return {
      passed: !requiresReview,
      riskScore: requiresReview ? 60 : 10,
      requiresManualReview: requiresReview,
      reasons: requiresReview ? ['Amount exceeds threshold'] : [],
    }
  }

  async initiateSettlement(params: SettlementParams): Promise<SettlementResult> {
    const fee = params.amount * 0.03 // 3% fee for fiat
    const netAmount = params.amount - fee
    
    return {
      success: true,
      settlementId: `settle_${Date.now()}`,
      amount: params.amount,
      fee,
      netAmount,
      status: 'pending',
    }
  }
}

// Payment Adapter Factory
export class PaymentAdapterFactory {
  private static adapters: Record<string, PaymentAdapter> = {
    crypto: new CryptoPaymentAdapter(),
    fiat: new FiatPaymentAdapter(),
  }

  static getAdapter(method: PaymentMethod): PaymentAdapter {
    const cryptoMethods: PaymentMethod[] = [
      'usdt', 'usdc', 'eth', 'openbooking_token', 'a7a5_stablecoin'
    ]
    
    if (cryptoMethods.includes(method)) {
      return this.adapters.crypto
    }
    
    return this.adapters.fiat
  }

  static getAdapterByName(name: string): PaymentAdapter | undefined {
    return this.adapters[name]
  }

  static getAllAdapters(): PaymentAdapter[] {
    return Object.values(this.adapters)
  }
}

// Escrow State Machine Service
export class EscrowStateMachine {
  private static stateTransitions: Record<string, string[]> = {
    pending: ['payment_locked', 'cancelled'],
    payment_locked: ['checked_in', 'cancelled'],
    checked_in: ['completed', 'cancelled'],
    completed: ['settled'],
    settled: [],
    cancelled: [],
  }

  static canTransition(from: string, to: string): boolean {
    return this.stateTransitions[from]?.includes(to) || false
  }

  static async transition(
    booking: Booking,
    newState: string,
    metadata?: Record<string, any>
  ): Promise<{ success: boolean; error?: string }> {
    if (!this.canTransition(booking.status, newState)) {
      return {
        success: false,
        error: `Cannot transition from ${booking.status} to ${newState}`,
      }
    }

    // Business rules validation
    if (newState === 'cancelled') {
      // After check-in, host cannot cancel
      if (booking.checked_in_at) {
        return {
          success: false,
          error: 'Cannot cancel after check-in',
        }
      }
    }

    // State transition is valid
    return { success: true }
  }

  static getNextStates(currentState: string): string[] {
    return this.stateTransitions[currentState] || []
  }

  static isTerminalState(state: string): boolean {
    return ['settled', 'cancelled'].includes(state)
  }
}
