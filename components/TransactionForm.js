import { categories } from "@/lib/categories";
import { useState } from "react";
import CurrencyInput from "react-currency-input-field";
import styled from "styled-components";

export default function TransactionForm({
  onSubmit,
  initialData = {},
  variant,
}) {
  const today = new Date().toISOString().split("T")[0];
  const [amount, setAmount] = useState(initialData.amount?.toString() || "");
  const [typeError, setTypeError] = useState(false);
  const [amountError, setAmountError] = useState(false);
  const formHeader =
    variant === "edit" ? "Edit Transaction" : "Add Transaction";
  const buttonText = variant === "edit" ? "Update" : "Add";

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    const data = Object.fromEntries(formData);

    data.amount = parseFloat(data.amount.replace(/\./g, "").replace(",", "."));

    if (data.amount <= 0) {
      setAmountError(true);
      return;
    } else {
      setAmountError(false);
    }

    if (!data.type) {
      setTypeError(true);
      return;
    }

    onSubmit(data);
    event.target.reset();
    setAmount("");
  }

  return (
    <>
      <StyledForm onSubmit={handleSubmit}>
        <StyledFieldset>
          <StyledLegend>{formHeader}</StyledLegend>
          <FormRow>
            <StyledNameLabel htmlFor="name">Name</StyledNameLabel>
            <StyledNameInput
              type="text"
              id="name"
              name="name"
              maxLength={40}
              defaultValue={initialData.name || ""}
              required
            />
          </FormRow>
          <FormRow>
            <StyledAmountLabel htmlFor="amount">Amount</StyledAmountLabel>
            <StyledCurrencyInput
              id="amount"
              name="amount"
              maxLength="9"
              allowNegativeValue={false}
              decimalsLimit={2}
              intlConfig={{ locale: "de-DE", currency: "EUR" }}
              value={amount}
              onValueChange={(value) => setAmount(value)}
              required
            />
            {amountError && (
              <ErrorMessageAmount>
                Please enter an amount greater than zero.
              </ErrorMessageAmount>
            )}
          </FormRow>
          <FormRow>
            <StyledCategoryLabel htmlFor="category">
              Category
            </StyledCategoryLabel>
            <StyledCategorySelect
              id="category"
              defaultValue={initialData.category || ""}
              name="category"
              required
            >
              <option value="" disabled>
                Please select a category
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </StyledCategorySelect>
          </FormRow>
          <FormRow>
            <StyledTypeLabel htmlFor="type">Type</StyledTypeLabel>
            <StyledToggleButton id="type">
              <StyledRadioInput
                id="income"
                name="type"
                type="radio"
                value="income"
                defaultChecked={initialData.type === "income"}
                onChange={() => {
                  setTypeError(false);
                }}
              />
              <StyledRadioLabel htmlFor="income">Income</StyledRadioLabel>
              <StyledRadioInput
                id="expense"
                name="type"
                type="radio"
                value="expense"
                defaultChecked={initialData.type === "expense"}
                onChange={() => {
                  setTypeError(false);
                }}
              />
              <StyledRadioLabel htmlFor="expense">Expense</StyledRadioLabel>
            </StyledToggleButton>
            {typeError && (
              <ErrorMessageType>
                Please select a transaction type.
              </ErrorMessageType>
            )}
          </FormRow>
          <FormRow>
            <StyledDateLabel htmlFor="date">Date</StyledDateLabel>
            <StyledDateInput
              type="date"
              id="date"
              name="date"
              defaultValue={initialData.date || today}
              required
            />
          </FormRow>
        </StyledFieldset>
        <StyledButton type="submit">{buttonText}</StyledButton>
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
  border-color: var(--dark-grey-color);
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-areas:
    "nameLabel nameInput"
    "amountLabel amountInput"
    ". amountErrorMessage"
    "categoryLabel categoryInput"
    "typeLabel typeToggleButton"
    ". typeErrorMessage"
    "dateLabel dateInput";
  padding: 12px 16px;
  gap: 4px;
`;
const FormRow = styled.div`
  display: contents;
`;

const StyledNameLabel = styled.label`
  grid-area: nameLabel;
`;

const StyledNameInput = styled.input`
  grid-area: nameInput;
  padding: 4px 12px;
  border: 1px solid var(--dark-grey-color);
  border-radius: 24px;
  background-color: white;
  color: #141414;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: var(--light-bg-color);
  }

  &:focus {
    border-color: var(--accent-color);
    outline: none;
    box-shadow: 0 0 4px rgba(70, 134, 205, 0.8);
  }
