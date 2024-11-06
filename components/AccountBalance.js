import { useEffect, useState } from "react";
import { formatNumber } from "@/lib/utils";
import styled from "styled-components";

export default function AccountBalance({
  transactions,
  filteredAccount,
  filteredAccountType,
}) {
  const [currentBalance, setCurrentBalance] = useState(0);

  useEffect(() => {
    const incomeTotal = transactions
      .filter((transaction) => transaction.type === "income")
      .reduce((total, transaction) => total + transaction.amount, 0);

    const expenseTotal = transactions
      .filter((transaction) => transaction.type === "expense")
      .reduce((total, transaction) => total + transaction.amount, 0);

    setCurrentBalance(incomeTotal - expenseTotal);
  }, [transactions]);

  const currentBalanceType = currentBalance < 0 ? "expense" : "income";

  function getTitle() {
    if (filteredAccountType === "income") return "Total Income";
    if (filteredAccountType === "expense") return "Total Expense";
    if (filteredAccountType === "total") return "Total Sum";
    return "Current Balance";
  }

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

  const displayAmount = filteredAccount ?? currentBalance;

  const formattedAmount =
    filteredAccountType === "balance" || filteredAccountType === "total"
      ? formatNumberWithSign({
          amount: displayAmount,
          type: currentBalanceType,
        })
      : formatNumberWithoutSign({
          amount: displayAmount,
          type: currentBalanceType,
        });

  return (
    <StyledPageContainer>
      <StyledAccountBalanceContainer>
        <StyledTitle>{getTitle()}</StyledTitle>
        <StyledCurrentBalance type={currentBalanceType}>
          {formattedAmount}
        </StyledCurrentBalance>
      </StyledAccountBalanceContainer>
    </StyledPageContainer>
  );
}

const StyledPageContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-block: 12px;
  align-items: center;
`;

const StyledAccountBalanceContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  padding-top: 12px;
  align-items: center;
  border: 0.1px solid var(--dark-grey-color);
  border-radius: 16px;
  width: 16rem;
  height: 6rem;
  background-color: #e9ff70;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  gap: 4px;
`;

const StyledTitle = styled.h3`
  font-size: 0.8rem;
  margin: 0;
`;

const StyledCurrentBalance = styled.div`
  font-size: 1.3rem;
  color: ${(props) =>
    props.type === "expense"
      ? "var(--friendly-red-color)"
      : "var(--friendly-green-color)"};
`;
