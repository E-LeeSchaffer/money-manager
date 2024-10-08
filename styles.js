import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  :root {
    --light-bg-color: #F7F9FB;
    --dark-grey-color: #d4d4d4;
    --accent-color: #4686cd;
    --text-color-dark: #141414;
    --friendly-red-color: #F44336;
    --friendly-green-color: #4CAF50;
  }

  body {
    margin: 0;
    font-family: sofia-pro, sans-serif;
    background: var(--light-bg-color);
  }

  main {
    padding-inline: 16px;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  li {
    list-style: none;
  }



  label {
    font-size: 0.8rem;
  }
`;
