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
      <Link href={"/"}>Money Bin</Link>
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
  padding-inline: 16px;
  background-color: ${(props) =>
    props.$isScrolled ? "rgba(245, 245, 245, 0.8)" : "var(--light-bg-color)"};
  transition: background-color 0.3s ease-in-out;
  z-index: 2000;
`;
