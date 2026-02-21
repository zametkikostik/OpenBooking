// ============================================
// OPENBOOKING PAYMENT ADAPTER LAYER
// Unified interface for Fiat + Crypto payments
// ============================================

import type { payment_method, payment_status } from '@/types/database'

// ============================================
// PAYMENT INTERFACES
// ============================================

export interface PaymentRequest {
  amount: number
  currency: string
  method: payment_method
  bookingId: string
  userId: string
  metadata?: Record<string, unknown>
}

export interface PaymentResponse {
  success: boolean
  paymentId: string
  gatewayReference?: string
  blockchainTxHash?: string
  status: payment_status
  error?: string
}

export interface PaymentAdapter {
  method: payment_method
  supportedCurrencies: string[]
  
  processPayment(request: PaymentRequest): Promise<PaymentResponse>
  refund(paymentId: string, amount?: number): Promise<PaymentResponse>
  getStatus(paymentId: string): Promise<payment_status>
  validateAML(request: PaymentRequest): Promise<boolean>
}

// ============================================
// CRYPTO PAYMENT ADAPTERS
// ============================================

export class CryptoPaymentAdapter implements PaymentAdapter {
  method: payment_method
  supportedCurrencies: string[] = ['USDT', 'USDC', 'ETH', 'OBT', 'A7A5']
  
  constructor(method: payment_method) {
    this.method = method
  }
  
  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      // AML Validation
      const amlValid = await this.validateAML(request)
      if (!amlValid) {
        return {
          success: false,
          paymentId: '',
          status: 'failed',
          error: 'AML validation failed'
        }
      }
      
      // In production, this would interact with blockchain
      // For now, simulate payment processing
      const mockTxHash = `0x${Array(64).fill(0).map(() => 
        Math.floor(Math.random() * 16).toString(16)).join('')}`
      
