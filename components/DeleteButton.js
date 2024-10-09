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
          <button onClick={handleCancel}>Cancel</button>
          <button onClick={handleConfirmDelete}>Really Delete</button>
        </>
      ) : (
        <button onClick={handleDelete}>Delete</button>
      )}
    </>
  );
}
