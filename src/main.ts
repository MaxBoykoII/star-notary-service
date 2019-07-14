import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = 8082;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(port, () => console.log(`The star notary service is active on port ${port}...`));