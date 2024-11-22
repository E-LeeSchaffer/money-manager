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
      const transactionData = request.body;
      console.log(transactionData);
      await Transaction.create(transactionData);
      return response.status(201).json({ message: "Product created." });
    } else {
      return response.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
}
