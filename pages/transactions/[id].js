import Modal from "@/components/Modal";
import TransactionForm from "@/components/TransactionForm";
import { useRouter } from "next/router";
import { useState } from "react";
import styled from "styled-components";
import Image from "next/image";
import { capitalizeFirstLetter, formatDate, formatNumber } from "@/lib/utils";
import Link from "next/link";
import { categories } from "@/lib/categories";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((response) => response.json());

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

  const { data: transactionDetails, error: transactionError } = useSWR(
    id ? `/api/transactions/${id}` : null,
    fetcher
  );

  // const transactionDetails = transactionsList.find(
  //   (transaction) => transaction._id === id
  // );

  if (!transactionDetails) {
    if (transactionError) {
      return <p>Failed to load transaction.</p>;
    }
    return <p>Loading</p>;
  }

  if (!router.isReady) {
    return null;
  }

  function handleConfirmDelete() {
    handleDeleteTransaction(transactionDetails._id);
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
          }}
          variant="edit"
          categories={categories}
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
                  handleOpenDeleteDialogue();
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
      </StyledTransactionDetails>
    </>
  );
}

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
