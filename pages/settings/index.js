import styled from "styled-components";

export default function SettingsPage({
  handleAddCategory,
  categories,
  isDuplicateError,
}) {
  return (
    <>
      <StyledTitle>Settings</StyledTitle>
      <StyledSettingsCard>
        <StyledSubheading>Customize Categories</StyledSubheading>
        <StyledCategoryContainer id="category" name="category">
          {categories.map((category) => (
            <div key={category.id}>{category.name}</div>
          ))}
          <StyledCategoryInput
            type="text"
            placeholder="+ Add new category"
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleAddCategory(event.target.value);
                event.target.value = "";
                event.target.blur();
              }
            }}
          ></StyledCategoryInput>
          {isDuplicateError && (
            <ErrorMessage>Category already exists!</ErrorMessage>
          )}
        </StyledCategoryContainer>
      </StyledSettingsCard>
    </>
  );
}

const StyledTitle = styled.h2`
  text-align: center;
  font-size: 1.7rem;
  font-weight: 700;
`;

const StyledSettingsCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledSubheading = styled.h3`
  text-align: center;
`;

const StyledCategoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 18rem;
  justify-content: center;
`;

const StyledCategoryInput = styled.input`
  display: flex;
  width: fit-content;
  font-family: sofia-pro, sans-serif;
  border: none;
  background-color: inherit;
  font-size: 16px;
  padding: 0;
`;

const ErrorMessage = styled.p`
  grid-area: typeErrorMessage;
  color: red;
  font-size: 0.6rem;
`;
