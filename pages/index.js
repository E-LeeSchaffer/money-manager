import TransactionsList from "@/components/TransactionsList";

export default function HomePage() {
  return (
    <>
      <header>
        <h1>Money Manager</h1>
      </header>
      <main>
        <h2>Transactions</h2>
        <TransactionsList />
      </main>
    </>
  );
}
