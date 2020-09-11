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

  public async getLatestBlock(): Promise<string> {
    const response = await axios.get<string>(`${this.baseUrl}/blocks/tip/hash`);
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
  public async getTransactionsInBlock(
    block: string | number,
    startIndex: number = 0
  ) {
    const blockHash = await this.getBlockHash(block);
    const response = await axios.get<Array<Transaction>>(
      `${this.baseUrl}/block/${blockHash}/txs/${startIndex}`
    );
    return response.data;
  }

  public async getAllTransactionsInBlock(block: string | number) {
    const txids = await this.getAllTransactionIdsInBlock(block);
    const transactions: Array<Transaction> = [];
    const promises = [];
    for (let i = 0; i <= txids.length; i = i + 25) {
      promises.push(this.getTransactionsInBlock(block, i));
    }
    (await Promise.all(promises)).forEach((e) => {
      transactions.push(...e);
    });
    return transactions;
  }
}
