import express from 'express';
import bodyParser from 'body-parser';
import { ValidationController, BlockController } from './controllers';
import { Mempool, Blockchain } from './models';

const app = express();
const port = 8000;
const mempool = new Mempool();
const blockchain = new Blockchain();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/* Setup controllers */
app.use('/', new ValidationController(mempool).router)
app.use('/block', new BlockController(mempool, blockchain).router);

app.listen(port, () => console.log(`The star notary service is active on port ${port}...`));