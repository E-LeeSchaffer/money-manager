import Image from "next/image";
import { categories } from "@/lib/categories";
import styled from "styled-components";
import Backdrop from "./Backdrop";

export default function Filter({
  onFilterTransactions,
  selectedCategory,
  openSelection,
  closeSelection,
  activeSelectionId,
  handleSearch,
}) {
  const filterId = "filter";
  const isFilterOpen = activeSelectionId === filterId;

  function toggleFilter() {
    if (isFilterOpen) {
      closeSelection();
    } else {
      openSelection(filterId);
      handleSearch();
    }
  }

  return (
    <StyledFilterContainer>
      <StyledFilterButton onClick={toggleFilter}>
        <StyledImage
          src={
            selectedCategory !== ""
              ? "/images/funnel-fill.svg"
              : "/images/funnel.svg"
          }
          alt="filter button"
          width={15}
          height={15}
        />
      </StyledFilterButton>
      {isFilterOpen && (
        <>
          <Backdrop closeSelection={closeSelection} />
          <StyledCategoryContainer id="category" name="category">
            {categories.map((category) => (
              <StyledCategoryButton
                key={category.id}
                type="button"
                value={category.name}
                onClick={() => {
                  onFilterTransactions(category.name);
                  closeSelection();
                }}
                $isSelected={selectedCategory === category.name}
              >
                {category.name}
              </StyledCategoryButton>
            ))}
          </StyledCategoryContainer>
        </>
      )}
    </StyledFilterContainer>
  );
}

const StyledFilterContainer = styled.div`
  display: flex;
  height: 24px;
  position: relative;
  right: 0;
  padding-left: 0.5rem;
`;

const StyledFilterButton = styled.button`
  background-color: transparent;
  padding: 0;
  border: none;
`;

const StyledImage = styled(Image)`
  display: flex;
`;

const StyledCategoryContainer = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 20px;
  right: 0;
  text-align: end;
  z-index: 50;
  background-color: white;
  border: 0.1px solid var(--dark-grey-color);
  border-radius: 4px;
  padding: 4px;
`;

const StyledCategoryButton = styled.button`
  background-color: ${({ $isSelected }) =>
    $isSelected ? "var(--accent-color)" : "transparent"};
  color: ${({ $isSelected }) =>
    $isSelected ? "black" : "var(--text-color-dark)"};
  padding: 0;
  border: none;
  text-align: end;
  border-radius: 2px;
  padding: 1px 2px;
  font-size: 0.7rem;
`;
