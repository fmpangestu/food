/* eslint-disable no-var */
import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI_ATLAS) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI_ATLAS"');
}

const uri = process.env.MONGODB_URI_ATLAS;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// Deklarasi modul global untuk TypeScript
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === "development") {
  // Dalam mode development, gunakan variabel global agar nilai
  // tetap ada saat terjadi HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // Dalam mode production, lebih baik tidak menggunakan variabel global.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Ekspor promise MongoClient yang dapat dibagikan di seluruh fungsi.
export default clientPromise;
