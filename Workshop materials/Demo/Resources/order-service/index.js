const express = require("express");

// Retrieve dynamic values
const PORT = process.env.PORT; // Port from environment
const SERVICE_NAME = process.env.SERVICE_NAME;

const app = express();

let isBroken = false; // Flag to toggle service state
let recoveryTimeout = null; // To manage automatic recovery

app.get("/orders", (req, res) => {
  if (isBroken) {
    return res.status(503).send(`${SERVICE_NAME} unavailable`);
  }
  res.send(`I am ${SERVICE_NAME} on port ${PORT}`);
});

app.get("/orders/health", (req, res) => {
  if (isBroken) {
    return res.status(503).send(`${SERVICE_NAME} is unhealthy!`);
  }
  res.status(200).send(`${SERVICE_NAME} is healthy!`);
});

// Endpoint to toggle the service state
app.post("/orders/toggle", async (req, res) => {
    isBroken = !isBroken;
  
    // If switching to "broken" state, set a timeout for recovery
    if (isBroken) {
      // Automatically recover after 30 seconds (or any desired time)
      recoveryTimeout = setTimeout(() => {
        isBroken = false;
        console.log(`${SERVICE_NAME} automatically recovered after timeout`);
      }, 30000);
    } else {
      // If switching to "healthy" state, clear any recovery timeout
      if (recoveryTimeout) {
        clearTimeout(recoveryTimeout);
        recoveryTimeout = null;
      }
    }

    // Respond promptly
    res.send(`${SERVICE_NAME} is now ${isBroken ? "broken" : "healthy"}.`);
});

// Simulate delay when the service is broken
app.get("/orders/delayed", (req, res) => {
    setTimeout(() => {
      console.log(`${SERVICE_NAME} unavailable due to delay`);
      res.status(503).send(`${SERVICE_NAME} unavailable due to delay`);
    }, 10000); // 10 seconds delay
});

app.listen(PORT, () => {
  console.log(`${SERVICE_NAME} is running on port ${PORT}`);
});
