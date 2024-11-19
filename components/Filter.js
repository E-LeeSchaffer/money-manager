import Image from "next/image";
import styled from "styled-components";
import Backdrop from "./Backdrop";
import { getCategoryIcon } from "@/lib/utils";

export default function Filter({
  onFilterTransactions,
  selectedCategory,
  openSelection,
  closeSelection,
  activeSelectionId,
  closeSearch,
  categories,
}) {
  const sortedCategories = [...categories].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const filterId = "filter";
  const isFilterOpen = activeSelectionId === filterId;

  function toggleFilter() {
    if (isFilterOpen) {
      closeSelection();
    } else {
      openSelection(filterId);
      closeSearch();
    }
  }

  return (
    <StyledFilterContainer>
      <StyledFilterButton onClick={toggleFilter} aria-label="Filter">
        <StyledImage
          aria-hidden="true"
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
            {[
              { id: "uncategorized", name: "Uncategorized" },
              ...sortedCategories,
            ].map((category) => (
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
                <StyledCategoryIcons>
                  {category.name}
                  <Image
                    src={getCategoryIcon(category.name)}
                    alt={`${selectedCategory} icon`}
                    width={24}
                    height={24}
                  />
                </StyledCategoryIcons>
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
  width: 120px;
  max-height: 200px;
  overflow-y: auto;
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

const StyledCategoryIcons = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 4px;
`;
