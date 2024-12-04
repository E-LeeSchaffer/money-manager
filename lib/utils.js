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
  if (!date || isNaN(new Date(date).getTime())) {
    return "";
  }
  const formatedDate = format(new Date(date), "yyyy-MM-dd");

  const [year, month, day] = formatedDate.split("-");

  return `${day}.${month}.${year}`;
}

export function getCategoryIcon(categoryName) {
  const icon =
    iconMap[categoryName?.toLowerCase()] || "/icons/default-icon.svg";
  return icon;
}

const iconMap = {
  health: "/icons/health.svg",
  transportation: "/icons/transportation.svg",
  education: "/icons/education.svg",
  entertainment: "/icons/entertainment.svg",
  groceries: "/icons/groceries.svg",
  insurance: "/icons/insurance.svg",
  investment: "/icons/investment.svg",
  miscellaneous: "/icons/miscellaneous.svg",
  rent: "/icons/rent.svg",
  restaurants: "/icons/restaurants.svg",
  salary: "/icons/salary.svg",
  savings: "/icons/savings.svg",
  utilities: "/icons/utilities.svg",
};
