"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockStreamHelper = void 0;
var axios_1 = require("axios");
var enums_1 = require("../enums");
var enums_2 = require("./enums");
var BlockStreamHelper = /** @class */ (function () {
    function BlockStreamHelper(network) {
        this.baseUrl =
            network === enums_1.NetworkNamesEnum.MAINNET
                ? enums_2.BlockStreamRoutesEnum.BTC_MAINNET_BASE
                : enums_2.BlockStreamRoutesEnum.BTC_TESTNET_BASE;
    }
    BlockStreamHelper.prototype.getTransaction = function (txid) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1.default.get(this.baseUrl + "/tx/" + txid)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    BlockStreamHelper.prototype.getBlockHashFromBlockHeight = function (blockHeight) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1.default.get(this.baseUrl + "/block-height/" + blockHeight)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    BlockStreamHelper.prototype.getBlockHash = function (block) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(typeof block === "number")) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getBlockHashFromBlockHeight(block)];
                    case 1:
                        _a = _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        _a = block;
                        _b.label = 3;
                    case 3: return [2 /*return*/, _a];
                }
            });
        });
    };
    BlockStreamHelper.prototype.getBlock = function (block) {
        return __awaiter(this, void 0, void 0, function () {
            var blockHash, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getBlockHash(block)];
                    case 1:
                        blockHash = _a.sent();
                        return [4 /*yield*/, axios_1.default.get(this.baseUrl + "/block/" + blockHash)];
                    case 2:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    BlockStreamHelper.prototype.getHashOfLastBlock = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1.default.get(this.baseUrl + "/blocks/tip/hash")];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    BlockStreamHelper.prototype.getHeightOfLastBlock = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1.default.get(this.baseUrl + "/blocks/tip/height")];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    BlockStreamHelper.prototype.getAllTransactionIdsInBlock = function (block) {
        return __awaiter(this, void 0, void 0, function () {
            var blockHash, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getBlockHash(block)];
                    case 1:
                        blockHash = _a.sent();
                        return [4 /*yield*/, axios_1.default.get(this.baseUrl + "/block/" + blockHash + "/txids")];
                    case 2:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /**
     * Gets transactions in block
     * @param block - block hash or block height
     * @param startIndex - start index transaction (start index must be a multipication of 25)
     * @returns the list of transactions
     */
    BlockStreamHelper.prototype.getTransactionsInBlockWithPaging = function (block, startIndex) {
        if (startIndex === void 0) { startIndex = 0; }
        return __awaiter(this, void 0, void 0, function () {
            var blockHash, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getBlockHash(block)];
                    case 1:
                        blockHash = _a.sent();
                        return [4 /*yield*/, axios_1.default.get(this.baseUrl + "/block/" + blockHash + "/txs/" + startIndex)];
                    case 2:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    BlockStreamHelper.prototype.getTransactionsInBlock = function (block) {
        return __awaiter(this, void 0, void 0, function () {
            var txids, transactions, promises, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getAllTransactionIdsInBlock(block)];
                    case 1:
                        txids = _a.sent();
                        transactions = [];
                        promises = [];
                        for (i = 0; i < txids.length; i = i + 25) {
                            promises.push(this.getTransactionsInBlockWithPaging(block, i));
                        }
                        return [4 /*yield*/, Promise.all(promises)];
                    case 2:
                        (_a.sent()).forEach(function (e) {
                            transactions.push.apply(transactions, e);
                        });
                        return [2 /*return*/, transactions];
                }
            });
        });
    };
    BlockStreamHelper.prototype.getTransactions = function (startBlockNumber, endBlockNumber) {
        return __awaiter(this, void 0, void 0, function () {
            var transactions, i, blockHash, arr;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!endBlockNumber) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getHeightOfLastBlock()];
                    case 1:
                        endBlockNumber = _a.sent();
                        _a.label = 2;
                    case 2:
                        if (startBlockNumber > endBlockNumber) {
                            throw new Error("Start block number must be less than end block number");
                        }
                        transactions = [];
                        i = startBlockNumber;
                        _a.label = 3;
                    case 3:
                        if (!(i <= endBlockNumber)) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.getBlockHash(i)];
                    case 4:
                        blockHash = _a.sent();
                        return [4 /*yield*/, this.getTransactionsInBlock(blockHash)];
                    case 5:
                        arr = _a.sent();
                        transactions.push.apply(transactions, arr);
                        _a.label = 6;
                    case 6:
                        i++;
                        return [3 /*break*/, 3];
                    case 7: return [2 /*return*/, {
                            startBlockNumber: startBlockNumber,
                            endBlockNumber: endBlockNumber,
                            transactions: transactions,
                        }];
                }
            });
        });
    };
    BlockStreamHelper.prototype.filterTransactionsByAccount = function (transactions, accountAddress, include) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, transactions.filter(function (tx) {
                        return include === "from"
                            ? tx.vin.find(function (item) { var _a; return ((_a = item.prevout) === null || _a === void 0 ? void 0 : _a.scriptpubkey_address) === accountAddress; })
                            : include === "to"
                                ? tx.vout.find(function (item) { return item.scriptpubkey_address === accountAddress; })
                                : tx.vin.find(function (item) { var _a; return ((_a = item.prevout) === null || _a === void 0 ? void 0 : _a.scriptpubkey_address) === accountAddress; }) ||
                                    tx.vout.find(function (item) { return item.scriptpubkey_address === accountAddress; });
                    })];
            });
        });
    };
    BlockStreamHelper.prototype.filterTransactionsByAccounts = function (transactions, accountAddresses, include) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, transactions.filter(function (tx) {
                        var vinAddresses = tx.vin.map(function (item) { var _a; return (_a = item.prevout) === null || _a === void 0 ? void 0 : _a.scriptpubkey_address; });
                        var voutAddresses = tx.vout.map(function (item) { return item.scriptpubkey_address; });
                        return include === "from"
                            ? vinAddresses.some(function (address) {
                                return accountAddresses.includes(address || "");
                            })
                            : include === "to"
                                ? voutAddresses.some(function (address) {
                                    return accountAddresses.includes(address || "");
                                })
                                : vinAddresses.some(function (address) {
                                    return accountAddresses.includes(address || "");
                                }) ||
                                    voutAddresses.some(function (address) {
                                        return accountAddresses.includes(address || "");
                                    });
                    })];
            });
        });
    };
    BlockStreamHelper.prototype.getTransactionsByAccount = function (accountAddress, options) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, startBlockNumber, endBlockNumber, transactions;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getTransactions(options.startBlockNumber, options.endBlockNumber)];
                    case 1:
                        _a = _b.sent(), startBlockNumber = _a.startBlockNumber, endBlockNumber = _a.endBlockNumber, transactions = _a.transactions;
                        return [2 /*return*/, {
                                startBlockNumber: startBlockNumber,
                                endBlockNumber: endBlockNumber,
                                transactions: this.filterTransactionsByAccount(transactions, accountAddress, options.include),
                            }];
                }
            });
        });
    };
    BlockStreamHelper.prototype.getTransactionsByAccounts = function (accountAddresses, options) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, startBlockNumber, endBlockNumber, transactions;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getTransactions(options.startBlockNumber, options.endBlockNumber)];
                    case 1:
                        _a = _b.sent(), startBlockNumber = _a.startBlockNumber, endBlockNumber = _a.endBlockNumber, transactions = _a.transactions;
                        return [2 /*return*/, {
                                startBlockNumber: startBlockNumber,
                                endBlockNumber: endBlockNumber,
                                transactions: this.filterTransactionsByAccounts(transactions, accountAddresses, options.include),
                            }];
                }
            });
        });
    };
    return BlockStreamHelper;
}());
exports.BlockStreamHelper = BlockStreamHelper;
