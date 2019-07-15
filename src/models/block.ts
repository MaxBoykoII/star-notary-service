/* ===== Block Class ==============================
|  Class with a constructor for block 			   |
|  ===============================================*/

export class Block {
    public height: number = null;
    public time = '';
    public body: any;
    public previousBlockHash: any;
    public hash = '';

    constructor(data: any) {
        this.body = data;
    }
}