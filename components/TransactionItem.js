import styled from "styled-components";
import Button from "./DeleteButton";
import OptionsButton from "./OptionsButton";

export default function TransactionItem({
  transaction,
  handleDeleteTransaction,
}) {
  const formatNumber = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(
    transaction.type === "expense"
      ? -Math.abs(transaction.amount)
      : transaction.amount
  );

  return (
    <>
      <StyledCard>
        <StyledOptionsButton>
          <OptionsButton
            id={transaction.id}
            handleDeleteTransaction={handleDeleteTransaction}
          />
        </StyledOptionsButton>

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
    "name options"
    "category amount";
  background-color: white;
`;

const StyledOptionsButton = styled.div`
  grid-area: options;
  justify-self: end;
`;

const StyledName = styled.p`
  font-weight: 500;
  grid-area: name;
`;

const StyledCategory = styled.p`
  font-size: 0.75rem;
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
