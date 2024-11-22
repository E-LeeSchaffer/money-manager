import mongoose from "mongoose";
const { Schema } = mongoose;

const transactionSchema = new Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  type: { type: String, required: true },
  date: { type: Date, required: true },
});

const Transaction =
  mongoose.models.Transaction ||
  mongoose.model("Transaction", transactionSchema);

export default Transaction;
