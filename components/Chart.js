import React from "react";
import styled from "styled-components";
import { BarChart, YAxis, XAxis, Tooltip, Bar, Text } from "recharts";
import useSWR from "swr";

export default function BarChartPage() {
  const { data: transactionsList = [] } = useSWR("/api/transactions");

  const totalExpensesByCategory = transactionsList
    .filter((transaction) => transaction.type === "expense")
    .reduce((accumulator, transaction) => {
      const categoryName = transaction.category?.name || "Uncategorized";

      accumulator[categoryName] =
        (accumulator[categoryName] || 0) + transaction.amount;

      return accumulator;
    }, {});

  const chartData = Object.entries(totalExpensesByCategory)
    .map(([name, value]) => ({
      name,
      value,
      fill: getRandomColor(),
    }))
    .sort((a, b) => b.value - a.value);

  function getRandomColor() {
    const colors = [
      "#FF6384",
      "#36A2EB",
      "#FFCE56",
      "#4BC0C0",
      "#9966FF",
      "#BCCCDC",
      "#E68369",
      "#ECCEAE",
      "#BB9AB1",
      "#CCD5AE",
      "#FFAD60",
      "#179BAE",
      "#507687",
      "#2C4E80",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  const renderCustomLabel = ({ x, y, width, value }) => {
    return (
      <StyledLabelText x={x + width + 10} y={y + 33}>
        {value} €
      </StyledLabelText>
    );
  };

  return (
    <Card>
      <CardHeader>
        <StyledTitle>Expenses by Category</StyledTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ left: 80, right: 40 }}
            width={500}
            height={400}
          >
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <XAxis dataKey="value" type="number" hide />

            <Bar dataKey="value" radius={5} label={renderCustomLabel} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <FooterText>Updated with recent transactions</FooterText>
      </CardFooter>
    </Card>
  );
}

const StyledTitle = styled.h2`
  text-align: center;
  font-size: 1.7rem;
  font-weight: 700;
`;

const StyledLabelText = styled.text`
  fill: black;
  font-size: 12px;
  text-anchor: start;
`;

const Card = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 16px;
  width: 500px;
`;

const CardHeader = styled.div`
  margin-bottom: 16px;
`;

const CardTitle = styled.h2`
  font-size: 18px;
  font-weight: bold;
  margin: 0;
`;

const CardContent = styled.div`
  margin-bottom: 16px;
`;

const ChartContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  /* overflow-x: auto; */
`;

const CardFooter = styled.div`
  font-size: 14px;
  color: #333;
`;

const FooterText = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
`;
