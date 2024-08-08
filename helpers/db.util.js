import { MongoClient } from "mongodb";

export async function connectDatabase() {
  const client = await MongoClient.connect(
    "mongodb+srv://negar:n11111111@cluster0.wqquayv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  );
  return client;
}

export async function insertDocument(client, dbName, collection, document) {
  const db = client.db(dbName);
  const result = await db.collection(collection).insertOne(document);
  return result;
}

export async function getAllDocuments(client, collection, sort, filter = {}) {
  const db = client.db("events");
  const documents = await db
    .collection(collection)
    .find(filter)
    .sort(sort)
    .toArray();
  return documents;
}
