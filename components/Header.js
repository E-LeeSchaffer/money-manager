import { useEffect, useState } from "react";
import styled from "styled-components";
import Link from "next/link";

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
      <StyledLink href={"/"}>Money Bin</StyledLink>
    </StyledHeader>
  );
}

const StyledHeader = styled.h1`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: start;
  align-items: center;
  font-size: 1rem;
  color: var(--text-color-dark);
  height: 44px;
  margin: 0;
  padding-inline: 16px;
  background-color: ${(props) =>
    props.isScrolled ? "rgba(245, 245, 245, 0.8)" : "rgba(255, 255, 255, 0.5)"};
  transition: background-color 0.3s ease-in-out;
  z-index: 1000;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;
