export const formatNum = (number: number, showCurrency = true) =>
  (number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') || 0) +
  (showCurrency ? 'đ' : '')
