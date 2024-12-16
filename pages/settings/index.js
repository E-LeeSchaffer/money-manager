import styled from "styled-components";
import Image from "next/image";
import Link from "next/link";
import { getCategoryIcon } from "@/lib/utils";
import Modal from "@/components/Modal";
import { capitalizeFirstLetter } from "@/lib/utils";
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

      <StyledBackLink href="/">
        <StyledImage
          aria-hidden="true"
          src="/images/arrow-return-left.svg"
          alt="edit button"
          width={15}
          height={15}
        />
        Back
      </StyledBackLink>
      <StyledTitle>Settings</StyledTitle>
      <StyledSettingsCard>
        <StyledSubheading>Customize Categories</StyledSubheading>
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
                  defaultValue={category.name}
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
            placeholder="+ Add new category"
            maxLength={20}
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
    </>
  );
}

const StyledCategoryName = styled.span`
  display: flex;
  flex-grow: 1;
  align-items: center;
`;

const StyledCategoryToDelete = styled.p`
  font-size: 1.2rem;
  margin: 0;
  padding: 0 0 8px 0;
`;

const StyledDeletionWarning = styled.p`
  font-size: 0.8rem;
  margin: 0;
  padding: 18px 0 8px 0;
`;

const StyledConfirmActionContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  width: 18rem;
  min-height: 4rem;
  background-color: white;
`;

const StyledCancelButton = styled.button`
  border: none;
  border-radius: 4px;
  background-color: var(--friendly-red-color);
  color: white;
  height: fit-content;
  font-size: 16px;
`;

const StyledConfirmButton = styled.button`
  border: none;
  background-color: transparent;
  height: fit-content;
  font-size: 16px;
`;

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6px 4px 2px 4px;
`;

const StyledLegend = styled.p`
  font-size: 1.2rem;
  margin: 0;
`;

const StyledImage = styled(Image)`
  display: flex;
`;

const StyledCategory = styled.div`
  display: flex;
  gap: 0.5rem;
  padding-bottom: 4px;
`;

const StyledButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const StyledCategoryEditButton = styled.button`
  border: none;
  background-color: transparent;
  padding: 0;
`;

const StyledCategoryDeleteButton = styled.button`
  border: none;
  background-color: transparent;
  padding: 0;
`;

const StyledBackLink = styled(Link)`
  display: flex;
  align-items: center;
  background-color: var(--accent-color);
  text-decoration: none;
  width: fit-content;
  color: black;
  position: relative;
  top: 10px;
  left: 10px;
  border: var(--accent-color);
  padding: 4px 8px;
  border-radius: 4px;
  display: flex;
  gap: 0.5rem;
`;

const StyledTitle = styled.h2`
  text-align: center;
  font-size: 1.7rem;
  font-weight: 700;
`;

const StyledSettingsCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledSubheading = styled.h3`
  text-align: center;
`;

const StyledCategoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 18rem;
  justify-content: center;
`;

const StyledCategoryItem = styled.div`
  display: flex;
  align-items: center;
  padding: 1px 0;
  gap: 4px;
`;

const StyledCategoryInput = styled.input`
  display: flex;
  flex-grow: 1;
  font-family: sofia-pro, sans-serif;
  border: none;
  background-color: inherit;
  font-size: 16px;
  padding: 0;

  &:focus {
    outline: none;
  }
`;

const StyledAddCategoryInput = styled.input`
  display: flex;
  font-family: sofia-pro, sans-serif;
  border: none;
  background-color: inherit;
  font-size: 16px;
  padding: 0;

  &:focus {
    outline: none;
    border-bottom: 1px solid var(--dark-grey-color);
  }
`;

const ErrorMessage = styled.p`
  grid-area: typeErrorMessage;
  color: red;
  font-size: 0.6rem;
`;

const StyledSuccessMessage = styled.p`
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
