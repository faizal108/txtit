// db.js
import { connect, Schema, model } from "mongoose";

const connectDB = async () => {
  try {
    await connect("mongodb://localhost:27017/txtitdb", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

// Define a schema for the Note collection
const noteSchema = new Schema({
  name: String,
  content: String,
});

// Create a model for the Note collection
const NoteModel = model("Note", noteSchema);

// Export connectDB and NoteModel separately
export { connectDB, NoteModel };
