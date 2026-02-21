import { z } from 'zod';

/**
 * Validation Schemas
 * Using Zod for runtime type validation
 */

// Email validation
export const emailSchema = z.string().email('Invalid email address').max(255);

// Password validation (min 8 chars, 1 uppercase, 1 lowercase, 1 number)
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

// Phone validation (international format)
export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number')
  .optional()
  .or(z.literal(''));

// Wallet address validation
export const walletAddressSchema = z
  .string()
  .regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address')
  .optional()
  .or(z.literal(''));

// Transaction hash validation
export const transactionHashSchema = z
  .string()
  .regex(/^0x[a-fA-F0-9]{64}$/, 'Invalid transaction hash')
  .optional()
  .or(z.literal(''));

// Booking date validation
export const bookingDateSchema = z.string().refine(
  (date) => {
    const parsed = new Date(date);
    return !isNaN(parsed.getTime());
  },
  { message: 'Invalid date format' }
);

// Booking creation schema
export const createBookingSchema = z
  .object({
    property_id: z.string().uuid('Invalid property ID'),
    check_in_date: bookingDateSchema,
    check_out_date: bookingDateSchema,
    num_guests: z.number().int().positive('Must have at least 1 guest'),
    special_requests: z.string().max(1000).optional(),
  })
  .refine(
    (data) => {
      const checkIn = new Date(data.check_in_date);
      const checkOut = new Date(data.check_out_date);
      return checkOut > checkIn;
    },
    { message: 'Check-out date must be after check-in date' }
  );

// Payment schema
export const paymentSchema = z.object({
  booking_id: z.string().uuid().optional(),
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().length(3, 'Currency must be 3-letter code'),
  method: z.enum([
    'eth',
    'dai',
    'a7a5',
    'sbp',
    'mir',
    'yookassa',
    'sepa',
    'adyen',
    'klarna',
    'borica',
    'epay',
  ]),
  transaction_hash: transactionHashSchema,
});

// Property creation schema
export const createPropertySchema = z.object({
  title: z.string().min(5).max(200),
  description: z.string().max(5000).optional(),
  property_type: z.string(),
  room_type: z.string().optional(),
  address_line1: z.string().min(5),
  address_line2: z.string().optional(),
  city: z.string(),
  state: z.string().optional(),
  postal_code: z.string().optional(),
  country: z.string(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  bedrooms: z.number().int().nonnegative(),
  bathrooms: z.number().int().nonnegative(),
  max_guests: z.number().int().positive(),
  amenities: z.array(z.string()).optional(),
  photos: z.array(z.string().url()).optional(),
  price_per_night: z.number().positive(),
  currency: z.string().default('USD'),
  minimum_nights: z.number().int().positive().default(1),
  maximum_nights: z.number().int().positive().default(365),
  instant_book: z.boolean().default(false),
});

// Review schema
export const createReviewSchema = z.object({
  booking_id: z.string().uuid(),
  guest_review: z.string().max(2000).optional(),
  host_review: z.string().max(2000).optional(),
  guest_rating: z.number().int().min(1).max(5).optional(),
  cleanliness_rating: z.number().int().min(1).max(5).optional(),
  accuracy_rating: z.number().int().min(1).max(5).optional(),
  communication_rating: z.number().int().min(1).max(5).optional(),
  location_rating: z.number().int().min(1).max(5).optional(),
  checkin_rating: z.number().int().min(1).max(5).optional(),
  value_rating: z.number().int().min(1).max(5).optional(),
});

// Vault deposit schema
export const vaultDepositSchema = z.object({
  pool_id: z.string().uuid(),
  amount: z.number().positive(),
  asset: z.string(),
});

// Profile update schema
export const updateProfileSchema = z.object({
  full_name: z.string().max(100).optional(),
  phone: phoneSchema,
  country: z.string().optional(),
  city: z.string().optional(),
  wallet_address: walletAddressSchema,
  language: z.string().optional(),
  timezone: z.string().optional(),
});

// UTM parameters schema
export const utmSchema = z.object({
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_term: z.string().optional(),
  utm_content: z.string().optional(),
});

// Export type inference helpers
export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type PaymentInput = z.infer<typeof paymentSchema>;
export type CreatePropertyInput = z.infer<typeof createPropertySchema>;
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type VaultDepositInput = z.infer<typeof vaultDepositSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UTMInput = z.infer<typeof utmSchema>;

// Validation helper function
export function validate<T extends z.ZodType>(
  schema: T,
  data: unknown
): { success: boolean; data?: z.infer<T>; error?: string } {
  const result = schema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      error: result.error.errors.map((e) => e.message).join(', '),
    };
  }

  return {
    success: true,
    data: result.data,
  };
}
