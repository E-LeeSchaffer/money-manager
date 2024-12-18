import styled from "styled-components";
import Image from "next/image";
import Link from "next/link";
import { getCategoryIcon } from "@/lib/utils";
import Modal from "@/components/Modal";
import { capitalizeFirstLetter } from "@/lib/utils";
import BackButton from "@/components/BackButton";
import { useState } from "react";
import useSWR from "swr";

export default function SettingsPage({ successMessage, setSuccessMessage }) {
  const [isDuplicateError, setIsDuplicateError] = useState(false);
  const { data: categories = [], mutate: mutateCategories } =
    useSWR(`/api/categories`);
  const { data: transactionsList = [], mutate: mutateTransactions } =
    useSWR(`/api/transactions`);
  const [isEditCategory, setIsEditCategory] = useState(null);
  const [categoryToEdit, setcategoryToEdit] = useState(null);
  const [originalCategoryName, setOriginalCategoryName] = useState("");
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
  }

  function openModal() {
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
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

  return (
    <>
      <Modal isModalOpen={isModalOpen} onCloseModal={closeModal}>
        <StyledContainer>
          <StyledLegend>Confirm Deletion</StyledLegend>
          <StyledDeletionWarning>
            Deleting a category will remove the category from every transaction
            associated!
          </StyledDeletionWarning>
          <StyledCategoryToDelete>
            Category: {capitalizeFirstLetter(categoryToDelete?.name)}
          </StyledCategoryToDelete>
          <StyledConfirmActionContainer>
            <StyledCancelButton
              type="button"
              onClick={() => {
                handleCancelDeleteCategory();
              }}
            >
              Cancel
            </StyledCancelButton>
            <StyledConfirmButton
              type="button"
              onClick={() => {
                handleConfirmDeleteCategory(categoryToDelete._id);
                closeModal();
              }}
            >
              Really Delete
            </StyledConfirmButton>
          </StyledConfirmActionContainer>
        </StyledContainer>
      </Modal>

      <BackButton />
      <StyledPageLinks>
        <Link href={"/report"} aria-label="Report">
          <Image
            aria-hidden="true"
            src={"/images/report.svg"}
            alt="filter button"
            width={20}
            height={20}
          />
        </Link>
        <Link href={"/profile"} aria-label="Profile">
          <Image
            aria-hidden="true"
            src={"/images/profile.svg"}
            alt="profile button"
            width={20}
            height={20}
          />
        </Link>
      </StyledPageLinks>
      <main>
        <h2>Settings</h2>
        <StyledSettingsCard>
          <h3>Customize Categories</h3>
          <StyledCategoryContainer>
            {categories.map((category) => (
              <StyledCategory key={category._id}>
                <Image
                  src={getCategoryIcon(category.name, categories)}
                  alt={`${category.name} icon`}
                  width={36}
                  height={36}
                />
                {category._id === isEditCategory ? (
                  <StyledCategoryInput
                    type="text"
                    defaultValue={capitalizeFirstLetter(category.name)}
                    maxLength={20}
                    autoFocus
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        handleSaveEditCategory({
                          ...category,
                          name: event.target.value,
                        });
                      }
                      if (event.key === "Escape") {
                        category.name = originalCategoryName;
                        event.target.value = originalCategoryName;
                        event.target.blur();
                      }
                    }}
                  />
                ) : (
                  <StyledCategoryName>
                    {capitalizeFirstLetter(category.name)}
                  </StyledCategoryName>
                )}
                <StyledButtons>
                  <StyledCategoryEditButton>
                    <StyledImage
                      aria-hidden="true"
                      src="/images/pencil.svg"
                      alt="edit button"
                      onClick={() => {
                        handleOpenEditModeCategory(category);
                      }}
                      width={15}
                      height={15}
                    />
                  </StyledCategoryEditButton>
                  <StyledCategoryDeleteButton>
                    <StyledImage
                      aria-hidden="true"
                      src="/images/trash.svg"
                      alt="delete button"
                      onClick={() => {
                        openModal();
                        handleDeleteCategory(category);
                      }}
                      width={15}
                      height={15}
                    />
                  </StyledCategoryDeleteButton>
                </StyledButtons>
              </StyledCategory>
            ))}
            <StyledAddCategoryInput
              type="text"
              maxLength={20}
              placeholder="+ Add a new transaction"
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleAddCategory(event.target.value);
                  event.target.value = "";
                  event.target.blur();
                }
              }}
            ></StyledAddCategoryInput>
            {isDuplicateError && (
              <ErrorMessage>Category already exists!</ErrorMessage>
            )}
          </StyledCategoryContainer>
        </StyledSettingsCard>
        {successMessage && (
          <StyledSuccessMessage>{successMessage}</StyledSuccessMessage>
        )}
      </main>
    </>
  );
}

