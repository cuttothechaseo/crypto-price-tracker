/**
 * Format a price value with appropriate decimal places based on the price amount
 */
export const formatPrice = (price: number): string => {
  return price.toLocaleString('en-US', { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
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
 * Format currency values to use abbreviations (B, M, T)
 */
export const formatCurrency = (amount: number): string => {
  if (amount >= 1_000_000_000) {
    return `$${(amount / 1_000_000_000).toFixed(2)}B`;
  } else if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(2)}M`;
  } else if (amount >= 1_000) {
    return `$${(amount / 1_000).toFixed(2)}K`;
  } else {
    return `$${amount.toFixed(2)}`;
  }
};

/**
 * Format percentage values with appropriate sign and decimal places
 */
export const formatPercentage = (percentage: number): string => {
  const sign = percentage >= 0 ? '+' : '';
  return `${sign}${percentage.toFixed(2)}%`;
}; 