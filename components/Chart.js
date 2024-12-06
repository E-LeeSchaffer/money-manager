import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { PieChart, Pie, Sector } from "recharts";
import useSWR from "swr";

// const chartData = [
//   { name: "Chrome", value: 275, fill: "#FF6384" },
//   { name: "Safari", value: 200, fill: "#36A2EB" },
//   { name: "Firefox", value: 187, fill: "#FFCE56" },
//   { name: "Edge", value: 173, fill: "#4BC0C0" },
//   { name: "Other", value: 90, fill: "#9966FF" },
// ];

export default function PieChartPage() {
  const { data: transactionsList = [] } = useSWR("/api/transactions");

  const categorySums = transactionsList.reduce((accumulator, transaction) => {
    if (transaction.type === "expense" && transaction.category) {
      const categoryName = transaction.category.name;
      accumulator[categoryName] =
        (accumulator[categoryName] || 0) + transaction.amount;
    }
    return accumulator;
  }, {});

  const chartData = Object.entries(categorySums).map(([name, value]) => ({
    name,
    value,
    fill: getRandomColor(),
  }));

  function getRandomColor() {
    const colors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  return (
    <PageContainer>
      <ChartWrapper>
        <ChartTitle>Expenses by category</ChartTitle>
        <PieChart width={400} height={400}>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            fill="#8884d8"
            label
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
  height: 100vh;
  background-color: #f5f5f5;
`;

const ChartTitle = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
`;

const ChartWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
