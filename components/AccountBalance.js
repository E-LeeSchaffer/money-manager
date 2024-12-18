import styled from "styled-components";

export default function AccountBalance({
  income,
  expense,
  total,
  currentBalance,
  filteredTransactionType,
}) {
  const currentBalanceType = currentBalance < 0 ? "expense" : "income";

  const titleMap = {
    income: "Total Income",
    expense: "Total Expense",
    total: "Profit",
  };

  const title = titleMap[filteredTransactionType] || "Current Balance";

  function formatNumberWithoutSign({ amount, type }) {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
      signDisplay: "never",
    }).format(amount);
  }

  function formatNumberWithSign({ amount, type }) {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
      signDisplay: "auto",
    }).format(amount);
  }

  const amountMap = {
    income: income,
    expense: expense,
    total: total,
  };

  const displayAmount =
    filteredTransactionType in amountMap
      ? amountMap[filteredTransactionType]
      : currentBalance;

  const displayAmountType = displayAmount < 0 ? "expense" : "income";

  const formattedAmount =
    filteredTransactionType === "balance" || filteredTransactionType === "total"
      ? formatNumberWithSign({
          amount: displayAmount,
          type: currentBalanceType,
        })
      : formatNumberWithoutSign({
          amount: displayAmount,
          type: currentBalanceType,
        });

  return (
    <StyledAccountBalanceContainer>
      <h4>{title}</h4>
      <StyledCurrentBalance
        type={displayAmountType}
        $filteredType={filteredTransactionType}
      >
        {formattedAmount}
      </StyledCurrentBalance>
      {filteredTransactionType !== "balance" && (
        <StyledCurrentBalanceInfo>
          Current Balance:{" "}
          {formatNumberWithSign({
            amount: currentBalance,
            type: currentBalanceType,
          })}
        </StyledCurrentBalanceInfo>
      )}
    </StyledAccountBalanceContainer>
  );
}

const StyledAccountBalanceContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 16px;
  width: 250px;
  min-height: 120px;
  background-color: var(--accent-color);
  box-shadow: var(--shadow-accent);
  gap: var(--gap-sm);
`;

const StyledCurrentBalance = styled.div`
  font-size: var(--font-size-md);
  color: ${(props) => {
    if (props.$filteredType === "income") return "var(--friendly-green-color)";
    if (props.$filteredType === "expense") return "var(--friendly-red-color)";
    return props.type === "expense"
      ? "var(--friendly-red-color)"
      : "var(--friendly-green-color)";
  }};
`;

const StyledCurrentBalanceInfo = styled.div`
  font-size: var(--font-size-xs);
  line-height: 1.4;
`;
