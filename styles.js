import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  body {
    margin: 16px;
    font-family: system-ui;
  }

  ul {
   padding: 0;
   margin: 24px;
  }

  li {
    list-style: none;
   
  }
h1 {
  text-align: center;
  font-size: 18px;
}

h2 {
  text-align: center;
  font-size: 24px;

}

`;
