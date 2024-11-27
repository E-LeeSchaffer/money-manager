import GlobalStyle from "../styles";
import { useEffect, useReducer, useState } from "react";
import useSWR, { SWRConfig } from "swr";
import { ulid } from "ulid";
import useLocalStorageState from "use-local-storage-state";
import Layout from "@/components/Layout";
import { categories as initialCategories } from "@/lib/categories";
import { getCategoryIcon } from "@/lib/utils";
import { capitalizeFirstLetter } from "@/lib/utils";
import { useRouter } from "next/router";

const fetcher = (url) => fetch(url).then((response) => response.json());

export default function App({ Component, pageProps }) {
  const { data: transactionsList = [], mutate } = useSWR(
    `/api/transactions`,
    fetcher
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
  const [isEditCategory, setIsEditCategory] = useState(null);
  const [categoryToEdit, setcategoryToEdit] = useState(null);
  const [originalCategoryName, setOriginalCategoryName] = useState("");
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (successMessage !== "") {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  async function handleAddTransaction(data) {
    const response = await fetch("/api/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((newTransaction) => {
        mutate([...transactionsList, newTransaction], false);
        setSuccessMessage("Transaction successfully added!");
      });
  }

  async function handleDeleteTransaction(id) {
    const response = await fetch(`/api/transactions/${id}`, {
      method: "DELETE",
    });
    mutate();
    if (response.ok) {
      router.push("/");
    }
    setSuccessMessage("Transaction successfully deleted!");
  }

  async function handleEditTransaction(updatedTransaction) {
    const response = await fetch(
      `/api/transactions/${updatedTransaction._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTransaction),
      }
    );

    if (response.ok) {
      mutate(
        transactionsList.map((transaction) =>
          transaction._id === updatedTransaction._id
            ? updatedTransaction
            : transaction
        ),
        false
      );
      setSuccessMessage("Transaction successfully updated!");
    } else {
      console.error("Failed to update transaction.");
    }
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
    handleDeleteTransaction(transaction._id);
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

  function handleOpenEditModeCategory(category) {
    setOriginalCategoryName(category.name);
    setIsEditCategory(category.id);
    setcategoryToEdit(category);
  }

  function handleSaveEditCategory(editedCategory) {
    const normalizedUpdatedName = editedCategory.name.trim().toLowerCase();

    const isDuplicate = categories.some(
      (category) =>
        category.id !== editedCategory.id &&
        category.name.toLowerCase() === normalizedUpdatedName
    );

    if (isDuplicate) {
      setIsDuplicateError(true);
      return;
    }

    setCategories(
      categories.map((category) =>
        category.id === editedCategory.id ? editedCategory : category
      )
    );
    setSuccessMessage("Category successfully updated!");
    setIsEditCategory(null);
  }

  function handleDeleteCategory(category) {
    setCategoryToDelete(category.name);
  }

  function handleConfirmDeleteCategory() {
    setTransactionsList((prevTransactions) =>
      prevTransactions.map((transaction) =>
        transaction.category === categoryToDelete
          ? { ...transaction, category: "Uncategorized" }
          : transaction
      )
    );

    setCategories((prevCategories) =>
      prevCategories.filter((category) => category.name !== categoryToDelete)
    );

    setSuccessMessage("Category successfully deleted!");
    setCategoryToDelete(null);
    closeModal();
  }

  function handleCancelDeleteCategory() {
    setCategoryToDelete(null);
    closeModal();
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
    isEditCategory,
    handleOpenEditModeCategory,
    handleSaveEditCategory,
    originalCategoryName,
    handleDeleteCategory,
    handleConfirmDeleteCategory,
    categoryToDelete,
    handleCancelDeleteCategory,
    ...pageProps,
  };

  return (
    <>
      <GlobalStyle />
      <SWRConfig value={{ fetcher }}>
        <Layout>
          <Component {...componentProps} />
        </Layout>
      </SWRConfig>
    </>
  );
}
