export class MempoolRequest {
    constructor(public address: string, public timestamp: number, public window: number) {
        if (!address)
            throw new Error('Wallet address cannot be null or the empty string!');
        if (!timestamp)
            throw new Error('Timestamp must be a number!');

        if (!window)
            throw new Error('Validation must be a number!');
    }

    toJSON() {
        return {
            walletAddress: this.address,
            requestTimeStamp: this.timestamp.toString(),
            validationWindow: this.getTimeRemaining()
        };
    }

    private getTimeRemaining(): number {
        const now = +Date.now();
        const expiration = this.timestamp + this.window;

        return Math.floor((expiration - now) / 1000);
    }
}