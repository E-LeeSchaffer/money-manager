import styled from "styled-components";

export default function IncomeExpense({
  onFilterChange,
  filteredTransactionType,
}) {
  const handleToggleAccountFilter = (type) => {
    onFilterChange(type === filteredTransactionType ? "balance" : type);
  };
  return (
    <>
      <StyledButtonContainer>
        <StyledButton
          onClick={() => handleToggleAccountFilter("total")}
          $active={filteredTransactionType === "total"}
        >
          Profit
        </StyledButton>
        <StyledButton
          onClick={() => handleToggleAccountFilter("income")}
          $active={filteredTransactionType === "income"}
        >
          Income
        </StyledButton>
        <StyledButton
          onClick={() => handleToggleAccountFilter("expense")}
          $active={filteredTransactionType === "expense"}
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

  border: ${({ $active }) =>
    $active
      ? "2px solid var(--accent-color)"
      : "0.1px solid var(--dark-grey-color)"};

  background-color: ${({ $active }) =>
    $active ? "var(--dark-grey-color)" : "var(--light-bg-color)"};
`;
