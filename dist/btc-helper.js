"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BtcHelper = exports.BTC_ENVIRONMENT = void 0;
var BitGoJS = require("bitgo");
var axios_1 = require("axios");
var WS = require("ws");
var BTC_ENVIRONMENT;
(function (BTC_ENVIRONMENT) {
    BTC_ENVIRONMENT["TEST"] = "test";
    BTC_ENVIRONMENT["PROD"] = "prod";
})(BTC_ENVIRONMENT = exports.BTC_ENVIRONMENT || (exports.BTC_ENVIRONMENT = {}));
var BtcHelper = /** @class */ (function () {
    function BtcHelper(env, accessToken) {
        var _this = this;
        // Create a new wallet
        this.createWallet = function (label, walletPassword) {
            return new Promise(function (done, fail) {
                _this.bitgo
                    .coin(_this.btcCoinName)
                    .wallets()
                    .generateWallet({ passphrase: walletPassword, label: label })
                    .then(done)
                    .catch(fail);
            });
        };
        // Create a new address of a wallet
        this.createAddress = function (walletId, name) {
            return new Promise(function (done, fail) {
                _this.bitgo
                    .coin(_this.btcCoinName)
                    .wallets()
                    .get({ id: walletId })
                    .then(function (wallet) { return wallet.createAddress({ label: name }); })
                    .then(done)
                    .catch(fail);
            });
        };
        // List all addresses of a wallet
        this.listAddress = function (walletId) {
            return new Promise(function (done, fail) {
                _this.bitgo
                    .coin(_this.btcCoinName)
                    .wallets()
                    .get({ id: walletId })
                    .then(function (wallet) { return wallet.addresses(); })
                    .then(done)
                    .catch(fail);
            });
        };
        // Get address (not wallet) balance
        this.getBalance = function (addr, options) {
            if (options === void 0) { options = {
                receiveOnly: false,
            }; }
            return new Promise(function (done, fail) {
                axios_1.default
                    .get(_this.smartBitApi + "/blockchain/address/" + addr)
                    .then(function (res) { return res.data; })
                    .then(function (res) {
                    var success = res.success, address = res.address;
                    if (!success) {
                        // TODO: test this case
                        console.log(res);
                        return fail("Cannot get balance of " + addr);
                    }
                    var _a = address.confirmed, received_int = _a.received_int, balance_int = _a.balance_int;
                    var balance = options.receiveOnly ? received_int : balance_int;
                    var transactions = [];
                    if (options.includeTransaction) {
                        transactions = address.transactions || [];
                        if (options.receiveOnly) {
                            transactions = transactions.filter(function (tx) {
                                return tx.outputs.find(function (output) { return output.addresses.includes(addr); });
                            });
                        }
                    }
                    return done({
                        balance: balance,
                        transactions: transactions,
                    });
                })
                    .catch(fail);
            });
        };
        this.getTransaction = function (txhash) {
            return new Promise(function (done, fail) {
                axios_1.default
                    .get(_this.smartBitApi + "/blockchain/tx/" + txhash)
                    .then(function (res) { return res.data; })
                    .then(function (res) {
                    var success = res.success, transaction = res.transaction;
                    if (!success) {
                        console.log("Get transaction info error");
                        return fail(res);
                    }
                    if (transaction.block) {
                        done(transaction);
                    }
                    else {
                        done(null);
                    }
                })
                    .catch(fail);
            });
        };
        this.sendBitcoin = function (params) {
            return new Promise(function (done, fail) {
                console.log("sendBitcoin", JSON.stringify(params));
                var fromWallet = params.fromWallet, walletPassphrase = params.walletPassphrase, toAddress = params.toAddress, amountSatoshi = params.amountSatoshi, wait = params.wait, timeout = params.timeout;
                _this.bitgo
                    .coin(_this.btcCoinName)
                    .wallets()
                    .get({ id: fromWallet })
                    .then(function (wallet) {
                    wallet.send({
                        address: toAddress,
                        amount: amountSatoshi,
                        walletPassphrase: walletPassphrase,
                    }, function (err, result) {
                        if (err) {
                            return fail(err);
                        }
                        var status = result.status, txid = result.txid;
                        console.log("Submit transaction", status, txid);
                        if (status !== "signed") {
                            // TODO: test this case
                            console.log("Sending bitcoin seems to be error");
                            return fail(result);
                        }
                        if (!wait) {
                            done(txid);
                        }
                        else {
                            console.log("Setup websocket to wait transaction result");
                            var wsMessage_1 = { type: "transaction", txid: txid };
                            var ws_1 = new WS(_this.smartBitWs);
                            // Setup timer if timeout param specified
                            var timer_1 = timeout
                                ? setTimeout(function () {
                                    ws_1.send(JSON.stringify(__assign(__assign({}, wsMessage_1), { unsubscribe: true })));
                                    ws_1.close();
                                }, timeout)
                                : undefined;
                            // Waiting for message
                            ws_1.on("message", function (data) {
                                console.log("message", data);
                                var result = JSON.parse(data);
                                if (result.type === "transaction") {
                                    if (timer_1) {
                                        clearTimeout(timer_1);
                                    }
                                    ws_1.send(JSON.stringify(__assign(__assign({}, wsMessage_1), { unsubscribe: true })));
                                    ws_1.close();
                                    done(txid);
                                }
                            });
                            // Only send subcription request after connection opened
                            ws_1.on("open", function () {
                                ws_1.send(JSON.stringify(wsMessage_1));
                            });
                        }
                    });
                });
            });
        };
        this.bitgo = new BitGoJS.BitGo({ env: env, accessToken: accessToken });
        if (env === BTC_ENVIRONMENT.TEST) {
            this.smartBitApi = "https://testnet-api.smartbit.com.au/v1";
            this.smartBitWs = "wss://testnet-ws.smartbit.com.au/v1/blockchain";
            this.btcCoinName = "tbtc";
        }
        else {
            this.smartBitApi = "https://api.smartbit.com.au/v1";
            this.smartBitWs = "wss://ws.smartbit.com.au/v1/blockchain";
            this.btcCoinName = "btc";
        }
    }
    return BtcHelper;
}());
exports.BtcHelper = BtcHelper;
