import TransactionForm from "@/components/TransactionForm";
import TransactionsList from "@/components/TransactionsList";
import { transactions } from "@/lib/transactions";
import { ulid } from "ulid";
import useLocalStorageState from "use-local-storage-state";

export default function HomePage() {
  const [transactionsList, setTransactionsList] = useLocalStorageState(
    "transactions",
    { defaultValue: transactions }
  );

  function handleAddTransaction(data) {
    setTransactionsList([
      { ...data, id: ulid(), currency: "EUR" },
      ...transactionsList,
    ]);
  }

  return (
    <>
      <header>
        <h1>Money Manager</h1>
      </header>
      <main>
        <h2>Transactions</h2>
        <TransactionForm onAdd={handleAddTransaction} />
        <TransactionsList transactions={transactionsList} />
      </main>
    </>
  );
}
