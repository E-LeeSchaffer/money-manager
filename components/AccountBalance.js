import styled from "styled-components";

export default function AccountBalance({
  currentBalance,
  filteredTransactionType,
}) {
  function formatNumberWithoutSign(amount) {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
      signDisplay: "never",
    }).format(amount);
  }

  function formatNumberWithSign(amount) {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
      signDisplay: "auto",
    }).format(amount);
  }

  const formattedAmount =
    filteredTransactionType === "balance" || filteredTransactionType === "total"
      ? formatNumberWithSign(currentBalance)
      : formatNumberWithoutSign(currentBalance);

  return (
    <StyledAccountBalanceContainer>
      <h4>Current Balance</h4>
      <StyledCurrentBalance>{formattedAmount}</StyledCurrentBalance>
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
