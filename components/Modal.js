import styled from "styled-components";
import TransactionForm from "./TransactionForm";
import { transactions } from "@/lib/transactions";

export default function EditTransactionModal({
  isModalOpen,
  isEditing,
  onCloseModal,
  transaction,
  onHandleEditTransaction,
  formatNumber,
}) {
  if (!isModalOpen) return null;

  function handleFormSubmit(updatedTransaction) {
    onHandleEditTransaction({ ...transaction, ...updatedTransaction });
    onCloseModal();
  }

  const formattedTransaction = {
    ...transaction,
    amount:
      transaction.type === "expense"
        ? Math.abs(transaction.amount)
        : transaction.amount,
  };

  return (
    <StyledModal>
      <StyledFormContainer>
        <button onClick={onCloseModal}>X</button>
        <TransactionForm
          formHeader="Edit Transaction"
          buttonText="Update"
          isEditing={isEditing}
          updatedData={formattedTransaction}
          onAdd={handleFormSubmit}
        />
      </StyledFormContainer>
    </StyledModal>
  );
}

const StyledModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const StyledFormContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 16px;
  max-width: 500px;
  width: 100%;
  position: relative;
`;
