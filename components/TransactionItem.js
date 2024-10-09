import styled from "styled-components";
import OptionsButton from "./OptionsButton";
import { useState } from "react";

export default function TransactionItem({
  transaction,
  onHandleDeleteTransaction,
}) {
  const formatNumber = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(
    transaction.type === "expense"
      ? -Math.abs(transaction.amount)
      : transaction.amount
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOptionSelect, setIsOptionSelect] = useState(false);

  function toggleOptions() {
    setIsOptionSelect(!isOptionSelect);
  }

  function handleDelete() {
    setIsDeleting(true);
  }

  function handleConfirmDelete() {
    onHandleDeleteTransaction(transaction.id);
  }

  function handleCancel() {
    setIsDeleting(false);
    setIsOptionSelect(false);
  }

  return (
    <>
      {!isDeleting ? (
        <StyledCard>
          <StyledOptionsContainer>
            <OptionsButton
              handleDelete={handleDelete}
              handleConfirmDelete={handleConfirmDelete}
              handleCancel={handleCancel}
              onToggleOptions={toggleOptions}
              isDeleting={isDeleting}
              isOptionSelect={isOptionSelect}
            />
          </StyledOptionsContainer>
          <StyledName>{transaction.name}</StyledName>
          <StyledCategory>{transaction.category}</StyledCategory>
          <StyledAmount type={transaction.type}>{formatNumber}</StyledAmount>
        </StyledCard>
      ) : (
        <StyledConfirmActionContainer>
          <StyledCancelButton type="button" onClick={handleCancel}>
            Cancel
          </StyledCancelButton>
          <StyledConfirmButton type="button" onClick={handleConfirmDelete}>
            Really Delete
          </StyledConfirmButton>
        </StyledConfirmActionContainer>
      )}
    </>
  );
}

const StyledCard = styled.div`
  border: 0.1px solid var(--dark-grey-color);
  border-radius: 16px;
  padding: 8px 16px;
  display: grid;
  width: 20rem;
  min-height: 4rem;
  grid-template-areas:
    "name options"
    "category amount";
  background-color: white;
`;

const StyledOptionsContainer = styled.div`
  grid-area: options;
  display: flex;
  justify-content: flex-end;
  position: relative;
`;

const StyledName = styled.div`
  grid-area: name;
`;

const StyledCategory = styled.div`
  grid-area: category;
  font-size: x-small;
  display: flex;
`;

const StyledAmount = styled.div`
  color: ${(props) =>
    props.type === "expense"
      ? "var(--friendly-red-color)"
      : "var(--friendly-green-color)"};
  grid-area: amount;
  display: flex;
  justify-content: end;
`;

const StyledConfirmActionContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  border: 0.1px solid var(--dark-grey-color);
  border-radius: 16px;
  padding: 8px 16px;
  width: 20rem;
  min-height: 4rem;
  background-color: white;
`;

const StyledCancelButton = styled.button`
  border: none;
  border-radius: 4px;
  background-color: red;
  color: white;
  height: fit-content;
`;

const StyledConfirmButton = styled.button`
  border: none;
  background-color: transparent;
  height: fit-content;
`;
