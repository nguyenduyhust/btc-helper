import { WalletWithKeychains, Wallet, CreateAddressOptions } from "bitgo";
import { NetworkNamesEnum } from "../enums";
import { AddressInfo } from "./interfaces";
export declare class BitgoHelper {
    private bitgo;
    private coinName;
    constructor(network: NetworkNamesEnum, accessToken: string);
    getWallet(walletId: string): Promise<Wallet>;
    createWallet(label: string, passphrase: string): Promise<WalletWithKeychains>;
    createAddress(walletId: string, options?: CreateAddressOptions): Promise<AddressInfo>;
    getAddresses(walletId: string): Promise<Array<AddressInfo>>;
}
