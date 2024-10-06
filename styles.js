import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  body {
    margin: 0;
   font-family: sofia-pro, sans-serif;
         background: #F7F9FB;

  }

  main {
  padding-inline: 16px;

  }

  ul {
   padding: 0;
   margin: 24px;
  }

  li {
    list-style: none;
   
  }


 h2 {
  text-align: center;
  font-size: 24px;
  font-weight: 700;
  padding-top: 24px;
 }

 p {
  margin: 0;
 }
`;
