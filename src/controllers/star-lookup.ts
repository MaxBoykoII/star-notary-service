import express, { Request, Response } from 'express';
import { Blockchain } from '../models';
import { decodeStory } from '../helpers';

export class StarLookupController {
    router = express.Router();

    constructor(private blockchain: Blockchain) {
        this.getStarByHash()
            .getStarsByAddress();
    }

    getStarByHash() {
        this.router.get('/hash:hash', (req: Request, res: Response) => {
            const hash = req.params.hash;
            this.blockchain
                .searchBlocks(block => block.hash === hash)
                .then(blocks => {
                    if (!blocks.length) {
                        res.status(400);
                        res.send(`None of the block in the chain has a hash that matches ${hash}.`);
                    }
                    else {
                        const block = decodeStory(blocks[0]);

                        res.json(block);
                    }
                })
                .catch(_ => {
                    res.status(500);
                    res.send('An unexpected error has occurred.');
                })
        });

        return this;
    }

    getStarsByAddress() {
        this.router.get('/address:address', (req: Request, res: Response) => {
            const address = req.params.address;

            this.blockchain
                .searchBlocks((block => block.body.address === address))
                .then(blocks => blocks.map(b => decodeStory(b)))
                .then(blocks => res.json(blocks))
                .catch(_ => {
                    res.status(500);
                    res.send('An unexpected error has occurred');
                });
        });
        return this;
    }
}