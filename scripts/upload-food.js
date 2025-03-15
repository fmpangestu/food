/* eslint-disable @typescript-eslint/no-require-imports */
// scripts/upload-food.js
const { createClient } = require("@vercel/kv");
const fs = require("fs");
const Papa = require("papaparse");

// Gunakan env vars dari .env.local
require("dotenv").config({ path: ".env.local" });

// Perbaikan di sini: gunakan REST API URL dan token dengan benar
const kv = createClient({
  url: process.env.KV_REST_API_URL, // Bukan KV_URL
  token: process.env.KV_REST_API_TOKEN,
});

async function uploadFoods() {
  try {
    const csvData = fs.readFileSync("./public/foods.csv", "utf8");
    const result = Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
    });

    console.log(`Uploading ${result.data.length} foods to KV...`);
    await kv.set("foods", result.data);
    console.log("Upload complete!");
  } catch (error) {
    console.error("Error uploading foods:", error);
  }
}

uploadFoods();
