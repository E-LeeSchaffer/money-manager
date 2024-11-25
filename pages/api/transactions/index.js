import dbConnect from "@/db/connect";
import Transaction from "@/db/models/Transaction";

export default async function handler(request, response) {
  await dbConnect();

  try {
    if (request.method === "GET") {
      const transactions = await Transaction.find();
      console.log("transactions:", transactions);
      return response.status(200).json(transactions);
    } else if (request.method === "POST") {
      const newTransaction = request.body;
      console.log(newTransaction);
      await Transaction.create(newTransaction);
      return response.status(201).json({ message: "Transaction created." });
    } else if (request.method === "PUT") {
      const updatedTransaction = request.body;
      await Transaction.findByIdAndUpdate(id, updatedTransaction);
      return response.status(200).json({ message: "Transaction updated" });
    } else if (request.method === "DELETE") {
      await Transaction.findByIdAndDelete(id);
      return response.status(200).json({ message: "Transaction deleted" });
    } else {
      return response.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
}
