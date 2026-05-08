// Money formatter. Single source of truth for displaying prices across the app.
// Stops "$16.00" string-parsing bugs and lets us swap currency presentation in one place.

const SYMBOL = {
  GHS: "GH₵",
  USD: "$",
  EUR: "€",
  NGN: "₦",
};

/**
 * @param {import("./types.js").Money} money
 * @param {{ withSymbol?: boolean }} [options]
 * @returns {string}
 */
export function formatMoney(money, { withSymbol = true } = {}) {
  if (!money) return "";
  const major = (money.amount / 100).toFixed(2);
  if (!withSymbol) return major;
  const sym = SYMBOL[money.currency] ?? `${money.currency} `;
  return `${sym}${major}`;
}

/** @param {number} major @param {import("./types.js").CurrencyCode} currency */
export function money(major, currency = "GHS") {
  return { amount: Math.round(major * 100), currency };
}
