import Modal from "@/components/Modal";
import TransactionForm from "@/components/TransactionForm";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Image from "next/image";
import { capitalizeFirstLetter, formatDate, formatNumber } from "@/lib/utils";
import Link from "next/link";
import useSWR from "swr";
import useLocalStorageState from "use-local-storage-state";

export default function TransactionDetailsPage({
  handleEditTransaction,
  isModalOpen,
  isEditing,
  closeModal,
  handleOpenEditMode,
  handleDeleteTransaction,
  successMessage,
  handleAddNote,
  handleDeleteNote,
}) {
  const router = useRouter();
  const { id } = router.query;

  const {
    data: transactionDetails,
    error: transactionError,
    mutate,
  } = useSWR(id ? `/api/transactions/${id}` : null);
  const { data: categories = [] } = useSWR(`/api/categories`);

  const [isDeletingTransaction, setIsDeletingTransaction] = useState(false);
  const [isDeletingNote, setIsDeletingNote] = useState(false);

  const [isNoteEdit, setIsNoteEdit] = useState(false);
  const [isNoteError, setIsNoteError] = useState(false);

  function handleConfirmDeleteTransaction() {
    handleDeleteTransaction(transactionDetails._id);
    setIsDeletingTransaction(false);
    router.push("/");
  }

  async function handleConfirmDeleteNote() {
    await handleDeleteNote(transactionDetails);
    mutate();
    setIsDeletingNote(false);
  }

  async function handleNoteUpdate(event) {
    if (event.key !== "Enter") {
      setIsNoteError(false);
      return;
    }

    const noteContent = event.target.value.trim();
    if (noteContent.length <= 0) {
      setIsNoteError(true);
      return;
    }

    await handleAddNote(noteContent, transactionDetails);
    event.target.blur();
    mutate();
  }

  if (!router.isReady) {
    return null;
  }

  if (!transactionDetails || transactionError) {
    return (
      <>
        <StyledPageNotFoundMessage>
          Page not found
          <StyledBackLink href="/">
            <StyledImage
              aria-hidden="true"
              src="/images/arrow-return-left.svg"
              alt="edit button"
              width={15}
              height={15}
            />
            Back to Transactions
          </StyledBackLink>
        </StyledPageNotFoundMessage>
      </>
    );
  }

  const formattedAmount = transactionDetails
    ? formatNumber(transactionDetails)
    : "";
  const capitalizedType = transactionDetails
    ? capitalizeFirstLetter(transactionDetails.type)
    : "";
  const formatedDate = transactionDetails
    ? formatDate(transactionDetails.date)
    : "";

  return (
    <>
      <StyledLink href={"/settings"} aria-label="Settings">
        <Image
          aria-hidden="true"
          src={"/images/settings.svg"}
          alt="filter button"
          width={15}
          height={15}
        />
      </StyledLink>
      <StyledBackLink href="/">
        <StyledImage
          aria-hidden="true"
          src="/images/arrow-return-left.svg"
          alt="edit button"
          width={15}
          height={15}
        />
        Back to Transactions
      </StyledBackLink>

      <Modal isModalOpen={isModalOpen} onCloseModal={closeModal}>
        <TransactionForm
          isEditing={isEditing}
          initialData={transactionDetails}
          onSubmit={(updatedTransaction) => {
            handleEditTransaction(updatedTransaction);
            closeModal();
            mutate();
          }}
          variant="edit"
          categories={categories}
        />
      </Modal>

      <StyledTransactionDetails>
        <StyledTitle>Transaction Details</StyledTitle>

        {isDeletingTransaction ? (
          <StyledConfirmActionContainer>
            <StyledCancelButton
              type="button"
              onClick={() => setIsDeletingTransaction(false)}
            >
              Cancel
            </StyledCancelButton>
            <StyledConfirmButton
              type="button"
              onClick={() => {
                handleConfirmDeleteTransaction();
                router.push("/");
              }}
            >
              Really Delete
            </StyledConfirmButton>
          </StyledConfirmActionContainer>
        ) : (
          <StyledDetailsContainer>
            <DefinitionList>
              <StyledDefinitionTerm>Name</StyledDefinitionTerm>
              <StyledDefinitionDescription>
                {transactionDetails.name}
              </StyledDefinitionDescription>

              <StyledDefinitionTerm>Amount</StyledDefinitionTerm>
              <StyledAmountDescription type={transactionDetails.type}>
                {formattedAmount}
              </StyledAmountDescription>

              <StyledDefinitionTerm>Category</StyledDefinitionTerm>
              {transactionDetails?.category ? (
                <StyledDefinitionDescription>
                  {capitalizeFirstLetter(transactionDetails?.category?.name)}
                </StyledDefinitionDescription>
              ) : (
                <StyledDefinitionDescription>
                  Uncategorized
                </StyledDefinitionDescription>
              )}

              <StyledDefinitionTerm>Type</StyledDefinitionTerm>
              <StyledDefinitionDescription>
                {capitalizedType}
              </StyledDefinitionDescription>

              <StyledDefinitionTerm>Date</StyledDefinitionTerm>
              <StyledDefinitionDescription>
                {formatedDate}
              </StyledDefinitionDescription>
            </DefinitionList>
            <StyledOptionsContainer>
              <StyledEditButton
                type="button"
                onClick={() => {
                  handleOpenEditMode(transactionDetails);
                }}
              >
                <StyledImage
                  aria-hidden="true"
                  src="/images/pencil.svg"
                  alt="edit button"
                  width={15}
                  height={15}
                />
              </StyledEditButton>
              <StyledDeleteButton
                type="button"
                onClick={() => {
                  setIsDeletingTransaction(true);
                }}
              >
                <StyledImage
                  aria-hidden="true"
                  src="/images/trash.svg"
                  alt="delete button"
                  width={15}
                  height={15}
                />
              </StyledDeleteButton>
            </StyledOptionsContainer>
          </StyledDetailsContainer>
        )}

        {isDeletingNote ? (
          <StyledConfirmActionContainer>
            <StyledCancelButton
              type="button"
              onClick={() => setIsDeletingNote(false)}
            >
              Cancel
            </StyledCancelButton>
            <StyledConfirmButton
              type="button"
              onClick={() => {
                handleConfirmDeleteNote();
              }}
            >
              Really Delete
            </StyledConfirmButton>
          </StyledConfirmActionContainer>
        ) : (
          <StyledNoteArea>
            Notes
            {isNoteEdit ? (
              <StyledTextArea
                id="note"
                name="note"
                defaultValue={transactionDetails.note}
                autoFocus
                maxLength={140}
                onKeyDown={handleNoteUpdate}
                onBlur={() => setIsNoteEdit(false)}
              />
            ) : (
              <StyledNoteContentButton onClick={() => setIsNoteEdit(true)}>
                {transactionDetails.note}
              </StyledNoteContentButton>
            )}
            {isNoteError && (
              <ErrorMessageNote>
                Please enter at least 1 valid character (letter, number or
                special character) to submit.
              </ErrorMessageNote>
            )}
            <StyledOptionsContainer>
              <StyledDeleteButton
                type="button"
                onClick={() => {
                  setIsDeletingNote(true);
                }}
              >
                <StyledImage
                  aria-hidden="true"
                  src="/images/trash.svg"
                  alt="delete button"
                  width={15}
                  height={15}
                />
              </StyledDeleteButton>
            </StyledOptionsContainer>
          </StyledNoteArea>
        )}
      </StyledTransactionDetails>
      {successMessage && (
        <StyledSuccessMessage>{successMessage}</StyledSuccessMessage>
      )}
    </>
  );
}

