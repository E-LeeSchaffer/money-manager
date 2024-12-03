import dbConnect from "@/db/connect";
import Category from "@/db/models/Category";

export default async function handler(request, response) {
  await dbConnect();

  try {
    if (request.method === "GET") {
      const categories = await Category.find();
      response.status(200).json(categories);
      return;
    }

    if (request.method === "POST") {
      const newCategory = request.body;
      const createdCategory = await Category.create(newCategory);
      response.status(201).json(createdCategory);
      return;
    }
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
}
