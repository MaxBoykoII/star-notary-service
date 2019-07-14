import express, { Request, Response } from 'express';
import { MempoolRequest, Mempool } from '../models';

const TIMEOUT_REQUEST_WINDOW = 5 * 60 * 1000;

export class ValidationController {
    router = express.Router();
    private mempool = new Mempool();

    constructor() {
        this.requestValidation();
    }

    private requestValidation() {
        this.router.post('/requestValidation', (req: Request, res: Response) => {
            if (this.validateRequestWithWalletAddress(req)) {
                const { walletAddress } = req.body;

                if (this.mempool.has(walletAddress)) {
                    const mempoolReq = this.mempool.retrieve(walletAddress);
                    console.log('Returing the cached request...');
                    res.json(mempoolReq.toJSON());
                }
                else {
                    const timestamp = +Date.now();
                    const mempoolReq = new MempoolRequest(walletAddress, timestamp, TIMEOUT_REQUEST_WINDOW);

                    this.mempool.add(mempoolReq);

                    res.json(mempoolReq.toJSON());
                }
            }
            else {
                res.status(400);
                res.send('Request body must include a valid wallet address.');
            }
        });

        return this;
    }

    private validateRequestWithWalletAddress(req: Request): boolean {
        return req.body &&
            req.body.walletAddress &&
            typeof req.body.walletAddress === 'string';
    }
}