const express = require("express");

// Retrieve dynamic values
const PORT = process.env.PORT; // Port from environment
const SERVICE_NAME = process.env.SERVICE_NAME;

const app = express();

app.get("/", (req, res) => {
  res.send(`I am ${SERVICE_NAME} on port ${PORT}`);
});

app.listen(PORT, () => {
  console.log(`${SERVICE_NAME} is running on port ${PORT}`);
});

app.get("/health", (req, res) => {
  res.status(200).send(`${SERVICE_NAME} is healthy!`);
});