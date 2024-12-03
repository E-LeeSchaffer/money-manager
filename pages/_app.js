import GlobalStyle from "../styles";
import { useEffect, useState } from "react";
import useSWR, { SWRConfig } from "swr";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";

const fetcher = (url) => fetch(url).then((response) => response.json());

export default function App({ Component, pageProps }) {
  const { data: transactionsList = [], mutate: mutateTransactions } = useSWR(
    `/api/transactions`,
    fetcher
  );
  const [successMessage, setSuccessMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTransaction, setEditTransaction] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState(false);
  const [activeSelectionId, setActiveSelectionId] = useState(null);
  const [isDuplicateError, setIsDuplicateError] = useState(false);
  const { data: categories = [], mutate: mutateCategories } = useSWR(
    `/api/categories`,
    fetcher
  );
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
    });

    const newTransaction = await response.json();

    mutateTransactions();
    setSuccessMessage("Transaction successfully added!");
    return newTransaction;
  }

  async function handleDeleteTransaction(id) {
    const response = await fetch(`/api/transactions/${id}`, {
      method: "DELETE",
    });
    mutateTransactions();
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
      mutateTransactions();
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

  async function handleAddCategory(category) {
    const correctFormat = {
      name: category,
    };
    setIsDuplicateError(false);

    const normalizedCategoryName = category.trim().toLowerCase();

    const isDuplicate = categories.some(
      (category) => category.name.toLowerCase() === normalizedCategoryName
    );

    if (isDuplicate) {
      setIsDuplicateError(true);
      return;
    }

    const response = await fetch("/api/categories", {
      method: "POST",
      headers: {
        "Content-Type": "applications/json",
      },
      body: JSON.stringify(correctFormat),
    });

    if (response.ok) {
      mutateCategories();
    }
  }

  function handleOpenEditModeCategory(category) {
    setOriginalCategoryName(category.name);
    setIsEditCategory(category._id);
    setcategoryToEdit(category);
  }

  async function handleSaveEditCategory(editedCategory) {
    const response = await fetch(`/api/categories/${editedCategory._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editedCategory),
    });

    if (response.ok) {
      mutateCategories();
      mutateTransactions();
      setSuccessMessage("Category successfully updated!");
      setIsEditCategory(null);
    } else {
      console.error("Failed to update category.");
    }

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
  }

  function handleDeleteCategory(category) {
    setCategoryToDelete(category);
  }

  async function handleConfirmDeleteCategory(id) {
    const response = await fetch(`/api/categories/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      mutateCategories();
      mutateTransactions();
    }
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
