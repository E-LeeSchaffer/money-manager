import { categories } from "@/lib/categories";
import { useState } from "react";
import CurrencyInput from "react-currency-input-field";
import styled from "styled-components";

export default function TransactionForm({ onAdd }) {
  const today = new Date().toISOString().split("T")[0];

  const [selectedType, setSelectedType] = useState("income");

  function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    if (data.amount) {
      data.amount = parseFloat(
        data.amount.replace(/\./g, "").replace(",", ".")
      );
    }

    onAdd(data);

    event.target.reset();
  }

  return (
    <>
      <StyledForm onSubmit={handleSubmit}>
        <StyledFieldset>
          <StyledLegend>Add a new transaction</StyledLegend>
          <div>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              maxLength={40}
              required
            ></input>
          </div>
          <div>
            <label htmlFor="amount">Amount</label>
            <CurrencyInput
              id="amount"
              name="amount"
              min="1"
              maxLength="12"
              fixedDecimalLength="2"
              intlConfig={{ locale: "de-DE", currency: "EUR" }}
              required
            ></CurrencyInput>
          </div>
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            required
            defaultValue={categories[0].name}
          >
            {categories.map((category) => (
              <option
                key={category.id}
                value={category.name}
                disabled={category.id === "0" ? true : false}
              >
                {category.name}
              </option>
            ))}
          </select>

          <label htmlFor="type">Type</label>
          <StyledToggleButton id="type">
            <input
              id="income"
              name="type"
              type="radio"
              value="income"
              checked={selectedType === "income"}
              onChange={() => setSelectedType("income")}
            />
            <label htmlFor="income">Income</label>

            <input
              id="expense"
              name="type"
              type="radio"
              value="expense"
              checked={selectedType === "expense"}
              onChange={() => setSelectedType("expense")}
            />
            <label htmlFor="expense">Expense</label>
          </StyledToggleButton>

          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            defaultValue={today}
            required
          ></input>
          <p>Preview:</p>
        </StyledFieldset>

        <StyledButton type="submit">Add</StyledButton>
      </StyledForm>
    </>
  );
}

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledFieldset = styled.fieldset`
  border-radius: 16px;
  border-width: 1px;
  border-color: #d4d4d4;
  display: flex;
  flex-direction: column;
  padding: 12px 28px;
  gap: 4px;
`;

const StyledLegend = styled.legend`
  padding: 6px;
  text-align: center;
  font-weight: 500;
`;

const StyledToggleButton = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  font-size: 16x;
  width: 240px;
  height: 24px;
  background-color: #f5f5f5;
  border: 1px solid #d4d4d4;
  border-radius: 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  input {
    display: none;
  }

  label {
    cursor: pointer;
    border-radius: 30px;
    width: 120px;
    text-align: center;
    color: #141414;
  }

  label[for="income"] {
    border-radius: 30px 0 0 30px;
    border: 0.1px solid #d4d4d4;
    background-color: white;
  }

  label[for="expense"] {
    border-radius: 0 30px 30px 0;
    border: 0.1px solid #d4d4d4;
    background-color: white;
  }

  input:checked + label {
    background-color: #4686cd;
    color: white;
  }

  input:not(:checked) + label {
    visitbility: hidden;
  }
`;
const StyledButton = styled.button`
  border-radius: 24px;
  background-color: white;
  padding: 4px 12px;
  border: 1px solid #d4d4d4;
  color: #141414;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 12px;

  &:hover {
    background-color: #4686cd;
    color: white;
  }
`;
