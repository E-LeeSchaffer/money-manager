import { useRouter } from "next/router";
import styled from "styled-components";

export default function TransactionDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      <StyledButton onClick={() => router.push("/")}>
        Back to Transactions
      </StyledButton>
      <StyledDetail>
        <h2>Transaction Details</h2>
        <p>Name:</p>
        <p>Amount:</p>
        <p>Category: </p>
        <p>Type: </p>
        <p>Date: </p>
      </StyledDetail>
    </>
  );
}

const StyledDetail = styled.div`
  padding: 20px;
`;

const StyledButton = styled.button`
  background-color: var(--primary-color);
  color: black;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;

  &:hover {
    background-color: var(--primary-color-hover);
  }
`;
