import express from 'express';
import bodyParser from 'body-parser';
import { ValidationController, BlockController, StarLookupController } from './controllers';
import { Mempool, Blockchain } from './models';

const app = express();
const port = 8000;
const mempool = new Mempool();
const blockchain = new Blockchain();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/* Set up controllers */
app.use('/', new ValidationController(mempool).router)
app.use('/block', new BlockController(mempool, blockchain).router);
app.use('/stars', new StarLookupController(blockchain).router);

app.listen(port, () => console.log(`The star notary service is active on port ${port}...`));