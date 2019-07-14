import { MempoolRequest } from './mempool-request';


export class Mempool {
    private store: { [address: string]: { req: MempoolRequest, timeout: NodeJS.Timeout } } = {};

    add(req: MempoolRequest) {
        const address = req.address;
        const timeout = setTimeout(() => delete this.store[address], req.window);

        this.store[address] = { req, timeout };
    }

    retrieve(address: string): MempoolRequest {
        const data = this.store[address];
        if (data)
            return data.req;
        return null;
    }

    has(address: string): boolean {
        return !!this.retrieve(address);
    }

    remove(address: string): void {
        if (this.store[address]) {
            const { timeout } = this.store[address];

            clearTimeout(timeout);
            delete this.store[address];
        }
    }

}