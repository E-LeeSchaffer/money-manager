import styled from "styled-components";
import OptionsMenu from "./OptionsMenu";
import { useState } from "react";
import { formatNumber } from "@/lib/utils";
import Link from "next/link";

export default function TransactionItem({
  transaction,
  handleConfirmDelete,
  handleOpenEditMode,
  openModal,
  isDeletingId,
  handleCancelDeleteDialogue,
  handleOpenDeleteDialogue,
}) {
  const formattedAmount = formatNumber(transaction);
  const isDeleting = isDeletingId === transaction.id;

  if (isDeleting) {
    return (
      <StyledConfirmActionContainer>
        <StyledCancelButton type="button" onClick={handleCancelDeleteDialogue}>
          Cancel
        </StyledCancelButton>
        <StyledConfirmButton
          type="button"
          onClick={() => {
            handleConfirmDelete(transaction);
          }}
        >
          Really Delete
        </StyledConfirmButton>
      </StyledConfirmActionContainer>
    );
  }

  return (
    <StyledCardWrapper>
      <StyledLink href={`/transactions/${transaction.id}`}>
        <StyledCard>
          <StyledName>{transaction.name}</StyledName>
          <StyledCategory>{transaction.category}</StyledCategory>
          <StyledAmount type={transaction.type}>{formattedAmount}</StyledAmount>
        </StyledCard>
      </StyledLink>
      <StyledOptionsContainer>
        <OptionsMenu
          handleOpenDeleteDialogue={() =>
            handleOpenDeleteDialogue(transaction.id)
          }
          onHandleOpenEditMode={handleOpenEditMode}
          onOpenModal={openModal}
          transaction={transaction}
        />
      </StyledOptionsContainer>
    </StyledCardWrapper>
  );
}

const StyledCardWrapper = styled.div`
  position: relative;
  width: 100%;
`;
const StyledCard = styled.div`
  border: 0.1px solid var(--dark-grey-color);
  border-radius: 16px;
  padding: 8px 16px;
  display: grid;
  width: 100%;
  min-height: 4rem;
  grid-template-areas: "name options" "category amount";
  background-color: white;
`;

const StyledOptionsContainer = styled.div`
  grid-area: options;
  position: absolute;
  top: 8px;
  right: 16px;
  z-index: 10;
  background-color: transparent;
`;

const StyledLink = styled(Link)`
  color: inherit;
  text-decoration: none;
`;

const StyledName = styled.div`
  grid-area: name;
  overflow: hidden;
  text-overflow: ellipsis;
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
  width: 18rem;
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
