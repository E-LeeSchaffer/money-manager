import BackButton from "@/components/BackButton";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styled from "styled-components";
import useSWR from "swr";
import useLocalStorageState from "use-local-storage-state";
const BarChartPage = dynamic(() => import("@/components/Chart"), {
  ssr: false,
});

export default function ReportPage() {
  const { data: transactionsList = [], mutate: mutateTransactions } =
    useSWR(`/api/transactions`);
  const [selectedCategory, setSelectedCategory] = useLocalStorageState(
    "selectedCategory",
    { defaultValue: "" }
  );
  const [searchItem, setSearchItem] = useState("");
  const [selectedTimeframe, setSelectedTimeframe] = useState(null);
  const [customDateRange, setCustomDateRange] = useState({
    start: null,
    end: null,
  });

  const filteredTransactions = transactionsList.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    const matchesCategory =
      selectedCategory === "uncategorized"
        ? transaction?.category === undefined
        : selectedCategory
        ? transaction?.category?._id === selectedCategory
        : true;

    const matchesSearch = searchItem
      ? transaction.name.toLowerCase().includes(searchItem.toLowerCase())
      : true;

    const matchesTimeframe = selectedTimeframe
      ? transactionDate >= calculateDateRange(selectedTimeframe)
      : true;

    const matchesCustomDateRange =
      customDateRange.start && customDateRange.end
        ? transactionDate >= customDateRange.start &&
          transactionDate <= customDateRange.end
        : true;

    return (
      matchesCategory &&
      matchesSearch &&
      matchesTimeframe &&
      matchesCustomDateRange
    );
  });

  const incomeTotal = transactionsList
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const expenseTotal = transactionsList
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const currentBalance = incomeTotal - expenseTotal;

  const filteredIncome = filteredTransactions
    .filter((transaction) => transaction.type === "income")
    .reduce((accumulator, transaction) => accumulator + transaction.amount, 0);

  const filteredExpense = filteredTransactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((accumulator, transaction) => accumulator + transaction.amount, 0);

  const profit = filteredIncome - filteredExpense;

  return (
    <>
      <StyledPageLinks>
        <Link href={"/settings"} aria-label="Settings">
          <Image
            aria-hidden="true"
            src={"/images/settings.svg"}
            alt="filter button"
            width={20}
            height={20}
          />
        </Link>
        <Link href={"/profile"} aria-label="Profile">
          <Image
            aria-hidden="true"
            src={"/images/profile.svg"}
            alt="profile button"
            width={20}
            height={20}
          />
        </Link>
      </StyledPageLinks>

      <BackButton />
      <StyledPageMain>
        <h2>Report</h2>
        <BarChartPage setSelectedCategory={setSelectedCategory} />
      </StyledPageMain>
    </>
  );
}

const StyledPageLinks = styled.div`
  display: flex;
  gap: var(--gap-lg);
  position: absolute;
  right: 16px;
  top: 16px;
  z-index: 2000;
`;

const StyledPageMain = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--gap-md);
`;

const StyledBalanceContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-bottom: 20px;
  margin-bottom: 10px;
  border-bottom: 1px solid var(--dark-grey-color);
`;
