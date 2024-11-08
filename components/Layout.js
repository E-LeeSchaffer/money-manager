import Header from "./Header";
import Link from "next/link";
import Image from "next/image";
import styled from "styled-components";

export default function Layout({ children, isSettingsAccessible }) {
  return (
    <>
      <Header />
      <StyledLink href={"/settings"}>
        <Image
          src={"/images/settings.svg"}
          alt="filter button"
          width={15}
          height={15}
        />
      </StyledLink>
      <main>{children}</main>
    </>
  );
}

const StyledLink = styled(Link)`
  display: flex;
  justify-content: flex-end;
  padding: 44px 16px 0 16px;
  z-index: 200;
  text-decoration: none;
  color: inherit;
`;
