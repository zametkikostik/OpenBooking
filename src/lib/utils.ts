import { createHash } from 'crypto'

/**
 * GDPR-compliant IP hashing
 */
export function hashIP(ip: string): string {
  return createHash('sha256').update(ip).digest('hex')
}

/**
 * Generate unique slug from text
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

/**
 * Multilingual content getter
 */
export function getMultilingualContent(
  content: Record<string, string> | string,
  language: string = 'en'
): string {
  if (typeof content === 'string') return content
  return content[language] || content['en'] || ''
}

/**
 * Calculate booking totals
 */
export function calculateBookingTotal(
  pricePerNight: number,
  nights: number,
  serviceFeePercent: number = 10,
  cleaningFee: number = 0
): { subtotal: number; serviceFee: number; cleaningFee: number; total: number } {
  const subtotal = pricePerNight * nights
  const serviceFee = subtotal * (serviceFeePercent / 100)
  const total = subtotal + serviceFee + cleaningFee

  return { subtotal, serviceFee, cleaningFee, total }
}

/**
 * Validate booking dates
 */
export function validateBookingDates(
  checkIn: Date,
  checkOut: Date,
  minNights: number,
  maxNights: number
): { valid: boolean; error?: string } {
  if (checkIn <= new Date()) {
    return { valid: false, error: 'Check-in date must be in the future' }
  }

  if (checkOut <= checkIn) {
    return { valid: false, error: 'Check-out must be after check-in' }
  }

  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))

  if (nights < minNights) {
    return { valid: false, error: `Minimum ${minNights} nights required` }
  }

  if (nights > maxNights) {
    return { valid: false, error: `Maximum ${maxNights} nights allowed` }
  }

  return { valid: true }
}

/**
 * Format currency amount
 */
export function formatCurrency(amount: number, currency: string = 'USD', locale: string = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount)
}

/**
 * Calculate reputation score change
 */
export function calculateReputationChange(
  eventType: string,
  rating?: number
): number {
  const changes: Record<string, number> = {
    booking_completed: 5,
    review_received_positive: 10,
    review_received_neutral: 2,
    review_received_negative: -5,
    cancellation_by_user: -10,
    cancellation_by_host: -20,
    kyc_verified: 15,
    dispute_resolved_positive: 8,
    dispute_resolved_negative: -15,
  }

  let change = changes[eventType] || 0

  // Bonus for high ratings
  if (rating && rating >= 5) {
    change += 5
  } else if (rating && rating <= 2) {
    change -= 3
  }

  return change
}

/**
 * Escrow state machine transitions
 */
export const ESCROW_STATES = {
  pending: ['payment_locked', 'cancelled'],
  payment_locked: ['checked_in', 'cancelled'],
  checked_in: ['completed', 'cancelled'],
  completed: ['settled'],
  settled: [],
  cancelled: [],
} as const

export function canTransitionBooking(
  from: keyof typeof ESCROW_STATES,
  to: string
): boolean {
  const allowed = ESCROW_STATES[from]
  return (allowed as readonly string[])?.includes(to) || false
}

/**
 * Web3 address formatter
 */
export function formatAddress(address: string, chars = 4): string {
  if (!address) return ''
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`
}

/**
 * Chain ID to network name
 */
export function getNetworkName(chainId: number): string {
  const networks: Record<number, string> = {
    1: 'Ethereum Mainnet',
    5: 'Goerli Testnet',
    137: 'Polygon',
    80001: 'Mumbai Testnet',
    42161: 'Arbitrum One',
    10: 'Optimism',
  }
  return networks[chainId] || `Unknown (${chainId})`
}

/**
 * Safe number parsing
 */
export function safeParseNumber(value: any, defaultValue = 0): number {
  const parsed = parseFloat(value)
  return isNaN(parsed) ? defaultValue : parsed
}

/**
 * Date formatter
 */
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  })
}

/**
 * Relative time formatter
 */
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
  return `${Math.floor(diffDays / 365)} years ago`
}
