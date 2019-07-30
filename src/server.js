const express = require('express')
const app = express()
const port = 8080

app.get('/person/tilbakemeldinger-api/', (req, res) => res.send('Hello World!'));
app.get("/person/tilbakemeldinger-api/internal/isAlive", (req, res) => res.sendStatus(200));
app.get("/person/tilbakemeldinger-api/internal/isReady", (req, res) => res.sendStatus(200));

app.listen(port, () => console.log(`App listening on port ${port}!`))