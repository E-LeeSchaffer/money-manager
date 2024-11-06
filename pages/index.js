import Filter from "@/components/Filter";
import Modal from "@/components/Modal";
import TransactionForm from "@/components/TransactionForm";
import TransactionsList from "@/components/TransactionsList";
import styled from "styled-components";
import { useState } from "react";
import useLocalStorageState from "use-local-storage-state";

import Image from "next/image";
import AccountBalance from "@/components/AccountBalance";
import Search from "@/components/Search";

export default function HomePage({
  transactionsList,
  successMessage,
  handleOpenEditMode,
  openModal,
  closeModal,
  handleFormSubmit,
  handleAddTransaction,
  handleDeleteTransaction,
  handleEditTransaction,
  isModalOpen,
  isEditing,
  editTransaction,
  toggleForm,
  showForm,
  handleOpenDeleteDialogue,
  handleConfirmDelete,
  handleCancelDeleteDialogue,
  isDeletingId,
}) {
  const [isFilterSelectOpen, setIsFilterSelectOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useLocalStorageState(
    "selectedCategory",
    { defaultValue: "" }
  );
  const filteredTransactions = selectedCategory
    ? transactionsList.filter(
        (transaction) => transaction.category === selectedCategory
      )
    : transactionsList;
  const [isSearching, setIsSearching] = useState(false);
  const [searchItem, setSearchItem] = useState("");
  const [searchedTransaction, setSearchedTransaction] = useState("");

  function handleCategorySelection(category = "") {
    setIsFilterSelectOpen(false);
    setSelectedCategory(category);
  }

  function handleSearch() {
    setIsSearching(!isSearching);
    if (isSearching === false) {
      setSearchItem("");
      setSearchedTransaction("");
    }
  }

  function handleInputChange(event) {
    const searchTerm = event.target.value;
    setSearchItem(searchTerm);
    const searchedTransactions = filteredTransactions.filter((transaction) => {
      return transaction.name.toLowerCase().includes(searchTerm.toLowerCase());
    });
    setSearchedTransaction(searchedTransactions);
  }

  return (
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
        <StyledSuccessMessage>{successMessage}</StyledSuccessMessage>
      )}

      {!showForm && <AccountBalance transactions={transactionsList} />}

      <StyledSelectionBar>
        {selectedCategory !== "" ? (
          <StyledSelectedCategoryDisplay>
            <StyledSelectedCategoryName>
              {selectedCategory}
            </StyledSelectedCategoryName>
            <StyledDeselectButton
              type="button"
              onClick={() => handleCategorySelection("")}
            >
              <StyledImage
                src={"/images/x-square-fill.svg"}
                alt="filter button"
                width={10}
                height={10}
              />
            </StyledDeselectButton>
          </StyledSelectedCategoryDisplay>
        ) : null}

        <StyledControls>
          {isSearching ? (
            <StyledInput
              type="text"
              name="searchbar"
              value={searchItem}
              onChange={handleInputChange}
              autoFocus
            />
          ) : null}
          <Search handleSearch={handleSearch} />
          <Filter
            onFilterTransactions={handleCategorySelection}
            isFilterSelectOpen={isFilterSelectOpen}
            onToggleFilter={() => setIsFilterSelectOpen(!isFilterSelectOpen)}
            selectedCategory={selectedCategory}
          />
        </StyledControls>
      </StyledSelectionBar>

      <TransactionsList
        handleEditTransaction={handleEditTransaction}
        transactions={
          searchedTransaction !== "" && isSearching
            ? searchedTransaction
            : filteredTransactions
        }
        selectedCategory={selectedCategory}
        handleOpenEditMode={handleOpenEditMode}
        openModal={openModal}
        onCloseModal={closeModal}
        handleOpenDeleteDialogue={handleOpenDeleteDialogue}
        handleConfirmDelete={handleConfirmDelete}
        handleCancelDeleteDialogue={handleCancelDeleteDialogue}
        handleDeleteTransaction={handleDeleteTransaction}
        isDeletingId={isDeletingId}
      />
    </main>
  );
}

const StyledTitle = styled.h2`
  text-align: center;
  font-size: 1.7rem;
  font-weight: 700;
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

const StyledSelectionBar = styled.div`
  border-top: 1px solid var(--dark-grey-color);
  margin: 12px 0 12px 0;
  padding: 12px 10px;
  display: grid;
  grid-template-areas: "selectedCategory controls";
`;

const StyledSelectedCategoryDisplay = styled.div`
  grid-area: selectedCategory;
  display: flex;
  align-items: center;
  width: fit-content;
  height: 24px;
  padding: 0 8px;
  gap: 8px;
  border: 1px solid var(--dark-grey-color);
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const StyledSelectedCategoryName = styled.div`
  font-size: 0.8rem;
  line-height: 1;
`;

const StyledDeselectButton = styled.button`
  border: none;
  background-color: transparent;
  padding: 0;
`;

const StyledControls = styled.div`
  display: flex;
  grid-area: controls;
  justify-content: flex-end;
`;

const StyledImage = styled(Image)`
  display: flex;
`;

const StyledInput = styled.input`
  display: flex;
  border: none;
  width: 8rem;
  border-bottom: 1px solid var(--dark-grey-color);
  background-color: inherit;

  &:focus {
    outline: none;
  }
`;
