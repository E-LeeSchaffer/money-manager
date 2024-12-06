// import PieChartPage from "@/components/Chart";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
const PieChartPage = dynamic(() => import("@/components/Chart"), {
  ssr: false,
});

export default function ReportPage() {
  return (
    <>
      <StyledBackLink href="/">
        <StyledImage
          aria-hidden="true"
          src="/images/arrow-return-left.svg"
          alt="edit button"
          width={15}
          height={15}
        />
        Back
      </StyledBackLink>
      <StyledTitle>Report</StyledTitle>
      <PieChartPage />
    </>
  );
}

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

const StyledImage = styled(Image)`
  display: flex;
`;

const StyledTitle = styled.h2`
  text-align: center;
  font-size: 1.7rem;
  font-weight: 700;
`;

const StyledChartHeader = styled.h3`
  text-align: center;
  font-size: 1rem;
`;
