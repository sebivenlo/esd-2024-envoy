const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
const TYPE = process.env.TYPE;

app.get('/', (req, res) => {
    res.send(`I am ${TYPE} Service on port ${PORT}`);
});

app.get(/health/, (req, res) => {
    res.status(200).send(`${TYPE} Service ${PORT - 3002} is healthy`);
});

app.listen(PORT, () => {
    console.log(`${TYPE} Service is running on port ${PORT}`);
});