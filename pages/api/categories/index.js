import dbConnect from "@/db/connect";
import Category from "@/db/models/Category";

export default async function handler(request, response) {
  await dbConnect();

  try {
    if (request.method === "GET") {
      const categories = await Category.find();
      return response.status(200).json(categories);
    } else if (request.method === "POST") {
      const newCategory = JSON.parse(request.body);
      const createdCategory = await Category.create(newCategory);
      return response.status(201).json(createdCategory);
    } else if (request.method === "PUT") {
      const updatedCategory = request.body;
      await Category.findByIdAndUpdate(id, updatedCategory);
      return response.status(200).json({ message: "Category updated" });
    } else if (request.method === "DELETE") {
      await Category.findByIdAndDelete(id);
      return response.status(200).json({ message: "Category deleted" });
    } else {
      return response.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    console.log("x");
    return response.status(400).json({ error: error.message });
  }
}
