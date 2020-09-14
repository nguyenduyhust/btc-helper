import axios from "axios";

import { NetworkNamesEnum } from "../enums";
import { BlockStreamRoutesEnum } from "./enums";
import { Block, Transaction } from "./interfaces";

export class BlockStreamHelper {
  private baseUrl: BlockStreamRoutesEnum;

  constructor(network: NetworkNamesEnum) {
    this.baseUrl =
      network === NetworkNamesEnum.MAINNET
        ? BlockStreamRoutesEnum.BTC_MAINNET_BASE
        : BlockStreamRoutesEnum.BTC_TESTNET_BASE;
  }

  public async getTransaction(txid: string): Promise<Transaction> {
    const response = await axios.get<Transaction>(`${this.baseUrl}/tx/${txid}`);
    return response.data;
  }

  public async getBlockHashFromBlockHeight(
    blockHeight: number
  ): Promise<string> {
    const response = await axios.get<string>(
      `${this.baseUrl}/block-height/${blockHeight}`
    );
    return response.data;
  }

  private async getBlockHash(block: string | number): Promise<string> {
    return typeof block === "number"
      ? await this.getBlockHashFromBlockHeight(block)
      : block;
  }

  public async getBlock(block: string | number): Promise<Block> {
    const blockHash = await this.getBlockHash(block);
    const response = await axios.get<Block>(
      `${this.baseUrl}/block/${blockHash}`
    );
    return response.data;
  }

  public async getHashOfLastBlock(): Promise<string> {
    const response = await axios.get<string>(`${this.baseUrl}/blocks/tip/hash`);
    return response.data;
  }

  public async getHeightOfLastBlock(): Promise<number> {
    const response = await axios.get<number>(
      `${this.baseUrl}/blocks/tip/height`
    );
    return response.data;
  }

  public async getAllTransactionIdsInBlock(
    block: string | number
  ): Promise<Array<string>> {
    const blockHash = await this.getBlockHash(block);
    const response = await axios.get<Array<string>>(
      `${this.baseUrl}/block/${blockHash}/txids`
    );
    return response.data;
  }

  /**
   * Gets transactions in block
   * @param block - block hash or block height
   * @param startIndex - start index transaction (start index must be a multipication of 25)
   * @returns the list of transactions
   */
  public async getTransactionsInBlockWithPaging(
    block: string | number,
    startIndex: number = 0
  ) {
    const blockHash = await this.getBlockHash(block);
    const response = await axios.get<Array<Transaction>>(
      `${this.baseUrl}/block/${blockHash}/txs/${startIndex}`
    );
    return response.data;
  }

  public async getTransactionsInBlock(block: string | number) {
    const txids = await this.getAllTransactionIdsInBlock(block);
    const transactions: Array<Transaction> = [];
    const promises: Array<Promise<Array<Transaction>>> = [];
    for (let i = 0; i < txids.length; i = i + 25) {
      promises.push(this.getTransactionsInBlockWithPaging(block, i));
    }
    (await Promise.all(promises)).forEach((e) => {
      transactions.push(...e);
    });
    return transactions;
  }

  public async getTransactions(
    startBlockNumber: number,
    endBlockNumber?: number
  ) {
    if (!endBlockNumber) {
      endBlockNumber = await this.getHeightOfLastBlock();
    }
    if (startBlockNumber > endBlockNumber) {
      throw new Error("Start block number must be less than end block number");
    }
    const transactions: Transaction[] = [];
    for (let i = startBlockNumber; i <= endBlockNumber; i++) {
      const blockHash = await this.getBlockHash(i);
      const arr = await this.getTransactionsInBlock(blockHash);
      transactions.push(...arr);
    }
    return {
      startBlockNumber,
      endBlockNumber,
      transactions,
    };
  }

  public async filterTransactionsByAccount(
    transactions: Array<Transaction>,
    accountAddress: string,
    include?: "from" | "to" | "both"
  ) {
    return transactions.filter((tx: Transaction) =>
      include === "from"
        ? tx.vin.find(
            (item) => item.prevout?.scriptpubkey_address === accountAddress
          )
        : include === "to"
        ? tx.vout.find((item) => item.scriptpubkey_address === accountAddress)
        : tx.vin.find(
            (item) => item.prevout?.scriptpubkey_address === accountAddress
          ) ||
          tx.vout.find((item) => item.scriptpubkey_address === accountAddress)
    );
  }

  public async filterTransactionsByAccounts(
    transactions: Array<Transaction>,
    accountAddresses: Array<string>,
    include?: "from" | "to" | "both"
  ) {
    return transactions.filter((tx: Transaction) => {
      const vinAddresses = tx.vin.map(
        (item) => item.prevout?.scriptpubkey_address
      );
      const voutAddresses = tx.vout.map((item) => item.scriptpubkey_address);
      return include === "from"
        ? vinAddresses.some((address) =>
            accountAddresses.includes(address || "")
          )
        : include === "to"
        ? voutAddresses.some((address) =>
            accountAddresses.includes(address || "")
          )
        : vinAddresses.some((address) =>
            accountAddresses.includes(address || "")
          ) ||
          voutAddresses.some((address) =>
            accountAddresses.includes(address || "")
          );
    });
  }

  public async getTransactionsByAccount(
    accountAddress: string,
    options: {
      startBlockNumber: number;
      endBlockNumber?: number;
      include?: "from" | "to" | "both";
    }
  ) {
    const {
      startBlockNumber,
      endBlockNumber,
      transactions,
    } = await this.getTransactions(
      options.startBlockNumber,
      options.endBlockNumber
    );
    return {
      startBlockNumber,
      endBlockNumber,
      transactions: this.filterTransactionsByAccount(
        transactions,
        accountAddress,
        options.include
      ),
    };
  }

  public async getTransactionsByAccounts(
    accountAddresses: Array<string>,
    options: {
      startBlockNumber: number;
      endBlockNumber?: number;
      include?: "from" | "to" | "both";
    }
  ) {
    const {
      startBlockNumber,
      endBlockNumber,
      transactions,
    } = await this.getTransactions(
      options.startBlockNumber,
      options.endBlockNumber
    );
    return {
      startBlockNumber,
      endBlockNumber,
      transactions: this.filterTransactionsByAccounts(
        transactions,
        accountAddresses,
        options.include
      ),
    };
  }
}
