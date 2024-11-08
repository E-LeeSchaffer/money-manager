import { useEffect, useState } from "react";
import { formatNumber } from "@/lib/utils";
import styled from "styled-components";

export default function AccountBalance({
  income,
  expense,
  total,
  currentBalance,
  filteredTransactionType,
}) {
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
    <StyledPageContainer>
      <StyledAccountBalanceContainer>
        <StyledTitle>{title}</StyledTitle>
        <StyledCurrentBalance
          type={currentBalanceType}
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
  color: ${(props) => {
    if (props.$filteredType === "income") return "var(--friendly-green-color)";
    if (props.$filteredType === "expense") return "var(--friendly-red-color)";
    return props.type === "expense"
      ? "var(--friendly-red-color)"
      : "var(--friendly-green-color)";
  }};
`;

const StyledCurrentBalanceInfo = styled.div`
  font-size: 0.8rem;
  color: var(--text-color-dark);
  margin-top: 4px;
`;
