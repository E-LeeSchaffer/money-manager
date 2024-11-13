import GlobalStyle from "../styles";
import { useEffect, useState } from "react";
import { transactions } from "@/lib/transactions";
import { ulid } from "ulid";
import useLocalStorageState from "use-local-storage-state";
import Layout from "@/components/Layout";
import { categories as initialCategories } from "@/lib/categories";
import { capitalizeFirstLetter } from "@/lib/utils";

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
  const [isDuplicateError, setIsDuplicateError] = useState(false);
  const [categories, setCategories] = useLocalStorageState("categories", {
    defaultValue: initialCategories,
  });

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

  function handleAddCategory(category) {
    setIsDuplicateError(false);

    const normalizedCategoryName = category.trim().toLowerCase();

    const isDuplicate = categories.some(
      (category) => category.name.toLowerCase() === normalizedCategoryName
    );

    if (isDuplicate) {
      setIsDuplicateError(true);
      return;
    }

    const newCategory = { name: capitalizeFirstLetter(category), id: ulid() };
    setCategories([...categories, newCategory]);
    setSuccessMessage("Category successfully added!");
  }

  const componentProps = {
    transactionsList,
    categories,
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
    handleAddCategory,
    isDuplicateError,

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
