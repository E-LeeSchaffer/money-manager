import styled from "styled-components";
import Image from "next/image";
import Link from "next/link";

export default function SettingsPage({
  handleAddCategory,
  categories,
  isDuplicateError,
  successMessage,
}) {
  return (
    <>
      <StyledBackLink href={"/"}>
        <StyledImage
          aria-hidden="true"
          src="/images/arrow-return-left.svg"
          alt="edit button"
          width={15}
          height={15}
        />
        Back
      </StyledBackLink>
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
      {successMessage && (
        <StyledSuccessMessage>{successMessage}</StyledSuccessMessage>
      )}
    </>
  );
}

const StyledImage = styled(Image)`
  display: flex;
`;

const StyledBackLink = styled(Link)`
  display: flex;
  align-items: center;
  background-color: var(--accent-color);
  text-decoration: none;
  width: fit-content;
  color: black;
  position: relative;
  top: 10px;
  left: 10px;
  border: var(--accent-color);
  padding: 4px 8px;
  border-radius: 4px;
  display: flex;
  gap: 0.5rem;
`;

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

  &:focus {
    outline: none;
    border-bottom: 1px solid var(--dark-grey-color);
  }
`;

const ErrorMessage = styled.p`
  grid-area: typeErrorMessage;
  color: red;
  font-size: 0.6rem;
`;

const StyledSuccessMessage = styled.p`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  color: var(--text-color-dark);
  font-size: 0.8rem;
  padding: 6px 4px;
  width: 220px;
  font-weight: 800;
  text-align: center;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  background-color: var(--friendly-green-color);
`;
