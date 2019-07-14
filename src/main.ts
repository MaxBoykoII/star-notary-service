import express from 'express';
import bodyParser from 'body-parser';
import { ValidationController } from './controllers';

const app = express();
const port = 8000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/* Setup controllers */
app.use('/', new ValidationController().router)

app.listen(port, () => console.log(`The star notary service is active on port ${port}...`));