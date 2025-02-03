import { MongoClient } from "mongodb";

const uri = "mongodb://localhost:27017/healthy_food_recommendation"; // Atur URI sesuai setup
const client = new MongoClient(uri);

const foods = [
  {
    name: "Dada Ayam Rebus",
    category: "hewani",
    calories: 165,
    protein: 31,
    fat: 3.6,
    carbs: 0,
    serving_size: "100g",
    preparation: "rebus",
  },
  {
    name: "Tahu Goreng",
    category: "nabati",
    calories: 76,
    protein: 8,
    fat: 4,
    carbs: 2,
    serving_size: "100g",
    preparation: "goreng",
  },
  {
    name: "Salad Sayur",
    category: "nabati",
    calories: 50,
    protein: 2,
    fat: 1,
    carbs: 10,
    serving_size: "100g",
    preparation: "mentah",
  },
];

async function seedDatabase() {
  try {
    await client.connect();
    const db = client.db("healthy_food_recommendation");
    const collection = db.collection("foods");

    const result = await collection.insertMany(foods);
    console.log(`${result.insertedCount} foods inserted`);
  } finally {
    await client.close();
  }
}

seedDatabase().catch(console.error);
