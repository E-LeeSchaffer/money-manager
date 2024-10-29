import Modal from "@/components/Modal";
import TransactionForm from "@/components/TransactionForm";
import { useRouter } from "next/router";
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
}) {
  const router = useRouter();
  const { id } = router.query;

  const transactionDetails = transactionsList.find(
    (transaction) => transaction.id === id
  );

  return (
    <>
      <StyledButton onClick={() => router.push("/")}>
        Back to Transactions
      </StyledButton>
      <Modal isModalOpen={isModalOpen} onCloseModal={closeModal}>
        <TransactionForm
          isEditing={isEditing}
          initialData={editTransaction}
          onSubmit={handleFormSubmit}
          variant="edit"
          toggleForm={toggleForm}
        />
      </Modal>
      <StyledDetail>
        <h2>Transaction Details</h2>
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
            openModal();
          }}
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => {
            handleDeleteTransaction();
          }}
        >
          Delete
        </button>
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
