const express = require("express");

// Retrieve dynamic values
const PORT = process.env.PORT; // Port from environment
const SERVICE_NAME = process.env.SERVICE_NAME;

const app = express();

let isBroken = false; // Flag to toggle service state
let recoveryTimeout = null; // To manage automatic recovery

app.get("/", (req, res) => {
  if (isBroken) {
    return res.status(503).send("Service unavailable");
  }
  res.send(`I am ${SERVICE_NAME} on port ${PORT}`);
});

app.get("/health", (req, res) => {
  if (isBroken) {
    return res.status(503).send("Unhealthy");
  }
  res.status(200).send(`${SERVICE_NAME} is healthy!`);
});

// Endpoint to toggle the service state
app.post("//toggle", async (req, res) => {
    isBroken = !isBroken;
  
    // If switching to "broken" state, set a timeout for recovery
    if (isBroken) {
      // Automatically recover after 30 seconds (or any desired time)
      recoveryTimeout = setTimeout(() => {
        isBroken = false;
        console.log("Service automatically recovered after timeout");
      }, 30000);
    } else {
      // If switching to "healthy" state, clear any recovery timeout
      if (recoveryTimeout) {
        clearTimeout(recoveryTimeout);
        recoveryTimeout = null;
      }
    }

    // Respond promptly
    res.send(`Service is now ${isBroken ? "broken" : "healthy"}`);
});

// Simulate delay when the service is broken
app.get("/delayed", (req, res) => {
  if (isBroken) {
    setTimeout(() => {
      res.status(503).send("Service unavailable due to delay");
    }, 30000); // 30 seconds delay
  } else {
    res.send("This is the delayed response endpoint");
  }
});

app.listen(PORT, () => {
  console.log(`${SERVICE_NAME} is running on port ${PORT}`);
});
