import TransactionItem from "./TransactionItem";

export default function TransactionsList({ transactions }) {
  return (
    <ul>
      {transactions.map((transaction) => (
        <li key={transaction.id}>
          <TransactionItem transaction={transaction} />
        </li>
      ))}
    </ul>
  );
}
