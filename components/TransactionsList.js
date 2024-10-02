import { transactions } from "@/lib/transactions";
import TransactionItem from "./TransactionItem";

export default function TransactionsList() {
  return (
    <>
      <ul>
        {transactions.map((transaction) => (
          <li key={transaction.id}>
            <TransactionItem transaction={transaction} />
          </li>
        ))}
      </ul>
    </>
  );
}
