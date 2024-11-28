import { format } from "date-fns";

export function formatNumber(transaction) {
  if (!transaction) return "";

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

  return type.charAt(0).toUpperCase() + type.slice(1);
}

export function formatDate(date) {
  if (!date) return "";

  const formatedDate = format(new Date(date), "yyyy-MM-dd");

  const [year, month, day] = formatedDate.split("-");

  return `${day}.${month}.${year}`;
}

export function getCategoryIcon(categoryName) {
  const category = [].find(
    (matchingCategory) => matchingCategory.name === categoryName
  );
  return category ? category.icon : "/icons/default-icon.svg";
}
