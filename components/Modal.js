import styled from "styled-components";
import Image from "next/image";

export default function Modal({ isModalOpen, onCloseModal, children }) {
  if (!isModalOpen) return null;

  return (
    <StyledModal>
      <Backdrop onClick={onCloseModal} />
      <Content>
        <StyledCancelButton onClick={onCloseModal}>
          <StyledImage
            src={"/images/x-square-fill.svg"}
            alt="filter button"
            width={18}
            height={18}
          />
        </StyledCancelButton>
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
  z-index: 500;
`;

const Content = styled.div`
  background: var(--white-bg-color);
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

const StyledCancelButton = styled.button`
  border: none;
  background-color: transparent;
`;

const StyledImage = styled(Image)`
  display: flex;
`;
