import { BlockStreamHelper } from "../";
import { NetworkNamesEnum } from "../../enums";

describe("BlockStream API", () => {
  let blockStreamHelper = new BlockStreamHelper(NetworkNamesEnum.TESTNET);

  test("getTransaction", async () => {
    const tx = await blockStreamHelper.getTransaction(
      "755c106a0cf0c75f7ce62ba4ca94cfef5e45a7d01b20f517b9e2c50062eb56c8"
    );
    expect(tx).toBeDefined();
    expect(tx.txid).toEqual(
      "755c106a0cf0c75f7ce62ba4ca94cfef5e45a7d01b20f517b9e2c50062eb56c8"
    );
    expect(tx.version).toEqual(1);
  });

  test("getBlockHashFromBlockHeight", async () => {
    const blockHash = await blockStreamHelper.getBlockHashFromBlockHeight(
      1832696
    );
    expect(blockHash).toEqual(
      "000000000000013ccdf0f5424b757ec0703a323f063cbe39260c58936098eb0b"
    );
  });

  describe("getBlock", () => {
    test("block height as parameter", async () => {
      const block = await blockStreamHelper.getBlock(1832696);
      expect(block.id).toEqual(
        "000000000000013ccdf0f5424b757ec0703a323f063cbe39260c58936098eb0b"
      );
    });

    test("block hash as parameter", async () => {
      const block = await blockStreamHelper.getBlock(
        "000000000000013ccdf0f5424b757ec0703a323f063cbe39260c58936098eb0b"
      );
      expect(block.id).toEqual(
        "000000000000013ccdf0f5424b757ec0703a323f063cbe39260c58936098eb0b"
      );
    });
  });

  test("getLatestBlock", async () => {
    const blockHash = await blockStreamHelper.getLatestBlock();
    expect(blockHash).toBeDefined();
  });

  test("getAllTransactionIdsInBlock", async () => {
    const txids = await blockStreamHelper.getAllTransactionIdsInBlock(
      "000000000000013ccdf0f5424b757ec0703a323f063cbe39260c58936098eb0b"
    );
    expect(txids).toBeDefined();
    expect(txids.length).toBeGreaterThan(0);
  });

  test("getAllTransactionsInBlock", async () => {
    const transactions = await blockStreamHelper.getAllTransactionsInBlock(
      "000000000000013ccdf0f5424b757ec0703a323f063cbe39260c58936098eb0b"
    );
    const txids = await blockStreamHelper.getAllTransactionIdsInBlock(
      "000000000000013ccdf0f5424b757ec0703a323f063cbe39260c58936098eb0b"
    );
    expect(transactions).toBeDefined();
    expect(transactions.length).toEqual(txids.length);
  });
});
