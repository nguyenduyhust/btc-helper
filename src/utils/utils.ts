import { Validation } from "bitcoin-address-validation";
var validateBtcAddress = require("bitcoin-address-validation");

export class BtcUtils {
  public static validateAddress(address: string): boolean;
  public static validateAddress(address: string, detail: false): boolean;
  public static validateAddress(
    address: string,
    detail: true
  ): Validation | false;
  public static validateAddress(address: string, detail = false) {
    const validation = validateBtcAddress(address);
    return detail ? validation : Boolean(validation);
  }
}
