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
    setCategoryError(false);
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
            <StyledImage
              src={showForm ? "/images/arrow-up.svg" : "/images/arrow-down.svg"}
              width={15}
              height={15}
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
              <StyledCategoryLabel>Category</StyledCategoryLabel>
              <DropdownContainer>
                <StyledCategorySelect>
                  <DropdownButton
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    $active={isDropdownOpen}
                  >
                    {selectedCategoryInForm ? (
                      <>{selectedCategoryInForm}</>
                    ) : (
                      "Select a category"
                    )}
                    <StyledImage
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
                      width={20}
                      height={20}
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
                <input
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
                <input
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

const StyledButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

const StyledCollapsableFormButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--gap-sm);
  border: var(--border-brand);
  border-radius: 10px;
  background-color: var(--white-bg-color);
  padding: 4px 6px;
  width: 200px;
  box-shadow: var(--shadow-brand);
`;

const StyledImage = styled(Image)`
  display: flex;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledFieldset = styled.fieldset`
  border-radius: 16px;
  border-width: 1px;
  border: var(--border-brand);
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-areas:
    "nameLabel nameInput"
    "amountLabel amountInput"
    ". amountErrorMessage"
    "categoryLabel categoryInput"
    ". categoryErrorMessage"
    "typeLabel typeToggleButton"
    ". typeErrorMessage"
    "dateLabel dateInput";
  padding: 12px 16px;
  gap: var(--gap-sm);
  margin-bottom: 20px;
`;

const StyledLegend = styled.legend`
  font-size: var(--font-size-md);
  padding-inline: 6px;
  text-align: center;
`;

const FormRow = styled.div`
  display: contents;
`;

const StyledNameLabel = styled.label`
  grid-area: nameLabel;
  display: flex;
  align-items: center;
  margin-bottom: 4px;
  font-weight: bold;
`;

const StyledNameInput = styled.input`
  grid-area: nameInput;
  padding: 2px 12px;
  border: var(--border-brand);
  border-radius: 24px;
  background-color: var(--white-bg-color);
  box-shadow: var(--shadow-brand);
  margin-bottom: 4px;
  &:focus {
    outline: var(--border-accent);
  }
`;

const StyledAmountLabel = styled.label`
  grid-area: amountLabel;
  display: flex;
  align-items: center;
  font-weight: bold;
`;

const StyledCurrencyInput = styled(CurrencyInput)`
  grid-area: amountInput;
  padding: 2px 12px;
  border: var(--border-brand);
  border-radius: 24px;
  background-color: var(--white-bg-color);
  box-shadow: var(--shadow-brand);

  &:focus {
    outline: var(--border-accent);
  }
`;

const ErrorMessageAmount = styled.p`
  grid-area: amountErrorMessage;
  color: var(--friendly-red-color);
  padding-left: 12px;
`;

const StyledCategoryLabel = styled.label`
  grid-area: categoryLabel;
  display: flex;
  align-items: center;
  font-weight: bold;
`;

const DropdownContainer = styled.div`
  display: flex;
  grid-area: categoryInput;
  flex-direction: column;
  position: relative;
`;

const StyledCategorySelect = styled.div`
  display: flex;
  justify-content: space-between;
`;

const DropdownButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2px 12px;
  outline: ${({ $active }) =>
    $active ? "var(--border-accent)" : "var(--border-brand);"};
  border-radius: 24px;
  background-color: var(--white-bg-color);
  box-shadow: var(--shadow-brand);
  width: 210px;
  gap: var(--gap-sm);
`;

const DropdownList = styled.div`
  position: absolute;
  top: 34px;
  left: 0;
  max-height: 200px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: var(--gap-sm);
  width: 210px;
  border: var(--border-brand);
  border-radius: 4px;
  background-color: var(--white-bg-color);
  padding: 4px 12px;
  z-index: 50;
`;

const DropdownItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--gap-sm);
`;

const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
`;

const ErrorMessageCategory = styled.p`
  grid-area: categoryErrorMessage;
  color: var(--friendly-red-color);
  padding-left: 12px;
`;

const StyledTypeLabel = styled.label`
  grid-area: typeLabel;
  display: flex;
  align-items: center;
  font-weight: bold;
`;

const StyledToggleButton = styled.div`
  grid-area: typeToggleButton;
  display: flex;
  background-color: var(--white-bg-color);
  border-radius: 30px;
  box-shadow: var(--shadow-brand);

  input {
    display: none;
  }

  label {
    padding: 2px 12px;
    border-radius: 30px;
    width: 120px;
    text-align: center;
    background-color: var(--white-bg-color);
    border: var(--border-brand);
  }

  label[for="income"] {
    border-radius: 30px 0 0 30px;
  }

  label[for="expense"] {
    border-radius: 0 30px 30px 0;
  }

  input:checked + label {
    background-color: var(--accent-color);
  }
`;

const StyledRadioLabel = styled.label`
  grid-area: radioLabel;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ErrorMessageType = styled.p`
  grid-area: typeErrorMessage;
  color: var(--friendly-red-color);
  padding-left: 12px;
`;

const StyledDateLabel = styled.label`
  grid-area: dateLabel;
  display: flex;
  align-items: center;
  font-weight: bold;
`;

const StyledDateInput = styled.input`
  grid-area: dateInput;
  padding: 2px 12px;
  border: var(--border-brand);
  border-radius: 24px;
  background-color: var(--white-bg-color);
  box-shadow: var(--shadow-brand);

  &:focus {
    outline: var(--border-accent);
  }
`;

const StyledButton = styled.button`
  border-radius: 24px;
  background-color: var(--accent-color);
  padding: 4px 24px;
  border: none;
  box-shadow: var(--shadow-brand);
`;
