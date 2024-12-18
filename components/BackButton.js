import Image from "next/image";
import { useRouter } from "next/router";
import styled from "styled-components";

export default function BackButton({ variant, handleBack }) {
  const router = useRouter();

  function handleBackClick() {
    if (variant === "detailspage") {
      router.push("/");
    } else if (variant === "profilepage") {
      handleBack();
    } else {
      router.back();
    }
  }

  return (
    <StyledBackButton onClick={handleBackClick}>
      <StyledImage
        aria-hidden="true"
        src="/images/arrow-left.svg"
        alt="edit button"
        width={16}
        height={16}
      />
      <StyledTitle>Back</StyledTitle>
    </StyledBackButton>
  );
}

const StyledBackButton = styled.button`
  display: flex;
  align-items: center;
  gap: var(--gap-sm);
  border: var(--accent-color);
  background-color: transparent;
  width: fit-content;
  padding: 12px;
  margin-top: 60px;
  margin-bottom: 10px;
`;

const StyledImage = styled(Image)`
  display: flex;
`;

const StyledTitle = styled.span`
  text-align: center;
  line-height: 0.7;
`;
