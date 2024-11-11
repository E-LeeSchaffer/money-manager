import GlobalStyle from "../styles";
import { useEffect, useState } from "react";
import { transactions } from "@/lib/transactions";
import { ulid } from "ulid";
import useLocalStorageState from "use-local-storage-state";
import Layout from "@/components/Layout";

export default function App({ Component, pageProps }) {
  const [transactionsList, setTransactionsList] = useLocalStorageState(
    "transactions",
    { defaultValue: transactions }
  );
  const [successMessage, setSuccessMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTransaction, setEditTransaction] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState(false);
  const [activeSelectionId, setActiveSelectionId] = useState(null);

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
    setSuccessMessage("Transaction successfully updated!");
  }

  function openSelection(selectionId) {
    setActiveSelectionId(selectionId);
  }

  function closeSelection() {
    setActiveSelectionId(null);
  }

  function handleOpenEditMode(transaction) {
    setIsEditing(true);
    setEditTransaction(transaction);
    setIsModalOpen(true);
  }

  function openModal() {
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  function handleFormSubmit(updatedTransaction) {
    handleEditTransaction({ ...editTransaction, ...updatedTransaction });
    closeModal();
  }
  function toggleForm() {
    setShowForm(!showForm);
  }

  function handleConfirmDelete(transaction) {
    handleDeleteTransaction(transaction.id);
    setIsDeletingId(false);
  }

  function handleOpenDeleteDialogue(id) {
    setIsDeletingId(id);
  }

  function handleCancelDeleteDialogue() {
    setIsDeletingId(false);
  }

  const componentProps = {
    transactionsList,
    successMessage,
    handleOpenEditMode,
    openModal,
    closeModal,
    handleFormSubmit,
    handleAddTransaction,
    handleConfirmDelete,
    handleDeleteTransaction,
    handleEditTransaction,
    isDeletingId,
    handleOpenDeleteDialogue,
    handleCancelDeleteDialogue,
    isModalOpen,
    isEditing,
    editTransaction,
    toggleForm,
    showForm,
    activeSelectionId,
    openSelection,
    closeSelection,

    ...pageProps,
  };

  return (
    <>
      <GlobalStyle />
      <Layout>
        <Component {...componentProps} />
      </Layout>
    </>
  );
}
