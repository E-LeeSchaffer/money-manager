import { categories } from "@/lib/categories";
import CurrencyInput from "react-currency-input-field";

export default function TransactionForm({ onAdd }) {
  const today = new Date().toISOString().split("T")[0];

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
          <select id="category" name="category" required>
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
          <div id="type">
            <input id="income" name="type" type="radio" value="income" />
            <label htmlFor="income">Income</label>
            <input id="expense" name="type" type="radio" value="expense" />
            <label htmlFor="expense">Expense</label>
          </div>

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
