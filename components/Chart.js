import React from "react";
import styled from "styled-components";
import { PieChart, Pie, Sector, Label } from "recharts";
import useSWR from "swr";

export default function PieChartPage() {
  const { data: transactionsList = [] } = useSWR("/api/transactions");

  const totalExpensesByCategory = transactionsList
    .filter((transaction) => transaction.type === "expense")
    .reduce((accumulator, transaction) => {
      const categoryName = transaction.category?.name || "Uncategorized";

      accumulator[categoryName] =
        (accumulator[categoryName] || 0) + transaction.amount;

      return accumulator;
    }, {});

  const chartData = Object.entries(totalExpensesByCategory).map(
    ([name, value]) => ({
      name,
      value,
      fill: getRandomColor(),
    })
  );

  function getRandomColor() {
    const colors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  const showCustomLabel = ({ name, value }) => `${name}: ${value}`;

  return (
    <PageContainer>
      <ChartWrapper>
        <ChartTitle>Expenses by category</ChartTitle>
        <PieChart width={300} height={400}>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            fill="#8884d8"
            label={showCustomLabel}
            activeShape={({ outerRadius = 0, ...props }) => (
              <Sector {...props} outerRadius={outerRadius + 10} />
            )}
          />
        </PieChart>
      </ChartWrapper>
    </PageContainer>
  );
}

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  height: 70vh;
  background-color: var(--dark-grey-color);
  border-radius: 40px;
`;

const ChartTitle = styled.h2`
  text-align: center;
  font-size: 24px;
  color: var(--text-color-dark);
`;

const ChartWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
