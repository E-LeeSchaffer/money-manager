import styled from "styled-components";

export default function TransactionItem({ transaction }) {
  const formatNumber = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(transaction.amount);

  return (
    <>
      <StyledDate>{transaction.formatedDate}</StyledDate>
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
  padding: 4px 16px;
  display: grid;
  width: 20rem;
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
  margin: 4px 0;
`;

const StyledName = styled.p`
  font-weight: 500;
  grid-area: name;
`;

const StyledCategory = styled.p`
  font-size: 12px;
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
