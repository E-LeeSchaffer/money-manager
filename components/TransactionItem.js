import styled from "styled-components";
import OptionsMenu from "./OptionsMenu";
import { formatNumber } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { capitalizeFirstLetter } from "@/lib/utils";

import { getCategoryIcon } from "@/lib/utils";

export default function TransactionItem({
  transaction,
  handleConfirmDelete,
  handleOpenEditMode,
  openModal,
  isDeletingId,
  handleCancelDeleteDialogue,
  handleOpenDeleteDialogue,
  activeSelectionId,
  openSelection,
  closeSelection,
  categories,
}) {
  const formattedAmount = formatNumber(transaction);
  const isDeleting = isDeletingId === transaction._id;

  const categoryIcon = getCategoryIcon(transaction?.category?.name);

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
      <Link href={`/transactions/${transaction._id}`}>
        <StyledCard>
          <StyledName>{transaction.name}</StyledName>
          <StyledCategory>
            <Image
              src={categoryIcon}
              alt={`${transaction?.category?.name} icon`}
              width={24}
              height={24}
            />
            {transaction?.category === undefined
              ? "Uncategorized"
              : capitalizeFirstLetter(transaction?.category?.name)}
          </StyledCategory>
          <StyledAmount type={transaction.type}>{formattedAmount}</StyledAmount>
        </StyledCard>
      </Link>
      <StyledOptionsContainer>
        <OptionsMenu
          handleOpenDeleteDialogue={() =>
            handleOpenDeleteDialogue(transaction._id)
          }
          onHandleOpenEditMode={handleOpenEditMode}
          onOpenModal={openModal}
          transaction={transaction}
          activeSelectionId={activeSelectionId}
          openSelection={openSelection}
          closeSelection={closeSelection}
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
  border: var(--border-brand);
  border-radius: 16px;
  padding: 8px 16px;
  display: grid;
  grid-template-areas: "name options" "category amount";
  background-color: var(--white-bg-color);
  height: 70px;
`;

const StyledOptionsContainer = styled.div`
  grid-area: options;
  position: absolute;
  padding: 12px 12px 8px;
  top: 0;
  right: 0;
  z-index: 100;
  background-color: transparent;
`;

const StyledName = styled.div`
  grid-area: name;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-bottom: 4px;
`;

const StyledCategory = styled.div`
  grid-area: category;
  display: flex;
  font-size: var(--font-size-xs);
  line-height: 1.4;
  display: flex;
  gap: var(--gap-md);
  align-items: center;
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
  gap: var(--gap-sm);
  border: var(--border-brand);
  border-radius: 16px;
  padding: 8px 16px;
  width: 300px;
  height: 70px;
  background-color: var(--white-bg-color);
`;

const StyledCancelButton = styled.button`
  border: none;
  background-color: transparent;
  height: fit-content;
  font-size: var(--font-size-xs);
  line-height: 1.4;

  &:hover {
    background-color: transparent;
  }
`;

const StyledConfirmButton = styled.button`
  border: none;
  border-radius: 4px;
  background-color: var(--friendly-red-color);
  color: var(--light-bg-color);
  height: fit-content;
  padding: 4px 8px;
  font-size: var(--font-size-xs);
  line-height: 1.4;

  &:hover {
    background-color: var(--friendly-red-color);
  }
`;
