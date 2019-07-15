import express, { Request, Response } from 'express';
import { MempoolRequest, Mempool } from '../models';
import { validateReqBody } from '../helpers';

const TIMEOUT_REQUEST_WINDOW = 5 * 60 * 1000;
const TIMEOUT_VALID_REQUEST_WINDOW = 30 * 60 * 1000;

export class ValidationController {
    router = express.Router();

    constructor(private mempool: Mempool) {
        this.requestValidation()
            .validateSignature();
    }

    private requestValidation() {
        this.router.post('/requestValidation', (req: Request, res: Response) => {
            if (validateReqBody(req, ['walletAddress'])) {
                const { walletAddress } = req.body;

                if (this.mempool.has(walletAddress)) {
                    const mempoolReq = this.mempool.retrieve(walletAddress);
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

    private validateSignature() {
        this.router.post('/message-signature/validate', (req: Request, res: Response) => {
            if (validateReqBody(req, ['address', 'signature'])) {
                const { address, signature } = req.body;
                if (!this.mempool.has(address)) {
                    res.status(400);
                    res.send(`No request matches ${address}.`);
                }
                else if(this.mempool.isValid(address)) {
                    res.json(this.mempool.retrieve(address).toJSON());
                }
                else if (this.mempool.testSignature(address, signature)) {
                    this.mempool.markAsValid(address, TIMEOUT_VALID_REQUEST_WINDOW);

                    res.json(this.mempool.retrieve(address).toJSON());
                } else {
                    res.status(400);
                    res.send(`Invalid signature.`);
                }

            } else {
                res.status(400);
                res.send('Request body must include a valid wallet address and signature.');
            }
        });

        return this;
    }
}