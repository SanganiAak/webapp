const express = require('express');
require('dotenv').config();
const sequelize = require('./sequelize');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.all('/healthz', async (request, response) => {
    if (request.method !== 'GET') {
        response.status(405).send();
        return;
    }
    if (Object.keys(request.body).length > 0) {
        response.status(400).send();
        return;
    }

    try {
        await sequelize.authenticate();
        response.setHeader('Cache-Control', 'no-cache');
        response.status(200).send();
    } catch (error) {
        response.setHeader('Cache-Control', 'no-cache');
        response.status(503).send();
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Running server on port ${PORT}.`);
});
