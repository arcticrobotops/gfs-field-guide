/**
 * Format a price for display.
 * @param amount  – numeric price (number or string)
 * @param currency – ISO 4217 currency code, defaults to "USD"
 * @returns formatted string, e.g. "$42" or "$42.50"
 */
export function formatPrice(
  amount: number | string,
  currency: string = 'USD',
): string {
  const value = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(value)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}
