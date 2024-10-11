import styled from "styled-components";
import TransactionForm from "./TransactionForm";

export default function EditTransactionModal({
  isModalOpen,
  isEditing,
  onCloseModal,
}) {
  if (!isModalOpen) return null;
  return (
    <StyledModal>
      <StyledFormContainer>
        <button onClick={onCloseModal}>X</button>
        <TransactionForm
          formHeader="Edit Transaction"
          buttonText="Update"
          isEditing={isEditing}
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
