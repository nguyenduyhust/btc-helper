import {
  BitGo,
  WalletWithKeychains,
  Wallet,
  CreateAddressOptions,
  SendOptions,
} from "bitgo";

import { NetworkNamesEnum } from "../enums";
import { AddressInfo } from "./interfaces";

export class BitgoHelper {
  private bitgo: BitGo;
  private coinName: string;

  constructor(network: NetworkNamesEnum, accessToken: string) {
    this.bitgo = new BitGo({
      env: network === NetworkNamesEnum.MAINNET ? "prod" : "test",
      accessToken,
    });
    this.coinName = network === NetworkNamesEnum.MAINNET ? "btc" : "tbtc";
  }

  public getWallet(walletId: string): Promise<Wallet> {
    return this.bitgo.coin(this.coinName).wallets().get({ id: walletId });
  }

  // Create a new wallet
  public async createWallet(
    label: string,
    passphrase: string
  ): Promise<WalletWithKeychains> {
    return this.bitgo.coin(this.coinName).wallets().generateWallet({
      label,
      passphrase,
    });
  }

  public async createAddress(
    walletId: string,
    options?: CreateAddressOptions
  ): Promise<AddressInfo> {
    return (await this.getWallet(walletId)).createAddress(options);
  }

  public async getAddresses(walletId: string): Promise<Array<AddressInfo>> {
    return (await this.getWallet(walletId)).addresses();
  }

  // public async send(walletId: string, options: SendOptions) {
  //   const wallet = await this.getWallet(walletId);
  //   return wallet.send(options);
  // }
}
