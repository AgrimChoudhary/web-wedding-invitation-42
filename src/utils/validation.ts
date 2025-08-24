import { z } from 'zod';

// Common validation schemas
export const emailSchema = z.string().email('Please enter a valid email address');
export const phoneSchema = z.string().regex(/^[\+]?[\d\s\-\(\)]+$/, 'Please enter a valid phone number');
export const nameSchema = z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters');

// RSVP validation schema
export const rsvpSchema = z.object({
  attendees: z.number().min(1, 'At least 1 attendee is required').max(10, 'Maximum 10 attendees allowed'),
  dietary_requirements: z.string().max(500, 'Dietary requirements must be less than 500 characters').optional(),
  special_requests: z.string().max(500, 'Special requests must be less than 500 characters').optional(),
  email: emailSchema.optional(),
  phone: phoneSchema.optional(),
});

// Guest form validation schema
export const guestSchema = z.object({
  name: nameSchema,
  email: emailSchema.optional(),
  phone: phoneSchema.optional(),
  plus_one: z.boolean().optional(),
});

// Wishes validation schema
export const wishSchema = z.object({
  content: z.string().min(1, 'Wish content is required').max(1000, 'Wish must be less than 1000 characters'),
  guest_name: nameSchema,
  guest_id: z.string().min(1, 'Guest ID is required'),
});

// Validation helper functions
export const validateField = (value: string, schema: z.ZodSchema): { isValid: boolean; error?: string } => {
  try {
    schema.parse(value);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, error: error.errors[0]?.message };
    }
    return { isValid: false, error: 'Validation failed' };
  }
};

export const validateForm = <T>(data: T, schema: z.ZodSchema<T>): { isValid: boolean; errors: Record<string, string> } => {
  try {
    schema.parse(data);
    return { isValid: true, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        if (err.path.length > 0) {
          errors[err.path[0].toString()] = err.message;
        }
      });
      return { isValid: false, errors };
    }
    return { isValid: false, errors: { general: 'Validation failed' } };
  }
};