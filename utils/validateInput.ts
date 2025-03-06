export const sanitizePositiveInteger = (value: string): string => {
  let sanitized = value.replace(/[^0-9]/g, '');
  if (sanitized.length > 1 && sanitized.startsWith('0')) {
    sanitized = sanitized.replace(/^0+/, ''); // Remove leading zeros
  }
  return sanitized;
};

export const sanitizeNameForDb = (value: string | null | undefined): string => {
  if (!value) return '';

  const sanitized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/gi, '')
    .replace(/\s+/g, '-');

  return /^[a-z]/.test(sanitized) ? sanitized : '';
};

export const capitalizeWords = (value: string | null | undefined): string => {
  if (!value) return '';

  return value
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace('-', ' ');
};
