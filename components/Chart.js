import React, { useState } from "react";
import styled from "styled-components";
import { BarChart, YAxis, XAxis, Bar } from "recharts";
import useSWR from "swr";

export default function BarChartPage() {
  const { data: transactionsList = [] } = useSWR("/api/transactions");
  const [selectedCategory, setSelectedCategory] = useState(null);

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
      fill: "var(--text-color-dark)",
    }))
    .sort((a, b) => b.value - a.value);

  const renderCustomLabel = ({ x, y, width, value }) => {
    return (
      <StyledLabelText x={x + width + 10} y={y + 22}>
        {value} €
      </StyledLabelText>
    );
  };

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory((prev) =>
      prev === categoryName ? null : categoryName
    );
  };

  const CustomTick = ({ x, y, payload }) => {
    const isSelected = selectedCategory === payload.value;

    return (
      <text
        x={x + 5}
        y={y + 5}
        textAnchor="end"
        fill={
          isSelected ? "var(--friendly-red-color)" : "var(--text-color-dark)"
        }
        fontWeight={isSelected ? "bold" : "normal"}
        onClick={() => handleCategoryClick(payload.value)}
      >
        {payload.value}
      </text>
    );
  };

  return (
    <>
      <Card>
        <StyledTitle>Expenses by Category</StyledTitle>
        <CardContent>
          <ChartContainer>
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ left: 80, right: 40 }}
              width={400}
              height={300}
            >
              <YAxis
                dataKey="name"
                type="category"
                tick={<CustomTick />}
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <XAxis dataKey="value" type="number" hide />

              <Bar
                dataKey="value"
                radius={5}
                label={renderCustomLabel}
                onClick={(data) => handleCategoryClick(data.name)}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter>
          <FooterText>Updated with recent transactions</FooterText>
        </CardFooter>
      </Card>

      <StyledCardWrapper>
        <StyledSummaryCard>
          <StyledSummaryTitle>{selectedCategory}</StyledSummaryTitle>
          <StyledSummaryAmount>
            {selectedCategory
              ? `Total Expense: ${totalExpensesByCategory[selectedCategory]} €`
              : "Select a category for details"}
          </StyledSummaryAmount>
        </StyledSummaryCard>
      </StyledCardWrapper>
    </>
  );
}

const StyledTitle = styled.h2`
  text-align: center;
  font-size: 1rem;
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
  width: 100%;
`;

const CardContent = styled.div`
  margin-bottom: 16px;
`;

const ChartContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const CardFooter = styled.div`
  font-size: 14px;
  color: var(--text-color-dark);
`;

const FooterText = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
`;

const StyledCardWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const StyledSummaryCard = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 12px;
  align-items: center;
  border: 0.1px solid var(--dark-grey-color);
  border-radius: 16px;
  width: 16rem;
  height: 4rem;
  background-color: var(--accent-color);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const StyledSummaryTitle = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  font-weight: bold;
`;

const StyledSummaryAmount = styled.p`
  margin: 4px 0 0;
  font-size: 1rem;
`;
