import mongoose from "mongoose";
import "./Category";

const { Schema } = mongoose;

const transactionSchema = new Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: false },
  type: { type: String, required: true },
  date: { type: Date, required: true },
  note: { type: String, default: "" },
});

const Transaction =
  mongoose.models.Transaction ||
  mongoose.model("Transaction", transactionSchema);

export default Transaction;
