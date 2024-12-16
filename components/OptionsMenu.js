import styled from "styled-components";
import Image from "next/image";
import { useState } from "react";
import Backdrop from "./Backdrop";

export default function OptionsMenu({
  handleOpenDeleteDialogue,
  onOpenModal,
  onHandleOpenEditMode,
  transaction,
  activeSelectionId,
  openSelection,
  closeSelection,
}) {
  const menuId = `menu-${transaction._id}`;
  const isMenuOpen = activeSelectionId === menuId;

  function toggleOptions() {
    if (isMenuOpen) {
      closeSelection();
    } else {
      openSelection(menuId);
    }
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
      {isMenuOpen ? (
        <>
          <Backdrop closeSelection={closeSelection} />
          <StyledOptionsMenu>
            <StyledOptionsSelectButton
              type="button"
              onClick={() => {
                onOpenModal();
                closeSelection();
                onHandleOpenEditMode(transaction);
              }}
            >
              Edit
            </StyledOptionsSelectButton>
            <StyledOptionsSelectButton
              type="button"
              onClick={() => {
                handleOpenDeleteDialogue();
                closeSelection();
              }}
            >
              Delete
            </StyledOptionsSelectButton>
          </StyledOptionsMenu>
        </>
      ) : null}
    </>
  );
}

const StyledToggleButton = styled.button`
  background-color: transparent;
  display: flex;
  justify-content: end;
  border: none;
  height: fit-content;
`;

const StyledOptionsMenu = styled.div`
  position: absolute;
  display: flex;
  justify-content: end;
  flex-direction: column;
  background-color: var(--white-bg-color);
  top: 30px;
  right: 14px;
  border: var(--border-brand);
  border-radius: 4px;
  gap: var(--gap-xs);
  padding: 2px;
  z-index: 10;
`;

const StyledOptionsSelectButton = styled.button`
  border: none;
  background-color: transparent;
  text-align: end;
`;