      return {
        success: true,
        paymentId: `crypto_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        gatewayReference: mockTxHash,
        blockchainTxHash: mockTxHash,
        status: 'completed'
      }
    } catch (error) {
      return {
        success: false,
        paymentId: '',
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
  
  async refund(paymentId: string, amount?: number): Promise<PaymentResponse> {
    // Implement crypto refund logic
    return {
      success: true,
      paymentId: `refund_${paymentId}`,
      status: 'completed'
    }
  }
  
  async getStatus(paymentId: string): Promise<payment_status> {
    // Check blockchain confirmations
    return 'completed'
  }
  
  async validateAML(request: PaymentRequest): Promise<boolean> {
    // Implement AML checks for crypto
    // - Check wallet against sanctions list
    // - Verify transaction limits
    // - Check for suspicious patterns
    
    const MAX_CRYPTO_AMOUNT = 10000 // USD equivalent
    
    if (request.amount > MAX_CRYPTO_AMOUNT) {
      // Require additional KYC for large amounts
      return false
    }
    
    return true
  }
}

// ============================================
// YOOKASSA ADAPTER (Russia)
// ============================================

export class YookassaAdapter implements PaymentAdapter {
  method: payment_method = 'yookassa'
  supportedCurrencies: string[] = ['RUB', 'USD', 'EUR']
  
  private shopId: string
  private secretKey: string
  
  constructor() {
    this.shopId = process.env.YOOKASSA_SHOP_ID || ''
    this.secretKey = process.env.YOOKASSA_SECRET_KEY || ''
  }
  
  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      if (!this.shopId || !this.secretKey) {
        // Development mode
        return {
          success: true,
          paymentId: `yookassa_${Date.now()}`,
          gatewayReference: 'mock_yookassa_ref',
          status: 'completed'
        }
      }
      
      // In production, call Yookassa API
      const response = await fetch('https://api.yookassa.ru/v3/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotence-Key': request.bookingId
        },
        auth: `${this.shopId}:${this.secretKey}`,
        body: JSON.stringify({
          amount: {
            value: request.amount.toFixed(2),
            currency: request.currency
          },
          confirmation: {
            type: 'redirect',
            return_url: `${process.env.NEXTAUTH_URL}/bookings/${request.bookingId}`
          },
          metadata: {
            booking_id: request.bookingId,
            user_id: request.userId
          }
        })
      })
      
      const data = await response.json()
      
      return {
        success: true,
        paymentId: data.id,
        gatewayReference: data.id,
        status: 'processing'
      }
    } catch (error) {
      return {
        success: false,
        paymentId: '',
        status: 'failed',
        error: error instanceof Error ? error.message : 'Yookassa error'
      }
    }
  }
  
  async refund(paymentId: string, amount?: number): Promise<PaymentResponse> {
    // Implement Yookassa refund
    return {
      success: true,
      paymentId: `refund_${paymentId}`,
      status: 'completed'
    }
  }
  
  async getStatus(paymentId: string): Promise<payment_status> {
    // Check Yookassa payment status
    return 'completed'
  }
  
  async validateAML(request: PaymentRequest): Promise<boolean> {
    // Russian AML compliance (115-ФЗ)
    const MAX_AMOUNT = 100000 // RUB
    
    if (request.currency === 'RUB' && request.amount > MAX_AMOUNT) {
      return false
    }
    
    return true
  }
}

// ============================================
// SBP ADAPTER (Russia - Faster Payments)
// ============================================

export class SBPAdapter implements PaymentAdapter {
  method: payment_method = 'sbp'
  supportedCurrencies: string[] = ['RUB']
  
  private apiKey: string
  private merchantId: string
  
  constructor() {
    this.apiKey = process.env.SBP_API_KEY || ''
    this.merchantId = process.env.SBP_MERCHANT_ID || ''
  }
  
  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      if (!this.apiKey || !this.merchantId) {
        return {
          success: true,
          paymentId: `sbp_${Date.now()}`,
          gatewayReference: 'mock_sbp_ref',
          status: 'completed'
        }
      }
      
      // Call SBP API
      return {
        success: true,
        paymentId: `sbp_${Date.now()}`,
        status: 'processing'
      }
    } catch (error) {
      return {
        success: false,
        paymentId: '',
        status: 'failed',
        error: 'SBP error'
      }
    }
  }
  
  async refund(paymentId: string, amount?: number): Promise<PaymentResponse> {
    return {
      success: true,
      paymentId: `refund_${paymentId}`,
      status: 'completed'
    }
  }
  
  async getStatus(paymentId: string): Promise<payment_status> {
    return 'completed'
  }
  
  async validateAML(request: PaymentRequest): Promise<boolean> {
    return true
  }
}

// ============================================
// SEPA ADAPTER (EU)
// ============================================

export class SepaAdapter implements PaymentAdapter {
  method: payment_method = 'sepa'
  supportedCurrencies: string[] = ['EUR']
  
  private apiKey: string
  
  constructor() {
    this.apiKey = process.env.SEPA_API_KEY || ''
  }
  
  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      if (!this.apiKey) {
        return {
          success: true,
          paymentId: `sepa_${Date.now()}`,
          gatewayReference: 'mock_sepa_ref',
          status: 'processing' // SEPA takes time
        }
      }
      
      // Call SEPA API
      return {
        success: true,
        paymentId: `sepa_${Date.now()}`,
        status: 'processing'
      }
    } catch (error) {
      return {
        success: false,
        paymentId: '',
        status: 'failed',
        error: 'SEPA error'
      }
    }
  }
  
  async refund(paymentId: string, amount?: number): Promise<PaymentResponse> {
    return {
      success: true,
      paymentId: `refund_${paymentId}`,
      status: 'completed'
    }
  }
  
  async getStatus(paymentId: string): Promise<payment_status> {
    return 'completed'
  }
  
  async validateAML(request: PaymentRequest): Promise<boolean> {
    // EU AML compliance (AMLD5)
    const MAX_AMOUNT = 10000 // EUR
    
    if (request.amount > MAX_AMOUNT) {
      return false
    }
    
    return true
  }
}

// ============================================
// ADYEN ADAPTER (EU)
// ============================================

export class AdyenAdapter implements PaymentAdapter {
  method: payment_method = 'adyen'
  supportedCurrencies: string[] = ['EUR', 'USD', 'GBP', 'BGN']
  
  private apiKey: string
  private merchantAccount: string
  
  constructor() {
    this.apiKey = process.env.ADYEN_API_KEY || ''
    this.merchantAccount = process.env.ADYEN_MERCHANT_ACCOUNT || ''
  }
  
  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      if (!this.apiKey || !this.merchantAccount) {
        return {
          success: true,
          paymentId: `adyen_${Date.now()}`,
          gatewayReference: 'mock_adyen_ref',
          status: 'completed'
        }
      }
      
      // Call Adyen API
      const response = await fetch(
        'https://checkout-test.adyen.com/v68/payments',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': this.apiKey
          },
          body: JSON.stringify({
            merchantAccount: this.merchantAccount,
            amount: {
              currency: request.currency,
              value: Math.round(request.amount * 100)
            },
            reference: request.bookingId,
            metadata: {
              userId: request.userId
            }
          })
        }
      )
      
      const data = await response.json()
      
      return {
        success: data.resultCode === 'Authorised',
        paymentId: data.pspReference || '',
        gatewayReference: data.pspReference,
        status: data.resultCode === 'Authorised' ? 'completed' : 'pending'
      }
    } catch (error) {
      return {
        success: false,
        paymentId: '',
        status: 'failed',
        error: 'Adyen error'
      }
    }
  }
  
  async refund(paymentId: string, amount?: number): Promise<PaymentResponse> {
    return {
      success: true,
      paymentId: `refund_${paymentId}`,
      status: 'completed'
    }
  }
  
  async getStatus(paymentId: string): Promise<payment_status> {
    return 'completed'
  }
  
  async validateAML(request: PaymentRequest): Promise<boolean> {
    return true
  }
}

// ============================================
// KLARNA ADAPTER (EU)
// ============================================

export class KlarnaAdapter implements PaymentAdapter {
  method: payment_method = 'klarna'
  supportedCurrencies: string[] = ['EUR', 'USD', 'GBP', 'SEK', 'NOK', 'DKK']
  
  private apiKey: string
  
  constructor() {
    this.apiKey = process.env.KLARNA_API_KEY || ''
  }
  
  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      if (!this.apiKey) {
        return {
          success: true,
          paymentId: `klarna_${Date.now()}`,
          gatewayReference: 'mock_klarna_ref',
          status: 'completed'
        }
      }
      
      return {
        success: true,
        paymentId: `klarna_${Date.now()}`,
        status: 'processing'
      }
    } catch (error) {
      return {
        success: false,
        paymentId: '',
        status: 'failed',
        error: 'Klarna error'
      }
    }
  }
  
  async refund(paymentId: string, amount?: number): Promise<PaymentResponse> {
    return {
      success: true,
      paymentId: `refund_${paymentId}`,
      status: 'completed'
    }
  }
  
  async getStatus(paymentId: string): Promise<payment_status> {
    return 'completed'
  }
  
  async validateAML(request: PaymentRequest): Promise<boolean> {
    return true
  }
}

// ============================================
// PAYMENT FACTORY
// ============================================

export class PaymentAdapterFactory {
  private static adapters: Map<payment_method, PaymentAdapter> = new Map()
  
  static getAdapter(method: payment_method): PaymentAdapter {
    if (!this.adapters.has(method)) {
      this.adapters.set(method, this.createAdapter(method))
    }
    
    return this.adapters.get(method)!
  }
  
  private static createAdapter(method: payment_method): PaymentAdapter {
    switch (method) {
      // Crypto
      case 'usdt':
      case 'usdc':
      case 'eth':
      case 'obt_token':
      case 'a7a5_stable':
        return new CryptoPaymentAdapter(method)
      
      // Russia
      case 'yookassa':
        return new YookassaAdapter()
      case 'sbp':
        return new SBPAdapter()
      case 'mir':
        return new YookassaAdapter() // Process via Yookassa
      
      // EU
      case 'sepa':
        return new SepaAdapter()
      case 'adyen':
        return new AdyenAdapter()
      case 'klarna':
        return new KlarnaAdapter()
      
      // Bulgaria
      case 'borica':
      case 'epay_bg':
        return new AdyenAdapter() // Use Adyen as fallback
      
      // Cards
      case 'visa':
      case 'mastercard':
        return new AdyenAdapter()
      
      default:
        throw new Error(`Unsupported payment method: ${method}`)
    }
  }
}

// ============================================
// PAYMENT SERVICE
// ============================================

export class PaymentService {
  static async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    const adapter = PaymentAdapterFactory.getAdapter(request.method)
    
    // AML Validation
    const amlValid = await adapter.validateAML(request)
    if (!amlValid) {
      return {
        success: false,
        paymentId: '',
        status: 'failed',
        error: 'AML validation failed'
      }
    }
    
    // Process payment
    return adapter.processPayment(request)
  }
  
  static async refund(paymentId: string, method: payment_method, amount?: number): Promise<PaymentResponse> {
    const adapter = PaymentAdapterFactory.getAdapter(method)
    return adapter.refund(paymentId, amount)
  }
  
  static async getStatus(paymentId: string, method: payment_method): Promise<payment_status> {
    const adapter = PaymentAdapterFactory.getAdapter(method)
    return adapter.getStatus(paymentId)
  }
  
  static getSupportedMethods(): payment_method[] {
    return [
      // Crypto
      'usdt', 'usdc', 'eth', 'obt_token', 'a7a5_stable',
      // Russia
      'sbp', 'mir', 'yookassa',
      // EU
      'sepa', 'adyen', 'klarna',
      // Bulgaria
      'borica', 'epay_bg',
      // Cards
      'visa', 'mastercard'
    ]
  }
}
