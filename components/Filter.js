import Image from "next/image";
import styled from "styled-components";
import Backdrop from "./Backdrop";
import { getCategoryIcon } from "@/lib/utils";
import { useMemo } from "react";

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

  const categoriesWithCounts = useMemo(() => {
    const counts = getCategoriesWithTransactionCount(transactionsList);

    return categories.map((category) => ({
      ...category,
      count: counts[category._id] || 0,
    }));
  }, [transactionsList, categories]);

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
            {[
              {
                _id: "uncategorized",
                name: "Uncategorized",
                count: transactionsList.filter(
                  (transaction) =>
                    !transaction.category ||
                    transaction.category === null ||
                    transaction.category === undefined
                ).length,
              },
              ...categoriesWithCounts,
            ].map((category) => (
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
                <StyledCategoryIcons>
                  <StyledCategoryIconWrapper>
                    <Image
                      src={getCategoryIcon(category.name, categories)}
                      alt={`${category.name} icon`}
                      width={24}
                      height={24}
                    />
                  </StyledCategoryIconWrapper>
                  <StyledCategoryName>{category.name}</StyledCategoryName>
                  <StyledTransactionCount>
                    {category.count}
                  </StyledTransactionCount>
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
  width: 180px;
  max-height: 250px;
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
  align-items: center;
  gap: 4px;
  height: 24px;
`;

const StyledCategoryIconWrapper = styled.div`
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
  font-size: 0.85rem;
  text-align: left;
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
  font-size: 0.75rem;
  font-weight: bold;
`;
