import { useEffect, useState } from "react";
import { formatNumber } from "@/lib/utils";
import styled from "styled-components";

export default function AccountBalance({ transactions }) {
  const [currentBalance, setCurrentBalance] = useState(0);

  useEffect(() => {
    const sumOfTransaction = transactions.reduce((total, transaction) => {
      return transaction.type === "income"
        ? total + transaction.amount
        : total - transaction.amount;
    }, 0);
    setCurrentBalance(sumOfTransaction);
  }, [transactions]);

  const currentBalanceType = currentBalance < 0 ? "expense" : "income";

  return (
    <>
      <StyledPageContainer>
        <StyledContainer>
          <StyledTitle>Current Balance</StyledTitle>
          <StyledCurrentBalance type={currentBalanceType}>
            {formatNumber({
              amount: currentBalance,
              type: currentBalanceType,
            })}
          </StyledCurrentBalance>
        </StyledContainer>
      </StyledPageContainer>
    </>
  );
}

const StyledPageContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-block: 12px;
  align-items: center;
`;

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 0.1px solid var(--dark-grey-color);
  border-radius: 16px;
  width: 12rem;
  height: 4rem;
  background-color: #e9ff70;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  gap: 4px;
`;

const StyledTitle = styled.h3`
  font-size: 0.8rem;
  margin: 0;
`;

const StyledCurrentBalance = styled.div`
  font-size: 1.2rem;
  color: ${(props) =>
    props.type === "expense"
      ? "var(--friendly-red-color)"
      : "var(--friendly-green-color)"};
`;
