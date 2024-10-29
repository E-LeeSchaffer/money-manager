import Filter from "@/components/Filter";
import Header from "@/components/Header";
import Modal from "@/components/Modal";
import TransactionForm from "@/components/TransactionForm";
import TransactionsList from "@/components/TransactionsList";
import { transactions } from "@/lib/transactions";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { ulid } from "ulid";
import useLocalStorageState from "use-local-storage-state";
import Image from "next/image";
import AccountBalance from "@/components/AccountBalance";

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

  function handleCategorySelection(category = "") {
    setIsFilterSelectOpen(false);
    setSelectedCategory(category);
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
        <StyledFilterControls>
          {selectedCategory !== "" ? (
            <StyledSelectedCategoryContainer>
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
            </StyledSelectedCategoryContainer>
          ) : null}

          <Filter
            onFilterTransactions={handleCategorySelection}
            isFilterSelectOpen={isFilterSelectOpen}
            onToggleFilter={() => setIsFilterSelectOpen(!isFilterSelectOpen)}
            selectedCategory={selectedCategory}
          />
        </StyledFilterControls>

        <TransactionsList
          handleDeleteTransaction={handleDeleteTransaction}
          handleEditTransaction={handleEditTransaction}
          transactions={
            selectedCategory ? filteredTransactions : transactionsList
          }
          selectedCategory={selectedCategory}
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

const StyledFilterControls = styled.div`
  border-top: 1px solid var(--dark-grey-color);
  margin: 12px 0 12px 0;
  padding: 12px 10px;
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-areas: "selectedCategoryContainer filter";
`;

const StyledSelectedCategoryContainer = styled.div`
  grid-area: selectedCategoryContainer;
`;

const StyledSelectedCategoryDisplay = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
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

const StyledImage = styled(Image)`
  display: flex;
`;
