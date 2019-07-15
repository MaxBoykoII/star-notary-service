import express, { Request, Response } from 'express';
import { Mempool, Blockchain, Block } from '../models';
import { validateStarReqData, decodeStory } from '../helpers';

export class BlockController {
    router = express.Router();

    constructor(private mempool: Mempool, private blockchain: Blockchain) {
        this.registerStar()
            .getBlockByIndex();
    }

    private registerStar() {
        this.router.post('/', async (req: Request, res: Response) => {
            if (validateStarReqData(req)) {
                const { address, star: { dec, ra, story } } = req.body;
                if (!this.mempool.isValid(address)) {
                    res.status(400);
                    res.send('Address has not be properly validated or validation window has expired.');
                }
                else {
                    this.mempool.remove(address);
                    const blockData = {
                        address, star: {
                            dec,
                            ra,
                            story: Buffer.from(story).toString('hex')
                        }
                    };

                    const block = await this.blockchain.addBlock(new Block(blockData));

                    res.json(block)
                }

            } else {
                res.status(400);
                res.send('One or more required fields are missing.');
            }
        });

        return this
    }

    getBlockByIndex() {
        this.router.get('/:height', (req, res) => {
            const height = +req.params.height;

            this.blockchain.getBlock(height)
                .then(block => decodeStory(block))
                .then(block => res.json(block))
                .catch(err => {
                    if (err.toString().includes('NotFoundError')) {
                        res.status(400);
                        res.send(`There is no block in the chain at height ${height}.`);
                    }
                    else {
                        console.warn('here is the error', err);
                        res.status(500);
                        res.send('An unexpected error has occurred.')
                    }
                });
        });

        return this;
    }

}