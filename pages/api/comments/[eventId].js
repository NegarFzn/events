import {
  connectDatabase,
  insertDocument,
  getAllDocuments,
} from "../../../helpers/db.util";

async function handler(req, res) {
  const eventId = req.query.eventId;

  let client;

  try {
    client = await connectDatabase();
  } catch (error) {
    res.status(500).json({ message: "connecting to database failed!" });
    return;
  }

  if (req.method === "POST") {
    const { name, text, email } = req.body;
    if (
      !name ||
      !text ||
      !email ||
      name.trim() === "" ||
      text.trim() === "" ||
      !email.includes("@")
    ) {
      res.status(422).json({ message: "Invalid input" });
      client.close();
      return;
    }
    const newComment = {
      name,
      email,
      text,
      eventId,
    };

    let result;

    try {
      result = await insertDocument(client, "events", "comments", newComment);
      newComment._id = result.insertedId;
      res.status(201).json({ message: "Added comment", comment: newComment });
    } catch (error) {
      res.status(500).json({ message: "Inserting comment failed!" });
    }
  }

  if (req.method === "GET") {
    try {
      const documents = await getAllDocuments(
        client,
        "comments",
        { _id: -1 },
        { eventId: eventId }
      );
      res.status(200).json({ comments: documents });
    } catch (error) {
      res.status(500).json({ message: "Getting comments failed!" });
    }
  }

  client.close();
}

export default handler;
