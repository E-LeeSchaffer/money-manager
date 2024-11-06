import styled from "styled-components";
import { useEffect, useMemo } from "react";

export default function IncomeExpense({
  transactions,
  setFilteredAccount,
  setFilteredAccountType,
  filteredAccountType,
}) {
  const income = useMemo(
    () =>
      transactions
        .filter((transaction) => transaction.type === "income")
        .reduce(
          (accumulator, transaction) => accumulator + transaction.amount,
          0
        ),
    [transactions]
  );

  const expense = useMemo(
    () =>
      transactions
        .filter((transaction) => transaction.type === "expense")
        .reduce(
          (accumulator, transaction) => accumulator + transaction.amount,
          0
        ),
    [transactions]
  );

  const total = income - expense;

  useEffect(() => {
    if (filteredAccountType === "income") {
      setFilteredAccount(income);
    } else if (filteredAccountType === "expense") {
      setFilteredAccount(expense);
    } else if (filteredAccountType === "total") {
      setFilteredAccount(total);
    } else {
      setFilteredAccount(null);
    }
  }, [filteredAccountType, income, expense, total, setFilteredAccount]);

  const handleToggleAccountFilter = (type) => {
    setFilteredAccountType(type === filteredAccountType ? "balance" : type);
  };

  return (
    <>
      <StyledButtonContainer>
        <StyledButton
          onClick={() => handleToggleAccountFilter("total")}
          active={filteredAccountType === "total"}
        >
          Total
        </StyledButton>
        <StyledButton
          onClick={() => handleToggleAccountFilter("income")}
          active={filteredAccountType === "income"}
        >
          Income
        </StyledButton>
        <StyledButton
          onClick={() => handleToggleAccountFilter("expense")}
          active={filteredAccountType === "expense"}
        >
          Expense
        </StyledButton>
      </StyledButtonContainer>
    </>
  );
}

const StyledButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 16rem;
  height: 1.2rem;
`;

const StyledButton = styled.button`
  border: 0.1px solid var(--dark-grey-color);
  border-radius: 16px;
  display: flex;
  padding: 2px 20px;
  width: fit-content;
  min-height: 1rem;
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  font-size: 0.8rem;

  border: ${({ active }) =>
    active
      ? "2px solid var(--accent-color)"
      : "0.1px solid var(--dark-grey-color)"};

  background-color: ${({ active }) =>
    active ? "var(--dark-grey-color)" : "var(--light-bg-color)"};
`;
