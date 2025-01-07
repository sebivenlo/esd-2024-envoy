const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const TYPE = process.env.TYPE;

app.get('/', (req, res) => {
    res.send(`I am ${TYPE} Service on port ${PORT}`);
});

app.listen(PORT, () => {
    console.log(`${TYPE} Service is running on port ${PORT}`);
});