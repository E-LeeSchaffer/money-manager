import Filter from "@/components/Filter";
import Modal from "@/components/Modal";
import TransactionForm from "@/components/TransactionForm";
import TransactionsList from "@/components/TransactionsList";
import styled from "styled-components";
import { useState } from "react";
import useLocalStorageState from "use-local-storage-state";
import Image from "next/image";
import AccountBalance from "@/components/AccountBalance";
import IncomeExpense from "@/components/IncomeExpense";
import Search from "@/components/Search";
import SortControl from "@/components/SortControl";
import Link from "next/link";
import TimelineFilter from "@/components/TimelineFilter";
import useSWR from "swr";

export default function HomePage({ successMessage, setSuccessMessage }) {
  const { data: transactionsList = [], mutate: mutateTransactions } =
    useSWR(`/api/transactions`);
  const { data: categories = [] } = useSWR(`/api/categories`);

  const [filteredTransactionType, setFilteredTransactionType] =
    useLocalStorageState("balance");
  const [selectedCategory, setSelectedCategory] = useLocalStorageState(
    "selectedCategory",
    { defaultValue: "" }
  );

  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedTimeframe, setSelectedTimeframe] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchItem, setSearchItem] = useState("");
  const [customDateRange, setCustomDateRange] = useState({
    start: null,
    end: null,
  });
  const [isCustomDatePickerOpen, setIsCustomDatePickerOpen] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTransaction, setEditTransaction] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [activeSelectionId, setActiveSelectionId] = useState(null);

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

  function openSelection(selectionId) {
    setActiveSelectionId(selectionId);
  }

  function closeSelection() {
    setActiveSelectionId(null);
  }

  function handleOpenDeleteDialogue(id) {
    setIsDeletingId(id);
  }

  function handleCancelDeleteDialogue() {
    setIsDeletingId(null);
  }

  function toggleForm() {
    setShowForm(!showForm);
  }

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
  }

  async function handleDeleteTransaction(id) {
    const response = await fetch(`/api/transactions/${id}`, {
      method: "DELETE",
    });
    mutateTransactions();
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

  function handleFormSubmit(updatedTransaction) {
    handleEditTransaction({ ...editTransaction, ...updatedTransaction });

    closeModal();
  }

  function handleConfirmDelete(transaction) {
    handleDeleteTransaction(transaction._id);
    setIsDeletingId(false);
  }

  function calculateDateRange(days) {
    const currentDate = new Date();
    const startDate = new Date();
    startDate.setDate(currentDate.getDate() - days);
    return startDate;
  }

  function handleTimeframeClick(value) {
    if (selectedTimeframe === value) {
      setSelectedTimeframe(null);
      setCustomDateRange({ start: null, end: null });
    } else {
      setSelectedTimeframe(value);
      setCustomDateRange({ start: null, end: null });
    }
    setIsCustomDatePickerOpen(false);
  }

  function handleCustomDateChange(dates) {
    if (Array.isArray(dates)) {
      let [start, end] = dates;

      if (end) {
        end = new Date(end);
        end.setHours(23, 59, 59, 999);
      }

      setCustomDateRange({ start, end });

      if (start && end) {
        setSelectedTimeframe(null);
        setIsCustomDatePickerOpen(false);
      }
    }
  }

  function handleCategorySelection(category = "") {
    setSelectedCategory(category);
    closeSelection();
    if (isSearching) handleSearch();
  }

  function handleSearch() {
    setIsSearching(!isSearching);
    if (isSearching) {
      setSearchItem("");
    }
  }

  function closeSearch() {
    setIsSearching(false);
    setSearchItem("");
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      event.target.blur();
    }
  }

  function handleInputChange(event) {
    const searchTerm = event.target.value;
    setSearchItem(searchTerm);
  }

  function handleToggleSortOrder() {
    setSortOrder((prevSortOrder) => {
      const newSortOrder = prevSortOrder === "desc" ? "asc" : "desc";

      return newSortOrder;
    });
  }

  const filteredTransactions = transactionsList.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    const matchesCategory =
      selectedCategory === "uncategorized"
        ? transaction?.category === undefined
        : selectedCategory
        ? transaction?.category?._id === selectedCategory
        : true;

    const matchesSearch = searchItem
      ? transaction.name.toLowerCase().includes(searchItem.toLowerCase())
      : true;

    const matchesTimeframe = selectedTimeframe
      ? transactionDate >= calculateDateRange(selectedTimeframe)
      : true;

    const matchesCustomDateRange =
      customDateRange.start && customDateRange.end
        ? transactionDate >= customDateRange.start &&
          transactionDate <= customDateRange.end
        : true;

    return (
      matchesCategory &&
      matchesSearch &&
      matchesTimeframe &&
      matchesCustomDateRange
    );
  });

  const selectedCategoryName =
    selectedCategory === "uncategorized"
      ? "Uncategorized"
      : categories.find((category) => category._id === selectedCategory)?.name;

  const displayedTransactions = filteredTransactions.toSorted((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);

    return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
  });

  const incomeTotal = transactionsList
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const expenseTotal = transactionsList
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const currentBalance = incomeTotal - expenseTotal;

  const filteredIncome = filteredTransactions
    .filter((transaction) => transaction.type === "income")
    .reduce((accumulator, transaction) => accumulator + transaction.amount, 0);

  const filteredExpense = filteredTransactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((accumulator, transaction) => accumulator + transaction.amount, 0);

  const profit = filteredIncome - filteredExpense;

  return (
    <>
      <StyledPageLinks>
        {!showForm && (
          <>
            <Link href={"/report"} aria-label="Report">
              <Image
                src={"/images/report.svg"}
                alt="report button"
                width={20}
                height={20}
              />
            </Link>
            <Link href={"/settings"} aria-label="Settings">
              <Image
                aria-hidden="true"
                src={"/images/settings.svg"}
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
          </>
        )}
      </StyledPageLinks>

      <Modal isModalOpen={isModalOpen} onCloseModal={closeModal}>
        <TransactionForm
          isEditing={isEditing}
          initialData={editTransaction}
          onSubmit={handleFormSubmit}
          variant="edit"
          showForm={!showForm}
          categories={categories}
          closeModal={closeModal}
        />
      </Modal>

      <main>
        <h2>Transactions</h2>

        <TransactionForm
          variant="add"
          onSubmit={handleAddTransaction}
          showForm={showForm}
          toggleForm={toggleForm}
          categories={categories}
        />

        {!showForm && (
          <StyledBalanceContainer>
            <IncomeExpense
              transactions={filteredTransactions}
              onFilterChange={setFilteredTransactionType}
              filteredTransactionType={filteredTransactionType}
            />
            <AccountBalance
              income={filteredIncome}
              expense={filteredExpense}
              total={profit}
              currentBalance={currentBalance}
              filteredTransactionType={filteredTransactionType}
            />
          </StyledBalanceContainer>
        )}

        <StyledSelectionBar>
          {selectedCategory !== "" ? (
            <StyledSelectedCategoryDisplay>
              <StyledSelectedCategoryName>
                {selectedCategoryName}
              </StyledSelectedCategoryName>
              <StyledDeselectButton
                type="button"
                onClick={() => handleCategorySelection("")}
                aria-label="Deselect"
              >
                <StyledImage
                  aria-hidden="true"
                  src={"/images/x-square-fill.svg"}
                  alt="filter button"
                  width={15}
                  height={15}
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
                onKeyDown={handleKeyDown}
                autoFocus
              />
            ) : null}
            <Search handleSearch={handleSearch} isSearching={isSearching} />
            <Filter
              onFilterTransactions={handleCategorySelection}
              openSelection={openSelection}
              selectedCategory={selectedCategory}
              closeSelection={closeSelection}
              activeSelectionId={activeSelectionId}
              closeSearch={closeSearch}
              categories={categories}
              transactionsList={transactionsList}
            />
          </StyledControls>
        </StyledSelectionBar>

        <StyledTimelineFilterContainer>
          <TimelineFilter
            selectedTimeframe={selectedTimeframe}
            onTimeframeChange={handleTimeframeClick}
            customDateRange={customDateRange}
            onCustomDateChange={handleCustomDateChange}
            isCustomDatePickerOpen={isCustomDatePickerOpen}
            setIsCustomDatePickerOpen={setIsCustomDatePickerOpen}
          />
        </StyledTimelineFilterContainer>

        {displayedTransactions.length > 0 ? (
          <>
            <StyledSortContainer>
              <SortControl
                sortOrder={sortOrder}
                onToggleSortOrder={handleToggleSortOrder}
              />
            </StyledSortContainer>
            <TransactionsList
              handleEditTransaction={handleEditTransaction}
              transactions={displayedTransactions}
              selectedCategory={selectedCategory}
              handleOpenEditMode={handleOpenEditMode}
              openModal={openModal}
              onCloseModal={closeModal}
              handleOpenDeleteDialogue={handleOpenDeleteDialogue}
              handleConfirmDelete={handleConfirmDelete}
              handleCancelDeleteDialogue={handleCancelDeleteDialogue}
              handleDeleteTransaction={handleDeleteTransaction}
              isDeletingId={isDeletingId}
              sortOrder={sortOrder}
              activeSelectionId={activeSelectionId}
              openSelection={openSelection}
              closeSelection={closeSelection}
              categories={categories}
            />
          </>
        ) : (
          <StyledNoTransactionsFoundMessage>
            No transactions found.
          </StyledNoTransactionsFoundMessage>
        )}

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

const StyledBalanceContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-bottom: 20px;
  margin-bottom: 10px;
  border-bottom: 1px solid var(--dark-grey-color);
`;

const StyledSelectionBar = styled.div`
  padding-left: 12px;
  display: grid;
  align-items: center;
  grid-template-areas: "selectedCategory controls";
`;

const StyledSelectedCategoryDisplay = styled.div`
  grid-area: selectedCategory;
  display: flex;
  align-items: center;
  width: fit-content;
  padding: 6px 10px;
  gap: var(--gap-md);
  border: var(--border-brand);
  border-radius: 8px;
  box-shadow: var(--shadow-brand);
`;

const StyledSelectedCategoryName = styled.div`
  font-size: var(--font-size-xs);
  line-height: 1.4;
`;

const StyledDeselectButton = styled.button`
  border: none;
  background-color: transparent;
`;

const StyledImage = styled(Image)`
  display: flex;
`;

const StyledControls = styled.div`
  display: flex;
  grid-area: controls;
  justify-content: flex-end;
`;

const StyledInput = styled.input`
  padding-top: 10px;
  height: 36px;
  width: 100px;
  display: flex;
  border: none;
  font-size: var(--font-size-xs);
  line-height: 1.4;
  border-bottom: 1px solid var(--dark-grey-color);
  background-color: inherit;

  &:focus {
    outline: none;
  }
`;

const StyledTimelineFilterContainer = styled.div`
  display: flex;
  padding-inline: 12px;
`;

const StyledSortContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  position: relative;
  top: 16px;
  left: 300px;
  width: fit-content;
  z-index: 10;
`;

const StyledNoTransactionsFoundMessage = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 44px;
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
