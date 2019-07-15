/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

const SHA256 = require('crypto-js/sha256');

import { LevelSandbox } from '../leveldb';
import { Block } from './block';

export class Blockchain {
    bd = new LevelSandbox();

    // Helper method to create a Genesis Block (always with height= 0)
    async generateGenesisBlock() {
        const block = new Block('First block in the chain - genesis block');

        block.height = 0;
        block.time = new Date().getTime().toString().slice(0, -3);
        block.hash = SHA256(JSON.stringify(block)).toString();

        await this.bd.addLevelDBData(0, JSON.stringify(block));
    }

    // Get block height
    async getBlockHeight() {
        return await this.bd.getBlocksCount();
    }

    // Helper method that checks whether a genesis block has already been created
    // if not, it generates ones
    async checkForGenesisBlock() {
        const blockHeight = await this.getBlockHeight();

        if (blockHeight === 0) {
            await this.generateGenesisBlock();
        }
    }

    // Add new block
    async addBlock(block: Block) {
        // Ensure the gensis block has been added
        await this.checkForGenesisBlock();

        const blockHeight = await this.getBlockHeight();
        const prevBlock = await this.getBlock(blockHeight - 1);

        block.height = blockHeight;
        block.time = new Date().getTime().toString().slice(0, -3);
        block.previousBlockHash = prevBlock.hash;
        block.hash = SHA256(JSON.stringify(block)).toString();

        await this.bd.addLevelDBData(blockHeight, JSON.stringify(block));

        return block;
    }

    // Get Block By Height
    async getBlock(height: number) {
        const data = await this.bd.getLevelDBData(height);

        return JSON.parse(data);
    }

    // Validate if Block is being tampered by Block Height
    async validateBlock(height: number) {
        const { hash, ...rest } = await this.getBlock(height);

        return hash === SHA256(JSON.stringify({ ...rest, hash: '' })).toString();

    }

    // Validate Blockchain
    async validateChain() {
        const blockHeight = await this.getBlockHeight();
        let errors = [];

        for (let i = 0; i < blockHeight; i++) {
            const block = await this.getBlock(i);
            const isValid = await this.validateBlock(i);

            // return false if the block itself is invalid
            if (!isValid) {
                errors.push(`Block ${i} is invalid.`);
            }

            // validate that the hash of the current block matches the previousBlockHash of the next block
            if (i < blockHeight - 1) {
                const nextBlock = await this.getBlock(i + 1);

                if (block.hash !== nextBlock.previousBlockHash) {
                    errors.push(`The hash of Block ${i} differs from the previousBlockHash of Block ${i+1}.`);
                }
            }
        }

        return errors;
    }
}

module.exports.Blockchain = Blockchain;
