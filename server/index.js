import cors from "cors";
import express from "express";
import multer from "multer";
import { parse } from "csv-parse/sync";
import { generatePdfsFromRows } from "./services/pdfService.js";

const app = express();
const PORT = 3000;
const upload = multer({ storage: multer.memoryStorage() });

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

// Define a GET endpoint
app.get("/api/data", (req, res) => {
  const sampleData = {
    name: "John Doe",
    age: 30,
    occupation: "Software Developer",
  };
  res.json(sampleData);
});

app.post("/api/parse", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const records = parse(req.file.buffer, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    cast: true,
  });

  const generatedFiles = await generatePdfsFromRows(records, req.body.folder);

  res.json({
    success: true,
    count: generatedFiles.length,
    records: records,
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Esse é o backend, deixa ele em paz - http://localhost:${PORT}`);
});
