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
}) {
  const router = useRouter();
  const { id } = router.query;
  const [transactionDetails, setTransactionDetails] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const formattedAmount = formatNumber(transactionDetails);
  const capitalizedType = capitalizeFirstLetter(transactionDetails.type);
  const formatedDate = formatDate(transactionDetails.date);

  console.log(transactionDetails.date);

  useEffect(() => {
    if (id && transactionsList) {
      const transaction = transactionsList.find(
        (transaction) => transaction.id === id
      );
      setTransactionDetails(transaction);
    }
  }, [id, transactionsList]);

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
    return <p>Loading...</p>;
  }

  return (
    <>
      <StyledBackButton onClick={() => router.push("/")}>
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
              }}
            >
              Really Delete
            </StyledConfirmButton>
          </StyledConfirmActionContainer>
        ) : (
          <StyledDetailsContainer>
            <DefinitionList>
              <DefinitionTerm>Name</DefinitionTerm>
              <DefinitionDescription>
                {transactionDetails.name}
              </DefinitionDescription>

              <DefinitionTerm>Amount</DefinitionTerm>
              <StyledAmountDescription type={transactionDetails.type}>
                {formattedAmount}
              </StyledAmountDescription>

              <DefinitionTerm>Category</DefinitionTerm>
              <DefinitionDescription>
                {transactionDetails.category}
              </DefinitionDescription>

              <DefinitionTerm>Type</DefinitionTerm>
              <DefinitionDescription>{capitalizedType}</DefinitionDescription>

              <DefinitionTerm>Date</DefinitionTerm>
              <DefinitionDescription>{formatedDate}</DefinitionDescription>
            </DefinitionList>
            <StyledOptionsContainer>
              <StyledEditButton
                type="button"
                onClick={() => {
                  handleOpenEditMode(transactionDetails);
                }}
              >
                <Image
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
                <Image
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
    </>
  );
}

const DefinitionList = styled.dl`
  margin: 0;
  display: grid;
  column-gap: 20px;
  row-gap: 10px;
  grid-template-columns: 1fr auto;
`;

const DefinitionTerm = styled.dt`
  font-weight: bold;
`;

const DefinitionDescription = styled.dd`
  margin: 0;
  text-align: end;
  font-size: small;
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

const StyledDetailsContainer = styled.div`
  border: 0.1px solid var(--dark-grey-color);
  background-color: white;
  border-radius: 16px;
  padding: 8px 16px;
  width: 20rem;
  min-height: 15rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const StyledBackButton = styled.button`
  background-color: var(--primary-color);
  color: black;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
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
  padding-top: 24px;
`;

const StyledOptionsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const StyledEditButton = styled.button`
  border: none;
  background-color: transparent;
`;

const StyledDeleteButton = styled.button`
  border: none;
  background-color: transparent;
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
