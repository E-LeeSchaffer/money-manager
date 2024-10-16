import styled from "styled-components";

export default function Modal({ isModalOpen, onCloseModal, children }) {
  if (!isModalOpen) return null;

  return (
    <StyledModal>
      <Backdrop onClick={onCloseModal} />
      <Content>
        <button onClick={onCloseModal}>X</button>
        {children}
      </Content>
    </StyledModal>
  );
}

const StyledModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const Content = styled.div`
  background: white;
  padding: 20px;
  border-radius: 16px;
  max-width: 500px;
  width: 100%;
  position: relative;
  margin-inline: 16px;
`;

const Backdrop = styled.button`
  position: absolute;
  background-color: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
  border: none;
`;
