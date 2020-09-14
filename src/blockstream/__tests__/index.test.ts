import { BlockStreamHelper } from "../";
import { NetworkNamesEnum } from "../../enums";

const TRANSACTION_HASH = process.env.TRANSACTION_HASH || "";
const BLOCK_HASH = process.env.BLOCK_HASH || "";

describe("BlockStream API", () => {
  let blockStreamHelper = new BlockStreamHelper(NetworkNamesEnum.TESTNET);

  test("getTransaction", async () => {
    const tx = await blockStreamHelper.getTransaction(TRANSACTION_HASH);
    expect(tx).toBeDefined();
    expect(tx.txid).toEqual(TRANSACTION_HASH);
    expect(tx.version).toEqual(1);
  });

  test("getBlockHashFromBlockHeight", async () => {
    const blockHash = await blockStreamHelper.getBlockHashFromBlockHeight(
      1832696
    );
    expect(blockHash).toEqual(BLOCK_HASH);
  });

  describe("getBlock", () => {
    test("block height as parameter", async () => {
      const block = await blockStreamHelper.getBlock(1832696);
      expect(block.id).toEqual(BLOCK_HASH);
    });

    test("block hash as parameter", async () => {
      const block = await blockStreamHelper.getBlock(BLOCK_HASH);
      expect(block.id).toEqual(BLOCK_HASH);
    });
  });

  test("getHashOfLastBlock", async () => {
    const blockHash = await blockStreamHelper.getHashOfLastBlock();
    expect(blockHash).toBeDefined();
    expect(typeof blockHash).toEqual("string");
  });

  test("getHeightOfLastBlock", async () => {
    const blockHeight = await blockStreamHelper.getHeightOfLastBlock();
    expect(blockHeight).toBeDefined();
    expect(typeof blockHeight).toEqual("number");
  });

  test("getAllTransactionIdsInBlock", async () => {
    const txids = await blockStreamHelper.getAllTransactionIdsInBlock(
      BLOCK_HASH
    );
    expect(txids).toBeDefined();
    expect(txids.length).toBeGreaterThan(0);
  });

  test("getTransactionsInBlock", async () => {
    const transactions = await blockStreamHelper.getTransactionsInBlock(
      BLOCK_HASH
    );
    const txids = await blockStreamHelper.getAllTransactionIdsInBlock(
      BLOCK_HASH
    );
    expect(transactions).toBeDefined();
    expect(transactions.length).toEqual(txids.length);
  });

  test.skip(
    "getTransactions",
    async () => {
      const {
        startBlockNumber,
        endBlockNumber,
        transactions,
      } = await blockStreamHelper.getTransactions(1834400);
      expect(startBlockNumber).toEqual(1834400);
      expect(endBlockNumber).toBeDefined();
      expect(transactions).toBeDefined();
    },
    60 * 1000
  );

  test.skip(
    "getTransactionsByAccount",
    async () => {
      const {
        startBlockNumber,
        endBlockNumber,
        transactions,
      } = await blockStreamHelper.getTransactionsByAccount(
        "2N6JbYee7owxF9H4J4pQ3BENK63PijhYgoF",
        {
          startBlockNumber: 1833132,
          endBlockNumber: 1833140,
          include: "to",
        }
      );
      expect(startBlockNumber).toEqual(1833132);
      expect(endBlockNumber).toBeDefined();
      expect(transactions).toBeDefined();
    },
    60 * 60 * 1000
  );

  test.skip(
    "getTransactionsByAccount",
    async () => {
      const {
        startBlockNumber,
        endBlockNumber,
        transactions,
      } = await blockStreamHelper.getTransactionsByAccounts(
        [
          "2N6JbYee7owxF9H4J4pQ3BENK63PijhYgoF",
          "2N5CLghtRyxrJ3UVf9FPcMN46qkmL9abgYZ",
        ],
        {
          startBlockNumber: 1833132,
          endBlockNumber: 1833140,
          include: "both",
        }
      );
      console.log("transactions: ", JSON.stringify(transactions));
      expect(startBlockNumber).toEqual(1833132);
      expect(endBlockNumber).toBeDefined();
      expect(transactions).toBeDefined();
    },
    60 * 60 * 1000
  );
});
