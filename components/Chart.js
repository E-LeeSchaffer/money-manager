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
        <h3>Expenses by Category</h3>
        <CardContent>
          <ChartContainer>
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ left: 80, right: 60 }}
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

const StyledLabelText = styled.text`
  fill: black;
  font-size: var(--font-size-xs);
  line-height: 1.4;
  text-anchor: start;
  font-size: var(--font-size-sm);
`;

const Card = styled.div`
  background-color: var(--white-bg-color);
  border-radius: 8px;
  box-shadow: var(--shadow-brand);
  width: 300px;
  padding: 8px 16px;
  font-size: var(--font-size-md);
`;

const CardContent = styled.div``;

const ChartContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CardFooter = styled.div`
  margin-bottom: 20px;
`;

const FooterText = styled.div`
  color: var(--dark-grey-color);
  font-size: var(--font-size-xs);
`;

const StyledCardWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const StyledSummaryCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 12px;
  align-items: center;
  border: var(--border-brand);
  border-radius: 16px;
  width: 16rem;
  height: 4rem;
  background-color: var(--accent-color);
  box-shadow: var(--shadow-brand);
`;

const StyledSummaryTitle = styled.h4`
  font-size: var(--font-size-md);
  font-weight: bold;
`;

const StyledSummaryAmount = styled.p`
  margin: 4px 0 0;
`;
