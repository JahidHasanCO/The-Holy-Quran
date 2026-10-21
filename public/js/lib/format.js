const AR_DIGITS = '٠١٢٣٤٥٦٧٨٩';

export const toArabicDigits = (n) => String(n).replace(/[0-9]/g, (d) => AR_DIGITS[+d]);

export function ordinal(n) {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
}

export const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
