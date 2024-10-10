import styled from "styled-components";
import Image from "next/image";
import { useState } from "react";

export default function OptionsMenu({ onHandleDelete, onHandleOpenEditMode }) {
  const [isOptionSelect, setIsOptionSelect] = useState(false);

  function toggleOptions() {
    setIsOptionSelect(!isOptionSelect);
  }

  return (
    <>
      <StyledToggleButton type="button" onClick={toggleOptions}>
        <Image
          src="/images/dots.svg"
          alt="options button"
          width={15}
          height={15}
        />
      </StyledToggleButton>
      {isOptionSelect ? (
        <StyledOptionsModal>
          <StyledOptionsSelectButton
            type="button"
            onClick={() => {
              onHandleOpenEditMode();
            }}
          >
            Edit
          </StyledOptionsSelectButton>
          <StyledOptionsSelectButton
            type="button"
            onClick={() => {
              onHandleDelete();
              setIsOptionSelect(false);
            }}
          >
            Delete
          </StyledOptionsSelectButton>
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

const StyledOptionsSelectButton = styled.button`
  border: none;
  background-color: transparent;
  text-align: end;
`;
