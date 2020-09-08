export declare enum BTC_ENVIRONMENT {
    TEST = "test",
    PROD = "prod"
}
export interface TransactionInfo {
    txid: string;
    hash: string;
    input_amount: string;
    input_amount_int: number;
    output_amount: string;
    output_amount_int: number;
    fee: string;
    fee_int: number;
    inputs: VinVout[];
    outputs: VinVout[];
}
export interface VinVout {
    addresses: string[];
    value: string;
    value_int: number;
}
export interface BalanceInfo {
    address: string;
    confirmed: {
        received: string;
        received_int: number;
        spent: string;
        spent_int: number;
        balance: string;
        balance_int: number;
    };
    transactions: TransactionInfo[];
}
export interface AddressInfo {
    id: string;
    address: string;
    wallet: string;
}
export declare class BtcHelper {
    private bitgo;
    private smartBitApi;
    private smartBitWs;
    private btcCoinName;
    constructor(env: BTC_ENVIRONMENT, accessToken: string);
    createWallet: (label: string, walletPassword: string) => Promise<{
        wallet: {
            _wallet: {
                id: string;
            };
        };
    }>;
    createAddress: (walletId: string, name: string) => Promise<AddressInfo>;
    listAddress: (walletId: string) => Promise<{
        addresses: AddressInfo[];
    }>;
    getBalance: (addr: string, options?: {
        receiveOnly?: boolean;
        includeTransaction?: boolean;
    }) => Promise<{
        balance: number;
        transactions: TransactionInfo[];
    }>;
    getTransaction: (txhash: string) => Promise<unknown>;
    sendBitcoin: (params: {
        fromWallet: string;
        walletPassphrase: string;
        toAddress: string;
        amountSatoshi: number;
        wait?: boolean;
        timeout?: number;
    }) => Promise<string>;
}
