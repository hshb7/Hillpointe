export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

export const validateRequired = (value: string | number | null | undefined): boolean => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};

export const validateMinLength = (value: string, minLength: number): boolean => {
  return value.length >= minLength;
};

export const validateMaxLength = (value: string, maxLength: number): boolean => {
  return value.length <= maxLength;
};

export const validateNumericRange = (value: number, min?: number, max?: number): boolean => {
  if (min !== undefined && value < min) return false;
  if (max !== undefined && value > max) return false;
  return true;
};

export const validateZipCode = (zipCode: string): boolean => {
  const zipRegex = /^\d{5}(-\d{4})?$/;
  return zipRegex.test(zipCode);
};

export const validateDate = (date: string): boolean => {
  const dateObj = new Date(date);
  return !isNaN(dateObj.getTime());
};

export const validateFutureDate = (date: string): boolean => {
  const dateObj = new Date(date);
  const now = new Date();
  return dateObj > now;
};

export const validatePastDate = (date: string): boolean => {
  const dateObj = new Date(date);
  const now = new Date();
  return dateObj < now;
};

export interface ValidationRule {
  validator: (value: any) => boolean;
  message: string;
}

export const createValidationRules = (rules: ValidationRule[]) => {
  return (value: any): string | null => {
    for (const rule of rules) {
      if (!rule.validator(value)) {
        return rule.message;
      }
    }
    return null;
  };
};