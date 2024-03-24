// server.js
import express from "express";
import { promises as fs } from "fs";
import { connectDB, NoteModel } from "./db.js";
import bodyParser from "body-parser";
import { generateRandomName } from "./utils.js";
import { JSDOM } from 'jsdom';
import { injectSpeedInsights } from '@vercel/speed-insights';
 
const { json } = bodyParser;

const app = express();

// Middleware to parse JSON requests
app.use(json());

// Serve static files (e.g., HTML, CSS, images)
app.use(express.static("public"));

// Connect to MongoDB using the imported function
connectDB();

injectSpeedInsights();

app.get("/", async (req, res) => {
  try {
    const nameOfNote = generateRandomName();
    res.redirect(`/${nameOfNote}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/demo", async (req, res) => {
  try {
    const indexHtml = await fs.readFile('./public/index.html', 'utf-8');
    res.send(indexHtml);
  } catch (error) {
    console.error("Error serving static file:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/:name_of_note", async (req, res) => {
  try {
    const nameOfNote = req.params.name_of_note;
    const foundNote = await NoteModel.findOne({name : nameOfNote});
    const indexHtml = await fs.readFile('./public/index.html', 'utf-8');

    if (foundNote) {
      const dom = new JSDOM(indexHtml);
      const document = dom.window.document;

      const textarea = document.createElement('textarea');
      textarea.id = 'text-input';
      textarea.placeholder = 'Type your text here...';
      textarea.textContent = foundNote.content;

      const existingTextarea = document.getElementById('text-input');
      existingTextarea.parentNode.replaceChild(textarea, existingTextarea);

      const updatedHtml = dom.serialize();

      res.send(updatedHtml);
    } else {
      res.send(indexHtml);
    }
  } catch (error) {
    console.error("Error handling request:", error);
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

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT || 3000}/`);
});
