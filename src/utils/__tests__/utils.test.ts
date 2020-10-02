import { BtcUtils } from "../";

describe("BtcUtils", () => {
  describe("validateAddress", () => {
    test("Success", () => {
      const result = BtcUtils.validateAddress(
        "2N9mHs7szZMVCiTMKgSvjwBQsrt6R7n3Zaz"
      );
      expect(result).toBeTruthy();
    });

    test("Success - Detail", () => {
      const result = BtcUtils.validateAddress(
        "2N9mHs7szZMVCiTMKgSvjwBQsrt6R7n3Zaz",
        true
      );
      expect(result).toBeDefined();
      if (result) {
        expect(result.address).toEqual("2N9mHs7szZMVCiTMKgSvjwBQsrt6R7n3Zaz");
        expect(result.bech32).toEqual(false);
        expect(result.type).toEqual("p2sh");
        expect(result.network).toEqual("testnet");
      }
    });

    test("Fail", () => {
      const result = BtcUtils.validateAddress(
        "2N9mHs7szZMVCiTMKgSvjwBQsrt6R7n3ZazZ"
      );
      expect(result).not.toBeTruthy();
    });
  });
});
