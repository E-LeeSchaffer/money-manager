import styled from "styled-components";
import Image from "next/image";

export default function OptionsButton({
  onHandleDelete,
  onToggleOptions,
  isOptionSelect,
}) {
  return (
    <>
      <StyledToggleButton type="button" onClick={onToggleOptions}>
        <Image
          src="/images/dots.svg"
          alt="options button"
          width={15}
          height={15}
        />
      </StyledToggleButton>
      {isOptionSelect ? (
        <StyledOptionsModal>
          <StyledDeleteButton onClick={onHandleDelete}>
            Delete
          </StyledDeleteButton>
        </StyledOptionsModal>
      ) : null}
    </>
  );
}

const StyledToggleButton = styled.button`
  background-color: transparent;
  display: flex;
  justify-content: end;
  padding: 0;
  border: none;
  height: fit-content;
`;

const StyledOptionsModal = styled.div`
  position: absolute;
  display: flex;
  justify-content: end;
  flex-direction: column;
  background-color: white;
  top: 15px;
  border: 0.1px solid var(--dark-grey-color);
  border-radius: 4px;
  gap: 2px;
  padding: 2px;
`;

const StyledDeleteButton = styled.button`
  border: none;
  background-color: transparent;
  text-align: end;
`;
