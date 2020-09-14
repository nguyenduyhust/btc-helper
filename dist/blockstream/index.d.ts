import { NetworkNamesEnum } from "../enums";
import { Block, Transaction } from "./interfaces";
export declare class BlockStreamHelper {
    private baseUrl;
    constructor(network: NetworkNamesEnum);
    getTransaction(txid: string): Promise<Transaction>;
    getBlockHashFromBlockHeight(blockHeight: number): Promise<string>;
    private getBlockHash;
    getBlock(block: string | number): Promise<Block>;
    getHashOfLastBlock(): Promise<string>;
    getHeightOfLastBlock(): Promise<number>;
    getAllTransactionIdsInBlock(block: string | number): Promise<Array<string>>;
    /**
     * Gets transactions in block
     * @param block - block hash or block height
     * @param startIndex - start index transaction (start index must be a multipication of 25)
     * @returns the list of transactions
     */
    getTransactionsInBlockWithPaging(block: string | number, startIndex?: number): Promise<Transaction[]>;
    getTransactionsInBlock(block: string | number): Promise<Transaction[]>;
    getTransactions(startBlockNumber: number, endBlockNumber?: number): Promise<{
        startBlockNumber: number;
        endBlockNumber: number;
        transactions: Transaction[];
    }>;
    filterTransactionsByAccount(transactions: Array<Transaction>, accountAddress: string, include?: "from" | "to" | "both"): Promise<Transaction[]>;
    filterTransactionsByAccounts(transactions: Array<Transaction>, accountAddresses: Array<string>, include?: "from" | "to" | "both"): Promise<Transaction[]>;
    getTransactionsByAccount(accountAddress: string, options: {
        startBlockNumber: number;
        endBlockNumber?: number;
        include?: "from" | "to" | "both";
    }): Promise<{
        startBlockNumber: number;
        endBlockNumber: number;
        transactions: Promise<Transaction[]>;
    }>;
    getTransactionsByAccounts(accountAddresses: Array<string>, options: {
        startBlockNumber: number;
        endBlockNumber?: number;
        include?: "from" | "to" | "both";
    }): Promise<{
        startBlockNumber: number;
        endBlockNumber: number;
        transactions: Promise<Transaction[]>;
    }>;
}
