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

export function capitalizeFirstLetter(type) {
  if (typeof type !== "string") return "";
  if (!type) return "";
  return type.charAt(0).toUpperCase() + type.slice(1);
}

export function formatDate(date) {
  if (!date) return "";
  const [year, month, day] = date.split("-");
  return `${day}.${month}.${year}`;
}
