import dbConnect from "@/db/connect";
import Transaction from "@/db/models/Transaction";

export default async function handler(request, response) {
  await dbConnect();

  try {
    if (request.method === "GET") {
      const transactions = await Transaction.find().populate("category");
      return response.status(200).json(transactions);
    }

    if (request.method === "POST") {
      const newTransaction = request.body;
      const createdTransaction = await Transaction.create(newTransaction);
      return response.status(201).json(createdTransaction);
    }

    return response.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
}
