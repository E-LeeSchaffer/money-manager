import GlobalStyle from "../styles";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { SWRConfig } from "swr";

const fetcher = (url) => fetch(url).then((response) => response.json());

export default function App({ Component, pageProps }) {
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (successMessage !== "") {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const componentProps = {
    successMessage,
    setSuccessMessage,
    ...pageProps,
  };

  return (
    <>
      <GlobalStyle />
      <SWRConfig value={{ fetcher }}>
        <Layout>
          <Component {...componentProps} />
        </Layout>
      </SWRConfig>
    </>
  );
}
