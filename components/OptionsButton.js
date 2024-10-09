import { useState } from "react";
import DeleteButton from "./DeleteButton";

export default function OptionsButton({ handleDeleteTransaction, id }) {
  const [isOptionSelect, setIsOptionSelect] = useState(false);

  function toggleOptions() {
    setIsOptionSelect(!isOptionSelect);
  }
  return (
    <>
      <button onClick={toggleOptions}>...</button>
      {isOptionSelect ? (
        <div>
          <DeleteButton onDeleteTransaction={handleDeleteTransaction} id={id} />
        </div>
      ) : null}
    </>
  );
}
