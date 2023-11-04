const express = require("express");
const logger = require("morgan");
const cors = require("cors");


const contactsRouter = require("./routes/api/contacts");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

// app.use((err, req, res, next) => {
//   res.status(500).json({ message: err.message });
// });

app.use((req, res, next) => {
  console.log(`Received a request to: ${req.originalUrl}`);
  next();
});

app.get('/api/contacts', (req, res) => {
  // Обработка GET-запроса для /api/contacts
  res.status(200).json({ message: 'GET request received' });
});



module.exports = app;
