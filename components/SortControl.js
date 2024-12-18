import Image from "next/image";
import styled from "styled-components";
export default function SortControl({ sortOrder, onToggleSortOrder }) {
  return (
    <StyledSortButton
      onClick={onToggleSortOrder}
      aria-label={`Sort transactions in ${
        sortOrder === "desc" ? "ascending" : "descending"
      }`}
    >
      <Image
        src={
          sortOrder === "desc"
            ? "/images/sort-numeric-down.svg"
            : "/images/sort-numeric-up.svg"
        }
        aria-hidden="true"
        alt={sortOrder === "desc" ? "Descending Order" : "Ascending Order"}
        width={16}
        height={16}
      ></Image>
    </StyledSortButton>
  );
}

const StyledSortButton = styled.button`
  background-color: transparent;
  border: none;
  display: flex;
`;
