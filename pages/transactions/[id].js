import Modal from "@/components/Modal";
import TransactionForm from "@/components/TransactionForm";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Image from "next/image";
import { capitalizeFirstLetter, formatDate, formatNumber } from "@/lib/utils";
import Link from "next/link";
import useSWR from "swr";
import BackButton from "@/components/BackButton";

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
    if (event.key !== "Enter" || event.shiftKey) {
      setIsNoteError(false);
      return;
    }

    const noteContent = event.target.value
      .split("\n")
      .map((line) => line.trim())
      .join("\n");
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
          <BackButton />
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
      <StyledPageLinks>
        <Link href={"/report"} aria-label="Report">
          <Image
            src={"/images/report.svg"}
            alt="report button"
            width={20}
            height={20}
          />
        </Link>
        <Link href={"/settings"} aria-label="Settings">
          <Image
            aria-hidden="true"
            src={"/images/settings.svg"}
            alt="filter button"
            width={20}
            height={20}
          />
        </Link>
        <Link href={"/profile"} aria-label="Profile">
          <Image
            aria-hidden="true"
            src={"/images/profile.svg"}
            alt="profile button"
            width={20}
            height={20}
          />
        </Link>
      </StyledPageLinks>
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

      <BackButton variant={"detailspage"} />
      <main>
        <h2>Transaction Details</h2>
        <StyledTransactionDetails>
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
                }}
              >
                Really Delete
              </StyledConfirmButton>
            </StyledConfirmActionContainer>
          ) : (
            <StyledDetailsContainer>
              <h4>Details</h4>
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
            <StyledConfirmActionContainer $isNote={isDeletingNote}>
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
              <h4>Notes</h4>
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
                  {transactionDetails.note || "Click to add a note"}
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
      </main>
    </>
  );
}

const StyledPageLinks = styled.div`
  display: flex;
  gap: var(--gap-lg);
  position: absolute;
  right: 16px;
  top: 16px;
  z-index: 2000;
`;

const StyledNoteContentButton = styled.button`
  border: none;
  background-color: inherit;
  display: flex;
  text-align: left;
  min-height: 100px;
  white-space: pre-wrap;
  word-wrap: break-word;
`;

const ErrorMessageNote = styled.p`
  grid-area: typeErrorMessage;
  color: var(--friendly-red-color);
  font-size: var(--font-size-xs);
  line-height: 1.4;
  margin-top: 8px;
`;

const StyledTextArea = styled.textarea`
  border: none;
  outline: none;
  background-color: inherit;
  min-height: 100px;
`;

const StyledPageNotFoundMessage = styled.p`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: var(--gap-lg);
  height: 100vh;
`;

const StyledSuccessMessage = styled.p`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  color: var(--text-color-dark);
  font-size: var(--font-size-xs);
  line-height: 1.4;
  padding: 6px 4px;
  width: 220px;
  font-weight: 800;
  text-align: center;
  border-radius: 8px;
  box-shadow: var(--shadow-brand);
  z-index: 1000;
  background-color: var(--friendly-green-color);
`;

const StyledTransactionDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--gap-md);
`;

const StyledNoteArea = styled.div`
  border-radius: 16px;
  padding: 8px 16px;
  width: 300px;
  display: flex;
  flex-direction: column;
  background-color: var(--accent-color);
  gap: var(--gap-xl);
`;

const StyledConfirmActionContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--gap-sm);
  border-radius: 16px;
  padding: 8px 16px;
  width: 300px;
  border: ${(props) => (props.$isNote ? "none" : "var(--border-brand)")};
  height: ${(props) => (props.$isNote ? "195px" : "250px")};
  background-color: ${(props) =>
    props.$isNote ? "var(--accent-color)" : "var(--white-bg-color)"};
`;

const StyledCancelButton = styled.button`
  border: none;
  background-color: transparent;
  height: fit-content;
  font-size: var(--font-size-xs);
  line-height: 1.4;
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
`;

const StyledDetailsContainer = styled.div`
  border: var(--border-brand);
  background-color: var(--white-bg-color);
  border-radius: 16px;
  padding: 8px 16px;
  width: 300px;
  height: 250px;
  display: flex;
  flex-direction: column;
  row-gap: var(--gap-xl);
`;

const DefinitionList = styled.dl`
  display: grid;
  gap: var(--gap-md);
  grid-template-columns: 1fr auto;
`;

const StyledDefinitionTerm = styled.dt`
  font-weight: bold;
  font-size: var(--font-size-sm);
`;

const StyledDefinitionDescription = styled.dd`
  text-align: end;
  font-size: var(--font-size-sm);
  overflow: auto;
  word-wrap: break-word;
`;

const StyledAmountDescription = styled.dd`
  text-align: end;
  font-size: var(--font-size-sm);
  color: ${(props) =>
    props.type === "expense"
      ? "var(--friendly-red-color)"
      : "var(--friendly-green-color)"};
`;

const StyledOptionsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: var(--gap-md);
`;

const StyledEditButton = styled.button`
  border: none;
  background-color: transparent;
`;

const StyledDeleteButton = styled.button`
  border: none;
  background-color: transparent;
`;

const StyledImage = styled(Image)`
  display: flex;
`;
