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

    testSignature(address: string, signature: string): boolean {
        if (!this.has(address))
            return false;

        return this.retrieve(address).testSignature(signature);
    }

    isValid(address: string): boolean {
        return this.has(address) && this.retrieve(address).isValid;
    }

    markAsValid(address: string, window: number): void {
        if(this.has(address)) {
          const old = this.retrieve(address);
          const validated = old.markAsValid(window);

          this.remove(address);
          this.add(validated);
        }
    }
}