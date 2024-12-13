import GlobalStyle from "../styles";
import { useEffect, useState } from "react";
import useSWR, { SWRConfig } from "swr";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";

const fetcher = (url) => fetch(url).then((response) => response.json());

export default function App({ Component, pageProps }) {
  const [successMessage, setSuccessMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTransaction, setEditTransaction] = useState(null);
  const [showForm, setShowForm] = useState(false);
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

  function toggleForm() {
    setShowForm(!showForm);
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
        "Content-Type": "application/json",
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
    setSuccessMessage("Note successfully deleted!");
  }

  function handleCancelDeleteCategory() {
    setCategoryToDelete(null);
    closeModal();
  }

  async function handleDeleteNote(transaction) {
    const response = await fetch(`/api/transactions/${transaction._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...transaction, note: "" }),
    });

    if (response.ok) {
      mutateTransactions();
      setSuccessMessage("Note successfully deleted!");
    } else {
      console.error("Failed to delete note.");
    }
  }

  async function handleAddNote(note, transaction) {
    const response = await fetch(`/api/transactions/${transaction._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...transaction, note }),
    });

    if (response.ok) {
      mutateTransactions();
      setSuccessMessage(
        transaction.note
          ? "Note successfully updated!"
          : "Note successfully added!"
      );
    } else {
      console.error("Failed to add note.");
    }
  }

  const componentProps = {
    categories,
    successMessage,
    setSuccessMessage,
    handleOpenEditMode,
    openModal,
    closeModal,
    isModalOpen,
    isEditing,
    setIsEditing,
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
    handleAddNote,
    handleDeleteNote,
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
