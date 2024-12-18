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
  gap: var(--gap-md);
  margin-bottom: 20px;
  width: 250px;
`;

const StyledButton = styled.button`
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 6px 16px;
  width: 80px;
  box-shadow: var(--shadow-brand);
  font-size: var(--font-size-xs);
  line-height: 1.4;
  outline: var(--border-brand);
  background-color: ${({ $active }) =>
    $active ? "var(--dark-grey-color)" : "var(--white-bg-color)"};
`;
