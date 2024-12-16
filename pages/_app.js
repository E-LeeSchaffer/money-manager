import GlobalStyle from "../styles";
import { useEffect, useState } from "react";
import useSWR, { SWRConfig } from "swr";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";

const fetcher = (url) => fetch(url).then((response) => response.json());

export default function App({ Component, pageProps }) {
  const [successMessage, setSuccessMessage] = useState("");

  const router = useRouter();
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
