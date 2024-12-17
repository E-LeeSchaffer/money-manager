import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    font-family: sofia-pro, sans-serif;
    color: var(--text-color-dark);
    font-size: var(--font-size-sm);
    line-height: 1.5;
    margin: 0;
    padding: 0;
    border: none;

  }

  :root {
    /* color */
    --light-bg-color: #F7F9FB;
    --white-bg-color: #ffffff;
    --dark-grey-color: #d4d4d4;
    --text-color-dark: #141414;
    --accent-color: #e9ff70;
    --friendly-red-color: #F44336;
    --friendly-green-color: #4CAF50;

    /* font */
    --font-size-xs: 0.8rem;
    --font-size-sm: 1rem;
    --font-size-md: 1.25rem;
    --font-size-lg: 1.5rem;
    --font-size-xl: 2rem;
    
    /* gap */
    --gap-xs: 2px;
    --gap-sm: 4px;
    --gap-md: 8px;
    --gap-lg: 12px;
    --gap-xl: 20px;

    /* box-shadow */
    --shadow-brand: 0 4px 6px rgba(0, 0, 0, 0.1);
    --shadow-accent: 0 4px 6px rgba(91, 100, 44, 0.1);

    /* outline */
    --border-brand: 0.1px solid var(--dark-grey-color);
    --border-accent: 1px solid var(--accent-color)
  }

  body {
    background: var(--light-bg-color);
    padding-inline: 16px;
    width: 100%;
    max-width: 400px;
    margin: 44px auto;
  }

  li {
    list-style: none;
  }

  label {
    font-size: var(--font-size-sm);
  }

  h2 {
    display: flex;
    justify-content: center;
    text-align: center;
    font-size: var(--font-size-xl);
    margin-bottom: 20px;
  }

  h3 {
    display: flex;
    justify-content: center;
    text-align: center;
    font-size: var(--font-size-lg);
  }

  h4 {
    display: flex;
    justify-content: center;
    text-align: center;
    font-size: var(--font-size-sm);
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button:hover {
    background-color: var(--accent-color)
  }
`;
