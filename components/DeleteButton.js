import styled from "styled-components";

export default function DeleteButton({
  onHandleCancel,
  onHandleConfirmDelete,
  isDeleting,
  onHandleDelete,
}) {
  return (
    <>
      {isDeleting ? (
        <>
          <button type="button" onClick={onHandleCancel}>
            Cancel
          </button>
          <button type="button" onClick={onHandleConfirmDelete}>
            Really Delete
          </button>
        </>
      ) : (
        <StyledButton type="button" onClick={onHandleDelete}>
          Delete
        </StyledButton>
      )}
    </>
  );
}

const StyledButton = styled.button`
  border: none;
  background-color: transparent;
  text-align: end;
`;
