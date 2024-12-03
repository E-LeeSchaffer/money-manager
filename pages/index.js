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
  activeSelectionId,
  openSelection,
  closeSelection,
  categories,
}) {
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
  const [isCustomDatePickerOpen, setCustomDatePickerOpen] = useState(false);

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
    setCustomDatePickerOpen(false);
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
        setCustomDatePickerOpen(false);
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

  function sortTransactions(transactions) {
    return;
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
      {!showForm && (
        <StyledLink href={"/settings"} aria-label="Settings">
          <Image
            aria-hidden="true"
            src={"/images/settings.svg"}
            alt="filter button"
            width={15}
            height={15}
          />
        </StyledLink>
      )}

      <StyledTitle>Transactions</StyledTitle>

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

      <TransactionForm
        variant="add"
        onSubmit={handleAddTransaction}
        showForm={showForm}
        toggleForm={toggleForm}
        categories={categories}
      />

      {successMessage && (
        <StyledSuccessMessage>{successMessage}</StyledSuccessMessage>
      )}

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
          />
        </StyledControls>
      </StyledSelectionBar>

      <StyledTimelineFilterContainer>
        <TimelineFilter
          selectedTimeframe={selectedTimeframe}
          onTimeframeChange={handleTimeframeClick}
          customDateRange={customDateRange}
          onCustomDateChange={handleCustomDateChange}
          setIsCustomDatePickerOpen={setCustomDatePickerOpen}
          isCustomDatePickerOpen={isCustomDatePickerOpen}
        />
      </StyledTimelineFilterContainer>

      <StyledSortContainer>
        <SortControl
          sortOrder={sortOrder}
          onToggleSortOrder={handleToggleSortOrder}
        />
      </StyledSortContainer>

      {displayedTransactions.length > 0 ? (
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
      ) : (
        <StyledNoTransactionsFoundMessage>
          No transactions found.
        </StyledNoTransactionsFoundMessage>
      )}
    </>
  );
}

const StyledNoTransactionsFoundMessage = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 44px;
  color: var(--dark-grey-color);
`;

const StyledLink = styled(Link)`
  position: absolute;
  right: 16px;
  top: 10px;
  text-decoration: none;
  color: inherit;
  z-index: 2000;
`;

const StyledTitle = styled.h2`
  display: flex;
  justify-content: center;
  flex-grow: 1;
  text-align: center;
  font-size: 1.7rem;
  font-weight: 700;
  margin-top: 0;
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

const StyledTimelineFilterContainer = styled.div`
  display: flex;
  padding: 0 12px;
`;

const StyledSelectionBar = styled.div`
  border-top: 1px solid var(--dark-grey-color);
  margin: 12px 0 0 0;
  padding: 12px 10px;
  display: grid;
  grid-template-areas: "selectedCategory controls";
`;

const StyledSortContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 2px 10px;
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

const StyledBalanceContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
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
