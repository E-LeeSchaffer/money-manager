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

  async function handleDeleteNote(transaction) {
    const response = await fetch(`/api/transactions/${transaction._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...transaction, note: "" }),
    });

    if (response.ok) {
      mutateTransactions();
      setSuccessMessage("Note successfully deleted!");
    } else {
      console.error("Failed to delete note.");
    }
  }

  async function handleAddNote(note, transaction) {
    const response = await fetch(`/api/transactions/${transaction._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...transaction, note }),
    });

    if (response.ok) {
      mutateTransactions();
      setSuccessMessage(
        transaction.note
          ? "Note successfully updated!"
          : "Note successfully added!"
      );
    } else {
      console.error("Failed to add note.");
    }
  }

  const componentProps = {
    successMessage,
    setSuccessMessage,

    handleAddNote,
    handleDeleteNote,
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
