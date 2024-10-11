import Header from "@/components/Header";
import EditTransactionModal from "@/components/Modal";
import TransactionForm from "@/components/TransactionForm";
import TransactionsList from "@/components/TransactionsList";
import { transactions } from "@/lib/transactions";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { ulid } from "ulid";
import useLocalStorageState from "use-local-storage-state";

export default function HomePage() {
  const [transactionsList, setTransactionsList] = useLocalStorageState(
    "transactions",
    { defaultValue: transactions }
  );
  const [successMessage, setSuccessMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (successMessage !== "") {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  function handleAddTransaction(data) {
    setTransactionsList([
      { ...data, id: ulid(), currency: "EUR" },
      ...transactionsList,
    ]);
    setSuccessMessage("Transaction successfully added!");
  }

  function handleDeleteTransaction(id) {
    setTransactionsList(
      transactionsList.filter((transaction) => transaction.id !== id)
    );
    setSuccessMessage("Transaction successfully deleted!");
  }

  function handleEditTransaction(updatedTransaction) {
    setTransactionsList(
      transactionsList.map((transaction) =>
        transaction.id === updatedTransaction.id
          ? updatedTransaction
          : transaction
      )
    );
  }

  function handleOpenEditMode() {
    setIsEditing(true);
  }

  function handleConfirmEdit() {
    handleEditTransaction(transactionsList.id);
  }

  function openModal() {
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  function handleUpdateData(updatedTransaction) {}

  return (
    <>
      <Header />
      <main>
        <StyledTitle>Transactions</StyledTitle>
        <EditTransactionModal
          isModalOpen={isModalOpen}
          onCloseModal={closeModal}
          isEditing={isEditing}
        ></EditTransactionModal>
        <TransactionForm
          formHeader="Add a new transaction"
          buttonText="Add"
          onAdd={handleAddTransaction}
        />
        {successMessage && (
          <StyleSuccessMessage>{successMessage}</StyleSuccessMessage>
        )}
        <TransactionsList
          handleDeleteTransaction={handleDeleteTransaction}
          handleEditTransaction={handleEditTransaction}
          transactions={transactionsList}
          handleOpenEditMode={handleOpenEditMode}
          openModal={openModal}
          onCloseModal={closeModal}
          handleUpdateData={handleUpdateData}
        />
      </main>
    </>
  );
}

const StyledTitle = styled.h2`
  text-align: center;
  font-size: 1.7rem;
  font-weight: 700;
  padding-top: 24px;
`;

const StyleSuccessMessage = styled.p`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  color: var(--text-color-dark);
  font-size: 0.8rem;
  padding: 6px 4px;
  width: 220px;
  font-weight: 800;
  text-align: center;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  background-color: var(--friendly-green-color);
`;
