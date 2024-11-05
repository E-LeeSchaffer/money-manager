import Image from "next/image";
import styled from "styled-components";

export default function Search({ handleSearch }) {
  return (
    <StyledSearchContainer>
      <StyledSearchButton
        onClick={() => {
          handleSearch();
        }}
      >
        <StyledImage
          src={"/images/search.svg"}
          alt="search button"
          width={15}
          height={15}
        />
      </StyledSearchButton>
    </StyledSearchContainer>
  );
}

const StyledSearchContainer = styled.div`
  display: flex;
  height: 24px;
`;

const StyledSearchButton = styled.button`
  background-color: transparent;
  padding: 0;
  border: none;
`;

const StyledImage = styled(Image)`
  display: flex;
`;
