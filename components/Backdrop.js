import styled from "styled-components";

export default function Backdrop({ closeOptionsMenu }) {
  return <StyledBackdrop onClick={closeOptionsMenu} />;
}

const StyledBackdrop = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
`;
