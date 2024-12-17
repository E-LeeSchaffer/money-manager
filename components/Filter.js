import Image from "next/image";
import styled from "styled-components";
import Backdrop from "./Backdrop";
import { capitalizeFirstLetter, getCategoryIcon } from "@/lib/utils";

export default function Filter({
  onFilterTransactions,
  selectedCategory,
  openSelection,
  closeSelection,
  activeSelectionId,
  closeSearch,
  categories,
  transactionsList,
}) {
  const sortedCategories = [...categories].toSorted((a, b) =>
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

  function getCategoriesWithTransactionCount(transactionsList) {
    return transactionsList.reduce((acc, transaction) => {
      const categoryId =
        transaction.category?._id || transaction.category || "uncategorized";
      acc[categoryId] = (acc[categoryId] || 0) + 1;
      return acc;
    }, {});
  }

  const categoryCounts = getCategoriesWithTransactionCount(transactionsList);

  const categoriesWithUncategorized = [
    { _id: "uncategorized", name: "Uncategorized" },
    ...sortedCategories,
  ];

  const categoriesWithCounts = categoriesWithUncategorized.map((category) => ({
    ...category,
    count: categoryCounts[category._id] || 0,
  }));

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
          <StyledCategoryContainer>
            {categoriesWithCounts.map((category) => (
              <StyledCategoryButton
                key={category._id}
                type="button"
                value={category._id}
                onClick={() => {
                  onFilterTransactions(category._id);
                  closeSelection();
                }}
                $isSelected={selectedCategory === category._id}
              >
                <StyledCategoryIconWrapper>
                  <StyledCategoryIcons>
                    <Image
                      src={getCategoryIcon(category.name, categories)}
                      alt={`${category.name} icon`}
                      width={24}
                      height={24}
                    />
                  </StyledCategoryIcons>
                  <StyledCategoryName>
                    {capitalizeFirstLetter(category.name)}
                  </StyledCategoryName>
                  <StyledTransactionCount>
                    {category.count}
                  </StyledTransactionCount>
                </StyledCategoryIconWrapper>
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
  position: relative;
  right: 0;
`;

const StyledFilterButton = styled.button`
  border: none;
  height: 48px;
  background-color: transparent;
  padding-right: 12px;

  &:hover {
    background-color: transparent;
  }
`;

const StyledImage = styled(Image)`
  display: flex;
`;

const StyledCategoryContainer = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 40px;
  right: 0;
  z-index: 500;
  padding-right: 4px;
  background-color: var(--white-bg-color);
  border: var(--border-brand);
  border-radius: 4px;
  max-width: 180px;
  max-height: 250px;
  overflow-y: auto;
`;

const StyledCategoryButton = styled.button`
  background-color: ${({ $isSelected }) =>
    $isSelected ? "var(--accent-color)" : "transparent"};
  color: ${({ $isSelected }) =>
    $isSelected ? "black" : "var(--text-color-dark)"};
  border: none;
  text-align: end;
  border-radius: 2px;
  padding: 1px 2px;
  font-size: var(--font-size-xs);
  line-height: 1.4;
`;

const StyledCategoryIconWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 24px;
  gap: var(--gap-xs);
`;

const StyledCategoryIcons = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background-color: var(--light-grey-color);
  border-radius: 50%;
`;

const StyledCategoryName = styled.span`
  flex: 1;
  font-size: var(--font-size-xs);
  line-height: 1.4;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StyledTransactionCount = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  background-color: var(--dark-grey-color);
  color: black;
  border-radius: 20%;
  font-size: var(--font-size-xs);
  line-height: 1.4;
  font-weight: bold;
`;
