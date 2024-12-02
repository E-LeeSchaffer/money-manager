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
    }
  } catch (error) {
    console.log("x");
    return response.status(400).json({ error: error.message });
  }
}
