const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3030;

app.use(bodyParser.json());

app.use(
    bodyParser.urlencoded({ 
        extended: true,
    })
);

const roleRoutes = require("./routes/role.js");

app.use('/roles', roleRoutes);

app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
});

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
});