import { useEffect, useState } from "react";
import CurrencyInput from "react-currency-input-field";
import styled from "styled-components";
import Image from "next/image";
import Link from "next/link";
import { getCategoryIcon } from "@/lib/utils";
import { format } from "date-fns";
import { capitalizeFirstLetter } from "@/lib/utils";

export default function TransactionForm({
  categories,
  onSubmit,
  initialData = {},
  variant,
  showForm,
  toggleForm,
  isEditing,
  closeModal,
}) {
  const today = new Date().toISOString().split("T")[0];
  const [amount, setAmount] = useState(initialData.amount?.toString() || "");
  const [typeError, setTypeError] = useState(false);
  const [amountError, setAmountError] = useState(false);
  const [categoryError, setCategoryError] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const formHeader =
    variant === "edit" ? "Edit Transaction" : "Add Transaction";
  const buttonText = variant === "edit" ? "Update" : "Add";
  const [selectedCategoryInForm, setSelectedCategoryInForm] = useState(
    initialData?.category?.name || ""
  );
  const [selectedCategory, setSelectedCategory] = useState(
    initialData?.category?._id || ""
  );
  const formatedDate = initialData.date
    ? format(new Date(initialData.date), "yyyy-MM-dd")
    : today;

  useEffect(() => {
    if (initialData.amount) {
      setAmount(initialData.amount.toString());
    }
  }, [initialData.amount]);

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    const data = Object.fromEntries(formData);

    data.amount = parseFloat(data.amount.replace(/\./g, "").replace(",", "."));
    data.category = selectedCategory;

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

    if (!data.category) {
      setCategoryError(true);
      return;
    } else {
      setCategoryError(false);
    }

    onSubmit({ ...initialData, ...data });

    event.target.reset();
    setAmount("");
    setSelectedCategoryInForm("");
  }

  function handleCategorySelect(category) {
    setSelectedCategoryInForm(category.name);
    setSelectedCategory(category._id);
    setIsDropdownOpen(false);
  }

  if (!showForm && !isEditing && (amount || selectedCategoryInForm)) {
    setAmount("");
    setSelectedCategoryInForm("");
  }

  return (
    <>
      {!isEditing && (
        <StyledButtonContainer>
          <StyledCollapsableFormButton onClick={toggleForm}>
            {showForm ? "Hide Form" : "Add new transaction"}
            <StyledArrowIcon
              src={showForm ? "/images/arrow-up.svg" : "/images/arrow-down.svg"}
              width={20}
              height={20}
              alt={
                showForm ? "arrow up to close form" : "arrow down to open form"
              }
            />
          </StyledCollapsableFormButton>
        </StyledButtonContainer>
      )}
      {(isEditing || showForm) && (
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
              <DropdownContainer>
                <StyledCategorySelect>
                  <DropdownButton
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    {selectedCategoryInForm ? (
                      <>{selectedCategoryInForm}</>
                    ) : (
                      "Please select a category"
                    )}
                    <StyledArrowIcon
                      src={
                        isDropdownOpen
                          ? "/images/arrow-up.svg"
                          : "/images/arrow-down.svg"
                      }
                      width={20}
                      height={20}
                      alt={
                        isDropdownOpen
                          ? "arrow up to close form"
                          : "arrow down to open form"
                      }
                    />
                  </DropdownButton>

                  {isDropdownOpen && (
                    <DropdownList>
                      {categories
                        .toSorted((a, b) => a.name.localeCompare(b.name))
                        .map((category) => (
                          <DropdownItem
                            key={category._id}
                            value={category._id}
                            name="name"
                            id="name"
                            onClick={() => handleCategorySelect(category)}
                          >
                            <Image
                              src={getCategoryIcon(category.name, categories)}
                              alt={`${category.name}} icon`}
                              width={24}
                              height={24}
                            />
                            {capitalizeFirstLetter(category.name)}
                          </DropdownItem>
                        ))}
                    </DropdownList>
                  )}

                  <StyledLink
                    href={"/settings"}
                    aria-label="Settings"
                    onClick={() => {
                      closeModal();
                    }}
                  >
                    <Image
                      aria-hidden="true"
                      src={"/images/settings.svg"}
                      alt="filter button"
                      width={15}
                      height={15}
                    />
                  </StyledLink>
                </StyledCategorySelect>
                <div>
                  {categoryError && (
                    <ErrorMessageCategory>
                      Please select a category.
                    </ErrorMessageCategory>
                  )}
                </div>
              </DropdownContainer>
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
                defaultValue={formatedDate}
                max={today}
                required
              />
            </FormRow>
          </StyledFieldset>
          <StyledButton type="submit">{buttonText}</StyledButton>
        </StyledForm>
      )}
    </>
  );
}

const ErrorMessageCategory = styled.p`
  grid-area: categoryErrorMessage;
  color: red;
  font-size: 0.6rem;
`;

const StyledCategorySelect = styled.div`
  display: flex;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  padding: 0 2px 0 12px;
  display: flex;
  align-items: center;
`;

const DropdownContainer = styled.div`
  display: flex;
  grid-area: categoryInput;
  justify-content: space-between;
  flex-direction: column;
  position: relative;
  width: 100%;
`;

const DropdownButton = styled.div`
  display: flex;
  align-items: center;
  padding: 2px 12px;
  border: 1px solid var(--dark-grey-color);
  border-radius: 24px;
  background-color: white;
  color: #141414;
  font-size: 0.8rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease-in-out;
  width: 100%;
  gap: 4px;
`;

const DropdownList = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  max-height: 200px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  width: 88%;
  border: 1px solid var(--dark-grey-color);
  border-radius: 4px;
  background-color: white;
  color: var() (--text-color-dark);
  padding: 4px;
  font-size: 0.8rem;
`;

const DropdownItem = styled.div`
  display: flex;
  align-items: center;
  padding: 4px;
  gap: 4px;
`;

const StyledButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 12px;
`;

const StyledCollapsableFormButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.8rem;
  border-radius: 8px;
  background-color: white;
  padding: 4px 12px;
  width: 12rem;
  border: 1px solid var(--dark-grey-color);
  color: var(--text-color-dark);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const StyledArrowIcon = styled(Image)`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 12px;
`;

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

  &:focus {
    border-color: var(--accent-color);
    outline: none;
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

  &:focus {
    border-color: var(--accent-color);
    outline: none;
  }
`;

const StyledCategoryLabel = styled.label`
  grid-area: categoryLabel;
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

  &:focus {
    border-color: var(--accent-color);
    outline: none;
  }
`;

const StyledLegend = styled.legend`
  padding: 6px;
  text-align: center;
  font-weight: 500;
`;

const StyledButton = styled.button`
  border-radius: 24px;
  background-color: var(--accent-color);
  padding: 4px 16px;
  color: var(--text-color-dark);
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 12px;
`;