const StyledPageLinks = styled.div`
  display: flex;
  gap: var(--gap-lg);
  position: absolute;
  right: 16px;
  top: 16px;
  z-index: 2000;
`;

const StyledCategoryName = styled.span`
  display: flex;
  flex-grow: 1;
  align-items: center;
`;

const StyledCategoryToDelete = styled.p`
  font-size: var(--font-size-sm);
  padding: 0 0 8px 0;
`;

const StyledDeletionWarning = styled.p`
  font-size: var(--font-size-xs);
  line-height: 1.4;
  padding: 18px 0 8px 0;
`;

const StyledConfirmActionContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--gap-sm);
  border-radius: 16px;
  padding: 8px 16px;
  width: 300px;
  height: 70px;
  background-color: var(--white-bg-color);
`;

const StyledCancelButton = styled.button`
  border: none;
  background-color: transparent;
  height: fit-content;
  font-size: var(--font-size-xs);
  line-height: 1.4;
`;

const StyledConfirmButton = styled.button`
  border: none;
  border-radius: 4px;
  background-color: var(--friendly-red-color);
  color: var(--light-bg-color);
  height: fit-content;
  padding: 4px 8px;
  font-size: var(--font-size-xs);
  line-height: 1.4;
`;

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6px 4px 2px 4px;
`;

const StyledLegend = styled.p`
  font-size: var(--font-size-md);
`;

const StyledImage = styled(Image)`
  display: flex;
`;

const StyledCategory = styled.div`
  display: flex;
  gap: var(--gap-md);
`;

const StyledButtons = styled.div`
  display: flex;
  gap: var(--gap-md);
`;

const StyledCategoryEditButton = styled.button`
  border: none;
  background-color: transparent;
`;

const StyledCategoryDeleteButton = styled.button`
  border: none;
  background-color: transparent;
`;

const StyledSettingsCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--gap-xl);
`;

const StyledCategoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--gap-sm);
  width: 300px;
`;

const StyledCategoryItem = styled.div`
  display: flex;
  align-items: center;
  padding: 1px 0;
  gap: var(--gap-sm);
`;

const StyledCategoryInput = styled.input`
  display: flex;
  flex-grow: 1;
  border: none;
  background-color: inherit;

  &:focus {
    outline: none;
  }
`;

const StyledAddCategoryInput = styled.input`
  display: flex;
  border: none;
  background-color: inherit;
  margin: 10px 0 0 44px;

  &:focus {
    outline: none;
    border-bottom: 1px solid var(--dark-grey-color);
  }
`;

const ErrorMessage = styled.p`
  grid-area: typeErrorMessage;
  color: var(--friendly-red-color);
  font-size: var(--font-size-xs);
  line-height: 1.4;
`;

const StyledSuccessMessage = styled.p`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: var(--font-size-xs);
  line-height: 1.4;
  padding: 6px 4px;
  width: 220px;
  font-weight: 800;
  text-align: center;
  border-radius: 8px;
  box-shadow: var(--shadow-brand);
  z-index: 1000;
  background-color: var(--friendly-green-color);
`;
