import { useCallback, useEffect, useMemo, useState } from "react";

export default function IncomeExpense({
  setFilteredAccountType,
  filteredAccountType,
}) {
  const handleToggleAccountFilter = useCallback(
    (type) => {
      setFilteredAccountType(type === filteredAccountType ? "balance" : type);
    },
    [filteredAccountType, setFilteredAccountType]
  );

  return (
    <>
      <button onClick={() => handleToggleAccountFilter("total")}>
        Total (All Transactions)
      </button>
      <button onClick={() => handleToggleAccountFilter("income")}>
        Income
      </button>
      <button onClick={() => handleToggleAccountFilter("expense")}>
        Expense
      </button>
    </>
  );
}
