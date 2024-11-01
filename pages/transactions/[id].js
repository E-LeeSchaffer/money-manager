import Modal from "@/components/Modal";
import TransactionForm from "@/components/TransactionForm";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Image from "next/image";
import { capitalizeFirstLetter, formatDate, formatNumber } from "@/lib/utils";

export default function TransactionDetailsPage({
  transactionsList,
  handleEditTransaction,
  isModalOpen,
  isEditing,
  closeModal,
  handleOpenEditMode,
  handleDeleteTransaction,
  successMessage,
}) {
  const router = useRouter();
  const { id } = router.query;
  const [isDeleting, setIsDeleting] = useState(false);

  const transactionDetails = transactionsList.find(
    (transaction) => transaction.id === id
  );

  if (!router.isReady) {
    return null;
  }

  function handleConfirmDelete() {
    handleDeleteTransaction(transactionDetails.id);
    setIsDeleting(false);
    router.push("/");
  }

  function handleCancelDeleteDialogue() {
    setIsDeleting(false);
  }

  function handleOpenDeleteDialogue() {
    setIsDeleting(true);
  }

  if (!transactionDetails) {
    return (
      <>
        <StyledPageNotFoundMessage>
          Page not found
          <StyledBackButton onClick={() => router.push("/")}>
            <StyledImage
              src="/images/arrow-return-left.svg"
              alt="edit button"
              width={15}
              height={15}
            />
            Back to Transactions
          </StyledBackButton>
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
    <main>
      <StyledBackButton onClick={() => router.push("/")}>
        <StyledImage
          src="/images/arrow-return-left.svg"
          alt="edit button"
          width={15}
          height={15}
        />
        Back to Transactions
      </StyledBackButton>

      <Modal isModalOpen={isModalOpen} onCloseModal={closeModal}>
        <TransactionForm
          isEditing={isEditing}
          initialData={transactionDetails}
          onSubmit={(updatedTransaction) => {
            handleEditTransaction(updatedTransaction);
            closeModal();
          }}
          variant="edit"
        />
      </Modal>

      {successMessage && (
        <StyledSuccessMessage>{successMessage}</StyledSuccessMessage>
      )}

      <StyledTransactionDetails>
        <StyledTitle>Transaction Details</StyledTitle>

        {isDeleting ? (
          <StyledConfirmActionContainer>
            <StyledCancelButton
              type="button"
              onClick={handleCancelDeleteDialogue}
            >
              Cancel
            </StyledCancelButton>
            <StyledConfirmButton
              type="button"
              onClick={() => {
                handleConfirmDelete(transactionDetails);
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
              <StyledDefinitionDescription>
                {transactionDetails.category}
              </StyledDefinitionDescription>

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
                  src="/images/pencil.svg"
                  alt="edit button"
                  width={15}
                  height={15}
                />
              </StyledEditButton>
              <StyledDeleteButton
                type="button"
                onClick={() => {
                  handleOpenDeleteDialogue();
                }}
              >
                <StyledImage
                  src="/images/trash.svg"
                  alt="delete button"
                  width={15}
                  height={15}
                />
              </StyledDeleteButton>
            </StyledOptionsContainer>
          </StyledDetailsContainer>
        )}
      </StyledTransactionDetails>
    </main>
  );
}

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

const StyledBackButton = styled.button`
  background-color: var(--accent-color);
  color: black;
  position: relative;
  top: 10px;
  left: 10px;
  border: var(--accent-color);
  padding: 10px 15px;
  border-radius: 4px;
  display: flex;
  gap: 0.5rem;
`;

const StyledTransactionDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
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
  min-height: 16rem;
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
