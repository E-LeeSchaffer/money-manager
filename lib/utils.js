export function formatNumber(transaction) {
  const formatter = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  });

  const amount =
    transaction.type === "expense"
      ? -Math.abs(transaction.amount)
      : transaction.amount;

  return formatter.format(amount);
}
