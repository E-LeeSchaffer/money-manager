import Modal from "@/components/Modal";
import TransactionForm from "@/components/TransactionForm";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styled from "styled-components";

export default function TransactionDetailPage({
  transactionsList,
  handleEditTransaction,
  isModalOpen,
  isEditing,
  editTransaction,
  successMessage,
  openModal,
  closeModal,
  handleOpenEditMode,
  handleDeleteTransaction,
  handleFormSubmit,
  showForm,
  toggleForm,
  handleOpenDeleteDialogue,
  handleConfirmDelete,
  handleCancelDeleteDialogue,
  isDeleting,
}) {
  const router = useRouter();
  const { id } = router.query;

  const [transactionDetails, setTransactionDetails] = useState(null);

  //   const transactionDetails = transactionsList.find(
  //     (transaction) => transaction.id === id
  //   );

  useEffect(() => {
    if (id && transactionsList) {
      const transaction = transactionsList.find(
        (transaction) => transaction.id === id
      );
      setTransactionDetails(transaction);
    }
  }, [id, transactionsList]);

  if (!transactionDetails) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <StyledButton onClick={() => router.push("/")}>
        Back to Transactions
      </StyledButton>
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
      <StyledDetail>
        <h2>Transaction Details</h2>
        {isDeleting ? (
          <div>
            {" "}
            <div>
              <button type="button" onClick={handleCancelDeleteDialogue}>
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  handleConfirmDelete(transactionDetails);
                }}
              >
                Really Delete
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p>
              <strong>Name:</strong> {transactionDetails.name}
            </p>
            <p>
              <strong>Amount:</strong> {transactionDetails.amount}€
            </p>
            <p>
              <strong>Category:</strong> {transactionDetails.category}
            </p>
            <p>
              <strong>Type:</strong> {transactionDetails.type}
            </p>
            <p>
              <strong>Date:</strong> {transactionDetails.date}
            </p>
            <button
              type="button"
              onClick={() => {
                handleOpenEditMode(transactionDetails);
              }}
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => {
                handleOpenDeleteDialogue();
              }}
            >
              Delete
            </button>
          </div>
        )}
      </StyledDetail>
    </>
  );
}

const StyledDetail = styled.div`
  padding: 20px;
`;

const StyledButton = styled.button`
  background-color: var(--primary-color);
  color: black;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
  &:hover {
    background-color: var(--primary-color-hover);
  }
`;
