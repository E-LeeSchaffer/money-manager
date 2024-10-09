import { isToday, isYesterday } from "date-fns";
import TransactionItem from "./TransactionItem";
import styled from "styled-components";
import { format } from "date-fns";

const groupTransactionByDate = (transactions) => {
  return transactions.reduce((groups, transaction) => {
    const date = new Date(transaction.date);
    let formatedDate;

    if (isToday(date)) {
      formatedDate = "Today";
    } else if (isYesterday(date)) {
      formatedDate = "Yesterday";
    } else {
      formatedDate = format(date, "dd.MM.yyyy");
    }

    if (!groups[formatedDate]) {
      groups[formatedDate] = [];
    }

    groups[formatedDate].push(transaction);
    return groups;
  }, {});
};

export default function TransactionsList({
  transactions,
  handleDeleteTransaction,
}) {
  const groupedTransactions = groupTransactionByDate(transactions);
  return (
    <StyledListContainer>
      {Object.keys(groupedTransactions).map((date) => (
        <li key={date}>
          <StyledDate>{date}</StyledDate>
          <ul>
            {groupedTransactions[date].map((transaction) => (
              <StyledList key={transaction.id}>
                <TransactionItem
                  handleDeleteTransaction={handleDeleteTransaction}
                  transaction={transaction}
                />
              </StyledList>
            ))}
          </ul>
        </li>
      ))}
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
  margin: 16px 0 8px 0;
`;

const StyledList = styled.li`
  margin-bottom: 4px;
`;
