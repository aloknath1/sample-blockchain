const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(index, timestamp, data, previousHash='') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = '0';
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty+1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("mine block is:", this.hash);
    }
}

class BlockChain {
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
    }

    createGenesisBlock(){
        return new Block(0, "31/05/2021", "Genesis Block", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        //newBlock.hash = newBlock.calculateHash();
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }

        return true;
    }
}

let coin = new BlockChain();
coin.addBlock(new Block(1, "31/05/2021", { amount: 4 }));
coin.addBlock(new Block(2, "02/06/2021", { amount: 10 }));

console.log("is blockChain valid ?", coin.isChainValid());

coin.chain[1].data = { amount: 100 };
coin.chain[1].hash = coin.chain[1].calculateHash();


console.log("is blockChain valid ?", coin.isChainValid());

//console.log(JSON.stringify(coin), null, 4);