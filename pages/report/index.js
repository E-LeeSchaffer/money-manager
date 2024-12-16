import BackButton from "@/components/BackButton";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
const BarChartPage = dynamic(() => import("@/components/Chart"), {
  ssr: false,
});

export default function ReportPage() {
  return (
    <>
      <StyledPageLinks>
        <Link href={"/settings"} aria-label="Settings">
          <Image
            aria-hidden="true"
            src={"/images/settings.svg"}
            alt="filter button"
            width={20}
            height={20}
          />
        </Link>
      </StyledPageLinks>

      <BackButton />
      <StyledPageMain>
        <h2>Report</h2>
        <BarChartPage />
      </StyledPageMain>
    </>
  );
}

const StyledPageLinks = styled.div`
  display: flex;
  gap: var(--gap-lg);
  position: absolute;
  right: 16px;
  top: 16px;
  z-index: 2000;
`;

const StyledPageMain = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--gap-md);
`;
