import styled from "styled-components";
import useLocalStorageState from "use-local-storage-state";

export default function IncomeExpense({
  onFilterChange,
  filteredTransactionType,
  selectedCategory,
  transactionsList,
}) {
  const [selectedType, setSelectedType] = useLocalStorageState(
    "filteredTransactionType",
    { defaultValue: "expense" }
  );

  const filteredTransactions = transactionsList.filter((transaction) => {
    if (selectedCategory) {
      return transaction?.category?.name === selectedCategory;
    }
    return true;
  });

  const incomeTotal = filteredTransactions
    .filter((transaction) => transaction.type === "income")
    .reduce((accumulator, transaction) => accumulator + transaction.amount, 0);

  const expenseTotal = filteredTransactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((accumulator, transaction) => accumulator + transaction.amount, 0);

  const profit = incomeTotal - expenseTotal;

  const handleFilterChange = (type) => {
    onFilterChange(type);
    setSelectedType(type);
  };

  return (
    <>
      <StyledButtonContainer>
        <StyledButton
          onClick={() => handleFilterChange("total")}
          $active={filteredTransactionType === "total"}
        >
          Profit
        </StyledButton>
        <StyledButton
          onClick={() => handleFilterChange("income")}
          $active={filteredTransactionType === "income"}
        >
          Income
        </StyledButton>
        <StyledButton
          onClick={() => handleFilterChange("expense")}
          $active={filteredTransactionType === "expense"}
        >
          Expense
        </StyledButton>
      </StyledButtonContainer>

      <div>
        {filteredTransactions.map((transaction) => (
          <div key={transaction.id}>
            <p>{transaction.name}</p>
            <p>{transaction.amount} €</p>
          </div>
        ))}
      </div>
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
