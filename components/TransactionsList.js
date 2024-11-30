import { isToday, isYesterday } from "date-fns";
import TransactionItem from "./TransactionItem";
import styled from "styled-components";
import { formatDate } from "@/lib/utils";

const groupTransactionByDate = (transactions) => {
  const sortedTransactions = transactions.sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
  return sortedTransactions.reduce((groups, transaction) => {
    const date = new Date(transaction.date);
    let formatedDate;

    if (isToday(date)) {
      formatedDate = "Today";
    } else if (isYesterday(date)) {
      formatedDate = "Yesterday";
    } else {
      formatedDate = formatDate(date, "dd.MM.yyyy");
    }

    if (!groups[formatedDate]) {
      groups[formatedDate] = [];
    }

    groups[formatedDate].unshift(transaction);
    return groups;
  }, {});
};

export default function TransactionsList({
  transactions,
  selectedCategory,
  handleDeleteTransaction,
  handleEditTransaction,
  handleOpenEditMode,
  openModal,
  handleOpenDeleteDialogue,
  handleCancelDeleteDialogue,
  handleConfirmDelete,
  isDeletingId,
  activeSelectionId,
  openSelection,
  closeSelection,
}) {
  const groupedTransactions = groupTransactionByDate(transactions);
  const emptyListMessage =
    transactions.length === 0 && selectedCategory
      ? "No matches found"
      : "No transactions available. Please add a new transaction.";

  return (
    <StyledListContainer>
      {transactions.length > 0 ? (
        Object.keys(groupedTransactions).map((date) => {
          return (
            <li key={date}>
              <StyledDate>{date}</StyledDate>
              <ul>
                {groupedTransactions[date].map((transaction) => (
                  <StyledList key={transaction._id}>
                    <TransactionItem
                      handleConfirmDelete={handleConfirmDelete}
                      handleOpenDeleteDialogue={handleOpenDeleteDialogue}
                      onHandleEditTransaction={handleEditTransaction}
                      transaction={transaction}
                      handleOpenEditMode={handleOpenEditMode}
                      openModal={openModal}
                      handleCancelDeleteDialogue={handleCancelDeleteDialogue}
                      handleDeleteTransaction={handleDeleteTransaction}
                      isDeletingId={isDeletingId}
                      activeSelectionId={activeSelectionId}
                      openSelection={openSelection}
                      closeSelection={closeSelection}
                    />
                  </StyledList>
                ))}
              </ul>
            </li>
          );
        })
      ) : (
        <StyledEmptyListMessage>{emptyListMessage}</StyledEmptyListMessage>
      )}
    </StyledListContainer>
  );
}

const StyledListContainer = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledDate = styled.h3`
  font-size: 0.8rem;
  margin: 0 0 8px 0;
`;

const StyledList = styled.li`
  margin-bottom: 12px;
  width: 18rem;
`;

const StyledEmptyListMessage = styled.p`
  display: flex;
  justify-content: center;
  text-align: center;
  color: var(--dark-grey-color);
`;
