import { useRouter } from "next/router";
import styled from "styled-components";
import { transactions } from "@/lib/transactions";

export default function TransactionDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  if (!id) {
    return <p>Loading...</p>;
  }

  const transaction = transactions.find(
    (transaction) => transaction.id === String(id)
  );

  if (!transaction) {
    return (
      <StyledDetail>
        <h2>Page not found</h2>
        <p>Sorry, this transaction does not exist.</p>
        <StyledButton onClick={() => router.push("/")}>
          Back to Transactions
        </StyledButton>
      </StyledDetail>
    );
  }

  return (
    <>
      <StyledButton onClick={() => router.push("/")}>
        Back to Transactions
      </StyledButton>
      <StyledDetail>
        <h2>Transaction Details</h2>
        <p>
          <strong>Name:</strong> {transaction.name}
        </p>
        <p>
          <strong>Amount:</strong> {transaction.amount}€
        </p>
        <p>
          <strong>Category:</strong> {transaction.category}
        </p>
        <p>
          <strong>Type:</strong> {transaction.type}
        </p>
        <p>
          <strong>Date:</strong> {transaction.date}
        </p>
        <button>Edit</button>
        <button>Delete</button>
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
