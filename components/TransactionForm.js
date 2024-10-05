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
      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>Add a new transaction</legend>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            maxLength={40}
            required
          ></input>
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
        </fieldset>
        <button type="submit">Add</button>
      </form>
    </>
  );
}

const StyledToggleButton = styled.div`
  display: flex;
  justify-content: space-around;
  width: 240px;
  height: 24px;
  background-color: #f5f5f5;
  border: 1px solid #141414;
  border-radius: 30px;

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
    border: 0.1px solid #141414;
    background-color: #e8e9f3;
  }

  label[for="expense"] {
    border-radius: 0 30px 30px 0;
    border: 0.1px solid #141414;
    background-color: #f8e8e1;
  }

  input:checked + label {
    font-weight: 800;
  }

  input:not(:checked) + label {
    visitbility: hidden;
  }
`;
