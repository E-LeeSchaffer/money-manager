import React, { useState } from "react";
import styled from "styled-components";
import { BarChart, YAxis, XAxis, Bar } from "recharts";
import useSWR from "swr";

export default function BarChartPage() {
  const { data: transactionsList = [] } = useSWR("/api/transactions");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [transactionType, setTransactionType] = useState("expense");

  const totalByCategory = (type) =>
    transactionsList
      .filter((transaction) => transaction.type === type)
      .reduce((accumulator, transaction) => {
        const categoryName = transaction.category?.name || "Uncategorized";
        accumulator[categoryName] =
          (accumulator[categoryName] || 0) + transaction.amount;
        return accumulator;
      }, {});

  const getChartData = () => {
    const data = totalByCategory(transactionType);
    return Object.entries(data)
      .map(([name, value]) => ({
        name,
        value,
        fill: "var(--text-color-dark)",
      }))
      .sort((a, b) => b.value - a.value);
  };

  const chartData = getChartData();

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
          selectedCategory
            ? isSelected
              ? "var(--text-color-dark))"
              : "var(--dark-grey-color)"
            : "var(--text-color-dark)"
        }
        fontWeight={isSelected ? "bold" : "normal"}
        onClick={() => handleCategoryClick(payload.value)}
      >
        {payload.value}
      </text>
    );
  };

  const handleTransactionTypeChange = (type) => {
    setTransactionType(type);
  };

  const totalAmountForSelectedCategory = selectedCategory
    ? totalByCategory(transactionType)[selectedCategory] || 0
    : Object.values(totalByCategory(transactionType)).reduce(
        (a, b) => a + b,
        0
      );

  return (
    <>
      <StyledButtonContainer>
        <StyledButton
          onClick={() => handleTransactionTypeChange("expense")}
          $active={transactionType === "expense"}
        >
          Expense
        </StyledButton>
        <StyledButton
          onClick={() => handleTransactionTypeChange("income")}
          $active={transactionType === "income"}
        >
          Income
        </StyledButton>
      </StyledButtonContainer>

      <StyledCardWrapper>
        <StyledSummaryCard>
          <StyledSummaryTitle>{selectedCategory}</StyledSummaryTitle>
          <p>
            {selectedCategory
              ? `Total ${
                  transactionType === "expense" ? "Expense" : "Income"
                }: ${totalByCategory(transactionType)[selectedCategory] || 0} €`
              : `Total ${
                  transactionType === "expense" ? "Expense" : "Income"
                }: ${totalAmountForSelectedCategory} €`}
          </p>
        </StyledSummaryCard>
      </StyledCardWrapper>
      <Card>
        <h3>
          {transactionType === "expense" ? "Expenses" : "Income"} by Category
        </h3>
        <div>
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
        </div>
        <CardFooter>
          <FooterText>Updated with recent transactions</FooterText>
        </CardFooter>
      </Card>
    </>
  );
}

const StyledButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--gap-md);
  width: 250px;
`;

const StyledButton = styled.button`
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 6px 16px;
  width: 120px;
  box-shadow: var(--shadow-brand);
  font-size: var(--font-size-xs);
  line-height: 0.6;
  outline: var(--border-brand);
  background-color: ${({ $active }) =>
    $active ? "var(--dark-grey-color)" : "var(--white-bg-color)"};
`;

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
  margin-top: 24px;
`;

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
  align-items: center;
  border-radius: 16px;
  width: 250px;
  height: 70px;
  background-color: var(--accent-color);
  box-shadow: var(--shadow-brand);
`;

const StyledSummaryTitle = styled.h4`
  font-size: var(--font-size-md);
  font-weight: bold;
`;
