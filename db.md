# User Story 1 - Transactions List

## Tasks

- [ ] Create feature branch `feature/transactions-list`.
- [ ] In the `index.js`, create a header above the list named "Transactions Overview".
- [ ] Create db folder with `connect.js` and `Models/Transaction.js`.
- [ ] Create api folder with `transactions/index.js`.
- [ ] In `transactions/index.js` create handler function with GET method.
- [ ] In the ´index.js´, fetch transaction data from database with GET method.
- [ ] Create a react component `TransactionItem` with the following details: amount, category, type (income/expense) and date.
- [ ] Use conditional styling within the `TransactionItem` component to differentiate between income (green) and expense (red).
- [ ] Create a React component `TransactionsList`, make sure to properly map the `TransactionItem` component.
- [ ] Ensure the list of transactions is scrollable (with overflow-y: scroll).
- [ ] Render on Homepage (`index.js`).

# User Story 2 - Create Transaction

## Tasks

- [ ] Create feature branch `feature/create-transaction`.
- [ ] In the db folder, create `Models/Category.js`.
- [ ] Ensure `Category.js` is properly linked in the `Transaction.js`.
- [ ] In `api/transactions/index.js` update handler function with POST method.
- [ ] Create a `TransactionForm` component with mandatory input fields amount (type: input), category (type: select; defaultValue: "Please select a category"), type (type: radio) and date (type: date; defaultValue: current date).
- [ ] Make sure to properly hand over the fetched transaction data from `index.js` using props.
- [ ] Create submit button with dynamic text ("Add" / "Update").
- [ ] Create `handleSubmit` function with POST method.
- [ ] Implement pop-up success message "Transaction successfully added".
- [ ] Make sure to display the new transaction at the top of the list.
- [ ] Add headline with dynamic text ("Add new transaction" / "Update transaction").
- [ ] Make sure to implement proper isLoading and error messaging.

# User Story 3 - Delete Transaction

## Tasks

- [ ] Create feature branch `feature/delete-transaction`.
- [ ] Create `Button` component with toggle function and dynamic text ("Delete" / "Cancel") and "Confirm" button.
- [ ] In the `TransactionItem` component add `Button`.
- [ ] In the `Button` component create handleDelete function.
- [ ] Display success message after deletion "Transaction successfully deleted".
- [ ] In `api/transaction` create `[id].js`.
- [ ] In `api/transaction/[id].js` create handler function with GET and DELETE method.
- [ ] Make sure to display updated transaction list.
- [ ] Implement message for empty transaction list "No transactions available. Please add a new transaction."
- [ ] Make sure to implement proper isLoading and error messaging.

# User Story 4 - Update Transaction

## Tasks

- [ ] Create feature branch `feature/update-transaction`
- [ ] In the `TransactionItem` add 2nd `Button` component.
- [ ] Make sure the button leads to the `TransactionForm` component in edit mode.
- [ ] In the `Button` component create handleEdit function.
- [ ] In the `TransactionForm` component make sure to the input fields are pre-filled with the already existing data from the transaction.
- [ ] Display success message after update: "Transaction successfully updated".
- [ ] In `api/transaction/[id].js` update handler function with UPDATE method.
- [ ] Make sure to display updated transaction list.
- [ ] Make sure to implement proper isLoading and error messaging.
