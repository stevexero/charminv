export const sanitizePositiveInteger = (value: string): string => {
  let sanitized = value.replace(/[^0-9]/g, '');
  if (sanitized.length > 1 && sanitized.startsWith('0')) {
    sanitized = sanitized.replace(/^0+/, ''); // Remove leading zeros
  }
  return sanitized;
};
