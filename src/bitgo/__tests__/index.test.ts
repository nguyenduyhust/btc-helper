import { BitgoHelper } from "../";
import { NetworkNamesEnum } from "../../enums";

const BITGO_ACCESS_TOKEN = process.env.BITGO_ACCESS_TOKEN || "";
const WALLET_TEST_ID = process.env.WALLET_TEST_ID || "";

describe.only("Bitgo API", () => {
  const bitgoHelper = new BitgoHelper(
    NetworkNamesEnum.TESTNET,
    BITGO_ACCESS_TOKEN
  );

  test("getWallet", async () => {
    const wallet = await bitgoHelper.getWallet(WALLET_TEST_ID);
    expect(wallet).toBeDefined();
    expect(wallet.label()).toEqual("Test");
  });

  test.skip("createWallet", async () => {
    const label = "Create Wallet Test Label";
    const walletPw = "Test@!23";
    const walletWithKeychains = await bitgoHelper.createWallet(label, walletPw);
    expect(walletWithKeychains).toBeDefined();
    expect(walletWithKeychains.wallet).toBeDefined();
    expect(walletWithKeychains.wallet.label()).toEqual(label);
  });

  test.skip("createAddress", async () => {
    const label = "Address test";
    const addressInfo = await bitgoHelper.createAddress(WALLET_TEST_ID, {
      label,
    });
    expect(addressInfo).toBeDefined();
    expect(addressInfo.label).toEqual(label);
  });

  test("getAddresses", async () => {
    const addressesInfo = await bitgoHelper.getAddresses(WALLET_TEST_ID);
    expect(addressesInfo).toBeDefined();
  });

  // test.only(
  //   "getAddresses",
  //   async () => {
  //     const result = await bitgoHelper.send(WALLET_TEST_ID, {
  //       address: "2MwBiURiTojxRxnV6KjjddTSCT7SkENP8hv",
  //       amount: 500000,
  //       walletPassphrase: "TPCr7AHpc886nT6",
  //     });
  //     console.log(result);
  //     expect(result).toBeDefined();
  //   },
  //   10 * 60 * 1000
  // );
});
