import dbConnect from "@/db/connect";
import Transaction from "@/db/models/Transaction";

export default async function handler(request, response) {
  await dbConnect();

  const { id } = request.query;

  try {
    if (request.method === "GET") {
      const transaction = await Transaction.findById(id).populate("category");

      return response.status(200).json(transaction);
    }
    if (request.method === "PUT") {
      const updatedTransaction = await Transaction.findByIdAndUpdate(
        id,
        request.body
      );
      if (!updatedTransaction) {
        response.status(404).json({ error: "Transaction not found" });
        return;
      }
      response.status(200).json(updatedTransaction);
      return;
    }

    if (request.method === "DELETE") {
      await Transaction.findByIdAndDelete(id);
      return response.status(200).json({ message: "Transaction deleted" });
    }
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
}
