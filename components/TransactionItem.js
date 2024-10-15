import styled from "styled-components";
import OptionsMenu from "./OptionsMenu";
import { useState } from "react";
import { formatNumber } from "@/lib/utils";

export default function TransactionItem({
  transaction,
  onHandleDeleteTransaction,
  handleOpenEditMode,
  openModal,
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  const formattedAmount = formatNumber(transaction);

  function handleDelete() {
    setIsDeleting(true);
  }

  function handleConfirmDelete() {
    onHandleDeleteTransaction(transaction.id);
  }

  function handleCancel() {
    setIsDeleting(false);
  }

  if (isDeleting) {
    return (
      <StyledConfirmActionContainer>
        <StyledCancelButton type="button" onClick={handleCancel}>
          Cancel
        </StyledCancelButton>
        <StyledConfirmButton type="button" onClick={handleConfirmDelete}>
          Really Delete
        </StyledConfirmButton>
      </StyledConfirmActionContainer>
    );
  }

  return (
    <StyledCard>
      <StyledOptionsContainer>
        <OptionsMenu
          onHandleDelete={handleDelete}
          onHandleOpenEditMode={handleOpenEditMode}
          onOpenModal={openModal}
          transaction={transaction}
        />
      </StyledOptionsContainer>
      <StyledName>{transaction.name}</StyledName>
      <StyledCategory>{transaction.category}</StyledCategory>
      <StyledAmount type={transaction.type}>{formattedAmount}</StyledAmount>
    </StyledCard>
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
  background-color: var(--friendly-red-color);
  color: white;
  height: fit-content;
`;

const StyledConfirmButton = styled.button`
  border: none;
  background-color: transparent;
  height: fit-content;
`;
