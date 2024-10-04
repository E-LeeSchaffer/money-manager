import { categories } from "@/lib/categories";

export default function TransactionForm({ onAdd }) {
  const today = new Date().toISOString().split("T")[0];

  function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    onAdd(data);
    event.target.reset();
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>Add a new transaction</legend>
          <label htmlFor="name">Name</label>
          <input type="text" id="name" name="name" required></input>
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            id="amount"
            name="amount"
            min="1"
            required
          ></input>
          <label htmlFor="category">Category</label>
          <select id="category" name="category" required>
            <option value="defaultSelect" disabled selected>
              Please select an option
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
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
