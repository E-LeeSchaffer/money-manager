import styled from "styled-components";
import { isToday, isYesterday, format } from "date-fns";

export default function TransactionItem({ transaction }) {
  const formatDate = (date) => {
    if (!date) return "";
    const newDateFormat = new Date(date);

    if (isToday(newDateFormat)) {
      return "Today";
    } else if (isYesterday(newDateFormat)) {
      return "Yesterday";
    } else {
      return format(newDateFormat, "dd.MM.yyyy");
    }
  };
  return (
    <>
      <p>{formatDate(transaction.date)}</p>

      <StyledCard>
        <p>{transaction.id}</p>
        <StyledContainer>
          <p>{transaction.category}</p>

          <StyledAmount type={transaction.type}>
            {transaction.amount}
          </StyledAmount>
        </StyledContainer>
      </StyledCard>
    </>
  );
}

const StyledAmount = styled.p`
  color: ${(transaction) => (transaction.type === "expense" ? "red" : "green")};
`;

const StyledCard = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid black;
  border-radius: 4px;
  padding: 4px 16px;
`;

const StyledContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;
