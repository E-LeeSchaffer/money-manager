import { useEffect, useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <StyledHeader $isScrolled={isScrolled}>
      <Link href={"/"}>
        <StyledImage
          src={"/images/logo.svg"}
          alt="report button"
          width={110}
          height={50}
          priority
        />
      </Link>
    </StyledHeader>
  );
}

const StyledHeader = styled.h1`
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  height: 44px;
  width: 100vw;
  padding-right: 16px;
  background-color: ${(props) =>
    props.$isScrolled ? "rgba(245, 245, 245, 0.8)" : "var(--light-bg-color)"};
  transition: background-color 0.3s ease-in-out;
  z-index: 2000;
`;

const StyledImage = styled(Image)`
  display: flex;
`;
