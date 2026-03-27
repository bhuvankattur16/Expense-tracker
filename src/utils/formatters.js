/* =============================================================
   WealthTrack — formatters.js
   Utility functions for formatting data
   ============================================================= */

export function formatCurrency(amount) {
  const n = parseFloat(amount);
  if (!isFinite(n)) return '₹0.00';
  
  const abs = Math.abs(n);
  let formatted;
  
  if (abs >= 1e12)       formatted = (n / 1e12).toFixed(2) + 'T';
  else if (abs >= 1e9)   formatted = (n / 1e9).toFixed(2) + 'B';
  else if (abs >= 1e7)   formatted = (n / 1e7).toFixed(2) + 'Cr';
  else if (abs >= 1e5)   formatted = (n / 1e5).toFixed(2) + 'L';
  else                   formatted = abs.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  
  return (n < 0 ? '-₹' : '₹') + formatted;
}

export function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}