`;

const StyledAmountLabel = styled.label`
  grid-area: amountLabel;
`;

const StyledCurrencyInput = styled(CurrencyInput)`
  grid-area: amountInput;
  padding: 4px 12px;
  border: 1px solid var(--dark-grey-color);
  border-radius: 24px;
  background-color: white;
  color: var(--text-color-dark);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: var(--light-bg-color);
  }

  &:focus {
    border-color: var(--accent-color);
    outline: none;
    box-shadow: 0 0 4px rgba(70, 134, 205, 0.8);
  }
`;

const StyledCategoryLabel = styled.label`
  grid-area: categoryLabel;
`;

const StyledCategorySelect = styled.select`
  grid-area: categoryInput;
  padding: 4px 12px;
  border: 1px solid var(--dark-grey-color);
  border-radius: 24px;
  background-color: white;
  color: var(--text-color-dark);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: var(--light-bg-color);
  }

  &:focus {
    border-color: var(--accent-color);
    outline: none;
    box-shadow: 0 0 4px rgba(70, 134, 205, 0.8);
  }
`;

const StyledTypeLabel = styled.label`
  grid-area: typeLabel;
`;

const StyledRadioInput = styled.input`
  grid-area: typeInput;
`;

const StyledRadioLabel = styled.label`
  grid-area: radioLabel;
`;

const StyledToggleButton = styled.div`
  grid-area: typeToggleButton;
  display: flex;
  justify-content: space-around;
  align-items: center;
  font-size: 1rem;
  height: 24px;
  background-color: var(--light-bg-color);
  border: 1px solid var(--dark-grey-color);
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
    color: var(--text-color-dark);
  }

  label[for="income"] {
    border-radius: 30px 0 0 30px;
    border: 0.1px solid var(--dark-grey-color);
    background-color: white;
    font-size: 0.875rem;
  }

  label[for="expense"] {
    border-radius: 0 30px 30px 0;
    border: 0.1px solid var(--dark-grey-color);
    background-color: white;
    font-size: 0.875rem;
  }

  input:checked + label {
    background-color: var(--accent-color);
    color: white;
  }
`;
const ErrorMessageAmount = styled.p`
  grid-area: amountErrorMessage;
  color: red;
  font-size: 0.6rem;
`;
const ErrorMessageType = styled.p`
  grid-area: typeErrorMessage;
  color: red;
  font-size: 0.6rem;
`;

const StyledDateLabel = styled.label`
  grid-area: dateLabel;
`;

const StyledDateInput = styled.input`
  grid-area: dateInput;
  font-family: sofia-pro;
  padding: 4px 12px;
  border: 1px solid var(--dark-grey-color);
  border-radius: 24px;
  background-color: white;
  color: var(--text-color-dark);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: var(--light-bg-color);
  }

  &:focus {
    border-color: var(--accent-color);
    outline: none;
    box-shadow: 0 0 4px rgba(70, 134, 205, 0.8);
  }
`;

const StyledLegend = styled.legend`
  padding: 6px;
  text-align: center;
  font-weight: 500;
`;

const StyledButton = styled.button`
  border-radius: 24px;
  background-color: white;
  padding: 4px 16px;
  border: 1px solid var(--dark-grey-color);
  color: var(--text-color-dark);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 12px;

  &:hover {
    background-color: var(--accent-color);
    color: white;
  }
`;
