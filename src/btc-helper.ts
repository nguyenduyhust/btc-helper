const BitGoJS = require("bitgo");
import axios from "axios";
const WS = require("ws");

export enum BTC_ENVIRONMENT {
  TEST = "test",
  PROD = "prod",
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

export class BtcHelper {
  private bitgo: any;
  private smartBitApi: string;
  private smartBitWs: string;
  private btcCoinName: string;
  constructor(env: BTC_ENVIRONMENT, accessToken: string) {
    this.bitgo = new BitGoJS.BitGo({ env, accessToken });
    if (env === BTC_ENVIRONMENT.TEST) {
      this.smartBitApi = "https://testnet-api.smartbit.com.au/v1";
      this.smartBitWs = "wss://testnet-ws.smartbit.com.au/v1/blockchain";
      this.btcCoinName = "tbtc";
    } else {
      this.smartBitApi = "https://api.smartbit.com.au/v1";
      this.smartBitWs = "wss://ws.smartbit.com.au/v1/blockchain";
      this.btcCoinName = "btc";
    }
  }

  // Create a new wallet
  public createWallet = (label: string, walletPassword: string) =>
    new Promise<{
      wallet: { _wallet: { id: string } };
    }>((done, fail) => {
      this.bitgo
        .coin(this.btcCoinName)
        .wallets()
        .generateWallet({ passphrase: walletPassword, label: label })
        .then(done)
        .catch(fail);
    });

  // Create a new address of a wallet
  public createAddress = (walletId: string, name: string) =>
    new Promise<AddressInfo>((done, fail) => {
      this.bitgo
        .coin(this.btcCoinName)
        .wallets()
        .get({ id: walletId })
        .then((wallet: any) => wallet.createAddress({ label: name }))
        .then(done)
        .catch(fail);
    });

  // List all addresses of a wallet
  public listAddress = (walletId: string) =>
    new Promise<{ addresses: AddressInfo[] }>((done, fail) => {
      this.bitgo
        .coin(this.btcCoinName)
        .wallets()
        .get({ id: walletId })
        .then((wallet: any) => wallet.addresses())
        .then(done)
        .catch(fail);
    });

  // Get address (not wallet) balance
  public getBalance = (
    addr: string,
    options: { receiveOnly?: boolean; includeTransaction?: boolean } = {
      receiveOnly: false,
    }
  ) =>
    new Promise<{
      balance: number;
      transactions: TransactionInfo[];
    }>((done, fail) => {
      axios
        .get(`${this.smartBitApi}/blockchain/address/${addr}`)
        .then((res) => res.data)
        .then((res: { success: boolean; address: BalanceInfo }) => {
          const { success, address } = res;
          if (!success) {
            // TODO: test this case
            console.log(res);
            return fail("Cannot get balance of " + addr);
          }

          const { received_int, balance_int } = address.confirmed;
          const balance = options.receiveOnly ? received_int : balance_int;
          let transactions: TransactionInfo[] = [];
          if (options.includeTransaction) {
            transactions = address.transactions || [];
            if (options.receiveOnly) {
              transactions = transactions.filter((tx) =>
                tx.outputs.find((output) => output.addresses.includes(addr))
              );
            }
          }
          return done({
            balance,
            transactions,
          });
        })
        .catch(fail);
    });

  public getTransaction = (txhash: string) =>
    new Promise((done, fail) => {
      axios
        .get(`${this.smartBitApi}/blockchain/tx/${txhash}`)
        .then((res) => res.data)
        .then((res) => {
          const { success, transaction } = res;
          if (!success) {
            console.log("Get transaction info error");
            return fail(res);
          }
          if (transaction.block) {
            done(transaction);
          } else {
            done(null);
          }
        })
        .catch(fail);
    });

  public sendBitcoin = (params: {
    fromWallet: string;
    walletPassphrase: string;
    toAddress: string;
    amountSatoshi: number;
    wait?: boolean;
    timeout?: number;
  }) =>
    new Promise<string>((done, fail) => {
      console.log("sendBitcoin", JSON.stringify(params));
      const {
        fromWallet,
        walletPassphrase,
        toAddress,
        amountSatoshi,
        wait,
        timeout,
      } = params;
      this.bitgo
        .coin(this.btcCoinName)
        .wallets()
        .get({ id: fromWallet })
        .then((wallet: any) => {
          wallet.send(
            {
              address: toAddress,
              amount: amountSatoshi,
              walletPassphrase: walletPassphrase,
            },
            (err: Error, result: any) => {
              if (err) {
                return fail(err);
              }
              const { status, txid } = result;
              console.log("Submit transaction", status, txid);
              if (status !== "signed") {
                // TODO: test this case
                console.log("Sending bitcoin seems to be error");
                return fail(result);
              }
              if (!wait) {
                done(txid);
              } else {
                console.log("Setup websocket to wait transaction result");
                const wsMessage = { type: "transaction", txid: txid };
                const ws = new WS(this.smartBitWs);

                // Setup timer if timeout param specified
                const timer = timeout
                  ? setTimeout(() => {
                      ws.send(
                        JSON.stringify({ ...wsMessage, unsubscribe: true })
                      );
                      ws.close();
                    }, timeout)
                  : undefined;

                // Waiting for message
                ws.on("message", (data: any) => {
                  console.log("message", data);
                  const result = JSON.parse(data);
                  if (result.type === "transaction") {
                    if (timer) {
                      clearTimeout(timer);
                    }
                    ws.send(
                      JSON.stringify({ ...wsMessage, unsubscribe: true })
                    );
                    ws.close();
                    done(txid);
                  }
                });

                // Only send subcription request after connection opened
                ws.on("open", () => {
                  ws.send(JSON.stringify(wsMessage));
                });
              }
            }
          );
        });
    });
}
