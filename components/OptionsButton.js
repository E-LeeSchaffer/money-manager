import { useState } from "react";
import DeleteButton from "./DeleteButton";
import styled from "styled-components";
import Image from "next/image";

export default function OptionsButton({ handleDeleteTransaction, id }) {
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
        <div>
          <DeleteButton onDeleteTransaction={handleDeleteTransaction} id={id} />
        </div>
      ) : null}
    </>
  );
}

const StyledToggleButton = styled.button`
  width: fit-content;
`;
