/**
 * Format a price value with appropriate decimal places based on the price amount
 */
export const formatPrice = (price: number): string => {
  if (price < 0.01) return '$' + price.toFixed(6);
  if (price < 1) return '$' + price.toFixed(4);
  if (price < 10) return '$' + price.toFixed(2);
  if (price < 1000) return '$' + price.toFixed(2);
  return '$' + price.toLocaleString('en-US', { maximumFractionDigits: 2 });
};

/**
 * Format market cap values to use abbreviations (B, M, T)
 */
export const formatMarketCap = (marketCap: number): string => {
  if (marketCap >= 1e12) return '$' + (marketCap / 1e12).toFixed(2) + 'T';
  if (marketCap >= 1e9) return '$' + (marketCap / 1e9).toFixed(2) + 'B';
  if (marketCap >= 1e6) return '$' + (marketCap / 1e6).toFixed(2) + 'M';
  return '$' + marketCap.toLocaleString();
};

/**
 * Format percentage values with appropriate sign and decimal places
 */
export const formatPercentage = (percentage: number): string => {
  const sign = percentage >= 0 ? '+' : '';
  return `${sign}${percentage.toFixed(2)}%`;
}; 