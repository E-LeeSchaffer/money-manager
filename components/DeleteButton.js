import { useState } from "react";

export default function DeleteButton({ onDeleteTransaction, id }) {
  const [isDeleting, setIsDeleting] = useState(false);

  function handleDelete() {
    setIsDeleting(true);
  }

  function handleConfirmDelete() {
    onDeleteTransaction(id);
  }

  function handleCancel() {
    setIsDeleting(false);
  }
  return (
    <>
      {isDeleting ? (
        <>
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
          <button type="button" onClick={handleConfirmDelete}>
            Really Delete
          </button>
        </>
      ) : (
        <button type="button" onClick={handleDelete}>
          Delete
        </button>
      )}
    </>
  );
}