const StyledNoteContentButton = styled.button`
  border: none;
  background-color: inherit;
  min-height: 158px;
  display: flex;
  padding: 0;
  text-align: left;
  font-size: 1rem;
  line-height: 1.5;
  padding-top: 10px;
  padding-left: 2px;
  font-family: inherit;
`;

const ErrorMessageNote = styled.p`
  grid-area: typeErrorMessage;
  color: red;
  font-size: 0.6rem;
  padding: 0;
  margin: 0;
  margin-top: 8px;
`;

const StyledTextArea = styled.textarea`
  border-bottom: 1px solid black;
  border: none;
  background-color: inherit;
  min-height: 150px;
  line-height: 24px;
  font-size: inherit;
  font-family: inherit;
  margin-top: 8px;
`;

const StyledLink = styled(Link)`
  position: absolute;
  right: 16px;
  top: 10px;
  text-decoration: none;
  color: inherit;
  z-index: 2000;
`;

const StyledPageNotFoundMessage = styled.p`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 2rem;
  color: var(--dark-grey-color);
  height: 100vh;
  margin: 0;
`;

const StyledSuccessMessage = styled.p`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  color: var(--text-color-dark);
  font-size: 0.8rem;
  padding: 6px 4px;
  width: 220px;
  font-weight: 800;
  text-align: center;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  background-color: var(--friendly-green-color);
`;

const StyledBackLink = styled(Link)`
  display: flex;
  align-items: center;
  background-color: var(--accent-color);
  text-decoration: none;
  width: fit-content;
  color: black;
  position: relative;
  top: 10px;
  left: 10px;
  border: var(--accent-color);
  padding: 4px 8px;
  border-radius: 4px;
  display: flex;
  gap: 0.5rem;
`;

const StyledTransactionDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const StyledNoteArea = styled.div`
  border: 0.1px solid var(--dark-grey-color);
  border-radius: 16px;
  padding: 8px 16px;
  min-height: 14rem;
  width: 18rem;
  display: flex;
  flex-direction: column;
  background-color: var(--accent-color);
  gap: 8px;
`;

const StyledTitle = styled.h2`
  text-align: center;
  font-size: 1.7rem;
  font-weight: 700;
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
  min-height: 13rem;
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

const StyledDetailsContainer = styled.div`
  border: 0.1px solid var(--dark-grey-color);
  background-color: white;
  border-radius: 16px;
  padding: 8px 16px;
  min-height: 13rem;
  width: 18rem;
  display: flex;
  flex-direction: column;
  row-gap: 2rem;
`;

const DefinitionList = styled.dl`
  margin: 0;
  display: grid;
  column-gap: 20px;
  row-gap: 10px;
  grid-template-columns: 1fr auto;
`;

const StyledDefinitionTerm = styled.dt`
  font-weight: bold;
  font-size: small;
`;

const StyledDefinitionDescription = styled.dd`
  margin: 0;
  text-align: end;
  font-size: small;
  overflow: auto;
  word-wrap: break-word;
`;

const StyledAmountDescription = styled.dd`
  margin: 0;
  text-align: end;
  font-size: small;
  color: ${(props) =>
    props.type === "expense"
      ? "var(--friendly-red-color)"
      : "var(--friendly-green-color)"};
`;

const StyledOptionsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`;

const StyledEditButton = styled.button`
  border: none;
  background-color: transparent;
  padding: 0;
`;

const StyledDeleteButton = styled.button`
  border: none;
  background-color: transparent;
  padding: 0;
`;

const StyledImage = styled(Image)`
  display: flex;
`;
