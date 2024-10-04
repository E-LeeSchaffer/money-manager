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

  const formatNumber = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(transaction.amount);

  return (
    <>
      <StyledDate>{formatDate(transaction.date)}</StyledDate>
      <StyledCard>
        <StyledId>{transaction.id}</StyledId>
        <StyledCategory>{transaction.category}</StyledCategory>
        <StyledAmount type={transaction.type}>{formatNumber}</StyledAmount>
      </StyledCard>
    </>
  );
}

const StyledCard = styled.div`
  border: 1px solid black;
  border-radius: 16px;
  padding: 4px 16px;
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: 1fr 1fr;
  line-height: 0;
`;

const StyledDate = styled.p`
  font-size: 12px;
`;

const StyledId = styled.p`
  grid-column: 1/2;
  grid-row: 1;
  font-weight: bold;
`;

const StyledCategory = styled.p`
  grid-column: 1/2;
  grid-row: 2;
`;

const StyledAmount = styled.p`
  color: ${(transaction) => (transaction.type === "expense" ? "red" : "green")};
  grid-column: 2/2;
  grid-row: 2;
`;
