import AccountBalance from "@/components/AccountBalance";
import Header from "@/components/Header";
import Modal from "@/components/Modal";
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
  const [showForm, setShowForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTransaction, setEditTransaction] = useState("");

  useEffect(() => {
    if (successMessage !== "") {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  function toggleForm() {
    setShowForm(!showForm);
  }

  function handleAddTransaction(data) {
    setTransactionsList([
      { ...data, id: ulid(), currency: "EUR" },
      ...transactionsList,
    ]);
    setSuccessMessage("Transaction successfully added!");
    setShowForm(false);
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
    setSuccessMessage("Transaction successfully updated!");
  }

  function handleOpenEditMode(transaction) {
    setIsEditing(true);
    setEditTransaction(transaction);
    setIsModalOpen(true);
    setShowForm(false);
  }

  function openModal() {
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setIsEditing(false);
  }

  function handleFormSubmit(updatedTransaction) {
    handleEditTransaction({ ...editTransaction, ...updatedTransaction });
    closeModal();
  }

  return (
    <>
      <Header />
      <main>
        <StyledTitle>Transactions</StyledTitle>
        <Modal isModalOpen={isModalOpen} onCloseModal={closeModal}>
          <TransactionForm
            isEditing={isEditing}
            initialData={editTransaction}
            onSubmit={handleFormSubmit}
            variant="edit"
            showForm={!showForm}
          />
        </Modal>
        <TransactionForm
          variant="add"
          onSubmit={handleAddTransaction}
          showForm={showForm}
          toggleForm={toggleForm}
        />
        {successMessage && (
          <StyleSuccessMessage>{successMessage}</StyleSuccessMessage>
        )}
        {!showForm && <AccountBalance transactions={transactionsList} />}
        <TransactionsList
          handleDeleteTransaction={handleDeleteTransaction}
          handleEditTransaction={handleEditTransaction}
          transactions={transactionsList}
          handleOpenEditMode={handleOpenEditMode}
          openModal={openModal}
          onCloseModal={closeModal}
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
