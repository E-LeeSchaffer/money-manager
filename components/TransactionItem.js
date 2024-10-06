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
        <StyledName>{transaction.name}</StyledName>
        <StyledCategory>{transaction.category}</StyledCategory>
        <StyledAmount type={transaction.type}>{formatNumber}</StyledAmount>
      </StyledCard>
    </>
  );
}

const StyledCard = styled.div`
  border: 0.1px solid var(--dark-grey-color);
  border-radius: 16px;
  padding: 12px 16px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  align-items: center;
  row-gap: 8px;
  grid-template-areas:
    "name name"
    "category amount";
  background-color: white;
`;

const StyledDate = styled.p`
  font-size: 12px;
  margin: 12px 0;
`;

const StyledName = styled.p`
  font-weight: 500;
  grid-area: name;
`;

const StyledCategory = styled.p`
  font-size: 14px;
  grid-area: category;
`;

const StyledAmount = styled.p`
  color: ${(props) =>
    props.type === "expense"
      ? "var(--friendly-red-color)"
      : "var(--friendly-green-color)"};

  grid-area: amount;
  text-align: end;
`;
