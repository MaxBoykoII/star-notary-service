const bitcoinMessage = require('bitcoinjs-message');

export class MempoolRequest {
    constructor(public readonly address: string,
        public readonly timestamp: number,
        public readonly window: number,
        public readonly isValid = false) {
        if (!address)
            throw new Error('Wallet address cannot be null or the empty string!');
        if (!timestamp)
            throw new Error('Timestamp must be a number!');

        if (!window)
            throw new Error('Validation must be a number!');
    }

    toJSON() {
        return this.isValid ? {
            registerStar: true,
            status: {
                address: this.address,
                requestTimeStamp: this.timestamp,
                message: this.getMessage(),
                validationWindow: this.getTimeRemaining(),
                messageSignature: false
            }
        } :
            {
                walletAddress: this.address,
                requestTimeStamp: this.timestamp.toString(),
                validationWindow: this.getTimeRemaining(),
                message: this.getMessage()
            };
    }

    testSignature(signature: string): boolean {
        try {
            return bitcoinMessage.verify(this.getMessage(), this.address, signature);
        }
        catch {
            return false;
        }
    }

    markAsValid(window: number): MempoolRequest {
        const { address, timestamp } = this;
        const timeElapsed = +Date.now() - this.timestamp;

        return new MempoolRequest(address, timestamp, window + timeElapsed, true);
    }

    private getMessage() {
        return `${this.address}:${this.timestamp}:starRegistry`;
    }

    private getTimeRemaining(): number {
        const now = +Date.now();
        const expiration = this.timestamp + this.window;

        return Math.floor((expiration - now) / 1000);
    }
}