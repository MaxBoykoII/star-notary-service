/* ===== Persist data with LevelDB ==================
|  Learn more: level: https://github.com/Level/level |
/===================================================*/

const level = require('level');
const chainDB = './chaindata';

export class LevelSandbox {
    private db = level(chainDB);
    // Get data from levelDB with key (Promise)
    getLevelDBData(key: string | number) {
        return this.db.get(key);
    }

    // Add data to levelDB with key and value (Promise)
    async addLevelDBData(key: string | number, value: any) {
        await this.db.put(key, value);

        return this.getLevelDBData(key);
    }

    // Method that return the height
    getBlocksCount(): Promise<number> {
        let count = 0;

        return new Promise((resolve, reject) =>
            this.db.createReadStream()
                .on('data', () => count += 1)
                .on('error', (err: Error) => reject(err))
                .on('end', () => resolve(count)));
    }

    searchBlocks(searchFn: (block: any) => boolean): Promise<string[]> {
        let matches: string[] = [];
        
        return new Promise((resolve, reject) =>
            this.db.createReadStream()
                .on('data', (data: any) => {
                    searchFn(JSON.parse(data.value)) && matches.push(data.value)
                })
                .on('error', (err: Error) => reject(err))
                .on('end', () => resolve(matches)));
    }


}
