// server.js
import express from "express";
import { promises as fs } from "fs";
import { connectDB, NoteModel } from "./db.js";
import bodyParser from "body-parser";
import { generateRandomName } from "./utils.js";
import DOMPurify from "dompurify";
const { json } = bodyParser;

const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(json());

// Serve static files (e.g., HTML, CSS, images)
app.use(express.static("public"));

// Connect to MongoDB using the imported function
connectDB();

app.get("/s", async (req, res) => {
  try {
    console.log("Generating random name...");
    const nameOfNote = generateRandomName();
    console.log("Generated name:", nameOfNote);
    res.redirect(`/${nameOfNote}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/:name_of_note", async (req, res) => {
  try {
    const nameOfNote = req.params.name_of_note;
    console.log("enter in endpoint....");
    // Find the note in MongoDB based on the provided name
    const foundNote = await NoteModel.findOne({ name: nameOfNote });
    // Read the index.html file
    const indexHtml = await fs.readFile('./public/index.html', 'utf-8');
    console.log(indexHtml);
    if (foundNote) {
      const content = '<textarea id="text-input" placeholder="Type your text here...">' + foundNote.content + '</textarea>';
      // Replace the placeholder in the HTML file with the note content
      const updatedHtml = indexHtml.replace('<textarea id="text-input" placeholder="Type your text here..."></textarea>', content);
      res.send(updatedHtml);
    } else {
      // If note not found, send the original HTML file
      res.send(indexHtml);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/api/save/:name_of_note", async (req, res) => {
  try {
    const textToSave = req.body.text;
    const nameOfNote = req.params.name_of_note;

    // Update the note in MongoDB based on the provided name
    const updatedNote = await NoteModel.findOneAndUpdate(
      { name: nameOfNote },
      { content: textToSave },
      { new: true, upsert: true }
    );

    res.json({ savedNote: updatedNote });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}/`);
});