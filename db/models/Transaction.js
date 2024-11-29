import mongoose from "mongoose";
import "./Category";
const { Schema } = mongoose;

const transactionSchema = new Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: Schema.Types.ObjectId, ref: "Category" },
  type: { type: String, required: true },
  date: { type: Date, required: true },
});

const Transaction =
  mongoose.models.Transaction ||
  mongoose.model("Transaction", transactionSchema);

export default Transaction;
