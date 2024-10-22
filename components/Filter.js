import Image from "next/image";
import { categories } from "@/lib/categories";
import styled from "styled-components";

export default function Filter({
  onFilterTransactions,
  isFilterSelectOpen,
  onToggleFilter,
  selectedCategory,
}) {
  return (
    <>
      <StyledFilterContainer>
        <StyledFilterButton
          onClick={() => {
            onToggleFilter();
          }}
        >
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
        {isFilterSelectOpen && (
          <StyledCategoryContainer id="category" name="category">
            {categories.map((category) => (
              <StyledCategoryButton
                key={category.id}
                type="button"
                value={category.name}
                onClick={() => {
                  onFilterTransactions(category.name);
                }}
                $props={selectedCategory === category.name}
              >
                {category.name}
              </StyledCategoryButton>
            ))}
          </StyledCategoryContainer>
        )}
      </StyledFilterContainer>
    </>
  );
}

const StyledFilterContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: flex-end;
  height: 24px;
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
  background-color: ${({ $props }) =>
    $props ? "var(--accent-color)" : "transparent"};
  color: ${({ $props }) => ($props ? "white" : "var(ext-color-dark)")};
  padding: 0;
  border: none;
  text-align: end;
  border-radius: 2px;
  padding: 1px 2px;
  font-size: 0.7rem;
`;
