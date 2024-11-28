import dbConnect from "@/db/connect";
import Category from "@/db/models/Category";

export default async function handler(request, response) {
  await dbConnect();

  const { id } = request.query;

  try {
    if (request.method === "GET") {
      const category = await Category.findById(id);
      console.log(category);
      return response.status(200).json(category);
    }
    if (request.method === "PUT") {
      const updatedCategory = await Category.findByIdAndUpdate(
        id,
        request.body
      );
      if (!updatedCategory) {
        response.status(404).json({ error: "Category not found" });
        return;
      }
      response.status(200).json(updatedCategory);
      return;
    }

    if (request.method === "DELETE") {
      await Category.findByIdAndDelete(id);
      return response.status(200).json({ message: "Category deleted" });
    }
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
}
