"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EIP1193JsonRpcClient = void 0;
const errors_1 = require("../../errors");
const errors_list_1 = require("../errors-list");
const jsonrpc_1 = require("./types/jsonrpc");
const address_1 = require("./utils/address");
const DEFAULT_MAX_PRIORITY_FEE_PER_GAS = 1000000000n;
/**
 * A JsonRpcClient that uses an EIP-1193 provider to make the calls.
 */
class EIP1193JsonRpcClient {
    _provider;
    _config;
    constructor(_provider, _config) {
        this._provider = _provider;
        this._config = _config;
    }
    async getChainId() {
        const response = await this._provider.request({
            method: "eth_chainId",
            params: [],
        });
        assertResponseType("eth_chainId", response, typeof response === "string");
        return jsonRpcQuantityToNumber(response);
    }
    async getNetworkFees() {
        const fees = await this._getNetworkFees();
        const maxFees = "gasPrice" in fees ? fees.gasPrice : fees.maxFeePerGas;
        if (this._config?.maxFeePerGasLimit !== undefined &&
            maxFees > this._config.maxFeePerGasLimit) {
            throw new errors_1.IgnitionError(errors_list_1.ERRORS.EXECUTION.MAX_FEE_PER_GAS_EXCEEDS_GAS_LIMIT);
        }
        return fees;
    }
    async getLatestBlock() {
        const response = await this._provider.request({
            method: "eth_getBlockByNumber",
            params: ["latest", false],
        });
        assertResponseType("eth_getBlockByNumber", response, typeof response === "object" && response !== null);
        assertResponseType("eth_getBlockByNumber", response, "number" in response && typeof response.number === "string");
        assertResponseType("eth_getBlockByNumber", response, "hash" in response && typeof response.hash === "string");
        let baseFeePerGas;
        if ("baseFeePerGas" in response) {
            assertResponseType("eth_getBlockByNumber", response, typeof response.baseFeePerGas === "string");
            baseFeePerGas = jsonRpcQuantityToBigInt(response.baseFeePerGas);
        }
        return {
            number: jsonRpcQuantityToNumber(response.number),
            hash: response.hash,
            baseFeePerGas,
        };
    }
    async getBalance(address, blockTag) {
        const balance = await this._provider.request({
            method: "eth_getBalance",
            params: [address, blockTag],
        });
        assertResponseType("eth_getBalance", balance, typeof balance === "string");
        return jsonRpcQuantityToBigInt(balance);
    }
    async setBalance(address, balance) {
        const balanceHex = bigIntToJsonRpcQuantity(balance);
        const returnedBalance = await this._provider.request({
            method: "hardhat_setBalance",
            params: [address, balanceHex],
        });
        // anvil supports this method, but returns `null` instead of a boolean
        if (returnedBalance === null) {
            return true;
        }
        assertResponseType("hardhat_setBalance", returnedBalance, typeof returnedBalance === "boolean");
        return returnedBalance;
    }
    async call(callParams, blockTag) {
        try {
            const jsonRpcEncodedParams = {
                to: callParams.to,
                value: bigIntToJsonRpcQuantity(callParams.value),
                data: callParams.data,
                from: callParams.from,
                nonce: callParams.nonce !== undefined
                    ? numberToJsonRpcQuantity(callParams.nonce)
                    : undefined,
                gas: callParams.gasLimit !== undefined
                    ? bigIntToJsonRpcQuantity(callParams.gasLimit)
                    : undefined,
                ...jsonRpcEncodeNetworkFees(callParams.fees),
            };
            const response = await this._provider.request({
                method: "eth_call",
                params: [jsonRpcEncodedParams, blockTag],
            });
            assertResponseType("eth_call", response, typeof response === "string");
            return {
                success: true,
                returnData: response,
                customErrorReported: false,
            };
        }
        catch (error) {
            if (error instanceof Error) {
                const errorWithData = error;
                const data = typeof errorWithData.data === "string"
                    ? errorWithData.data
                    : errorWithData.data?.data;
                if (data !== undefined) {
                    return {
                        success: false,
                        returnData: data,
                        customErrorReported: isCustomErrorError(error),
                    };
                }
                // Geth, and potentially other nodes, may return an error without a data
                // field if there was no reason returned
                if (error.message.includes("execution reverted") ||
                    error.message.includes("invalid opcode")) {
                    return {
                        success: false,
                        returnData: "0x",
                        customErrorReported: false,
                    };
                }
                // Catch all for other nodes and services
                if (error.message.includes("revert")) {
                    return {
                        success: false,
                        returnData: "0x",
                        customErrorReported: false,
                    };
                }
                if (error.message.includes("base fee exceeds gas limit")) {
                    throw new errors_1.IgnitionError(errors_list_1.ERRORS.EXECUTION.BASE_FEE_EXCEEDS_GAS_LIMIT);
                }
            }
            throw error;
        }
    }
    async estimateGas(estimateGasParams) {
        const jsonRpcEncodedParams = {
            to: estimateGasParams.to,
            value: bigIntToJsonRpcQuantity(estimateGasParams.value),
            data: estimateGasParams.data,
            from: estimateGasParams.from,
            nonce: numberToJsonRpcQuantity(estimateGasParams.nonce),
            ...jsonRpcEncodeNetworkFees(estimateGasParams.fees),
        };
        const response = await this._provider.request({
            method: "eth_estimateGas",
            params: [jsonRpcEncodedParams],
        });
        assertResponseType("eth_estimateGas", response, typeof response === "string");
        return jsonRpcQuantityToBigInt(response);
    }
    async sendTransaction(transactionParams) {
        try {
            const jsonRpcEncodedParams = {
                to: transactionParams.to,
                value: bigIntToJsonRpcQuantity(transactionParams.value),
                data: transactionParams.data,
                from: transactionParams.from,
                nonce: numberToJsonRpcQuantity(transactionParams.nonce),
                gas: bigIntToJsonRpcQuantity(transactionParams.gasLimit),
                ...jsonRpcEncodeNetworkFees(transactionParams.fees),
            };
            const response = await this._provider.request({
                method: "eth_sendTransaction",
                params: [jsonRpcEncodedParams],
            });
            assertResponseType("eth_sendTransaction", response, typeof response === "string");
            return response;
        }
        catch (error) {
            // If we are in an automined error we may get an error and still
            // the transaction gets mined. In that case we just return its hash.
            if (error instanceof Error &&
                "transactionHash" in error &&
                typeof error.transactionHash === "string") {
                return error.transactionHash;
            }
            throw error;
        }
    }
    async sendRawTransaction(presignedTx) {
        const response = await this._provider.request({
            method: "eth_sendRawTransaction",
            params: [presignedTx],
        });
        assertResponseType("eth_sendRawTransaction", response, typeof response === "string");
        return response;
    }
    async getTransactionCount(address, blockTag) {
        const encodedBlockTag = typeof blockTag === "number"
            ? numberToJsonRpcQuantity(blockTag)
            : blockTag;
        const response = await this._provider.request({
            method: "eth_getTransactionCount",
            params: [address, encodedBlockTag],
        });
        assertResponseType("eth_getTransactionCount", response, typeof response === "string");
        return jsonRpcQuantityToNumber(response);
    }
    async getTransaction(txHash) {
        const method = "eth_getTransactionByHash";
        const response = await this._provider.request({
            method,
            params: [txHash],
        });
        if (response === null) {
            return undefined;
        }
        assertResponseType(method, response, typeof response === "object");
        assertResponseType(method, response, "hash" in response && typeof response.hash === "string");
        assertResponseType(method, response, "blockNumber" in response &&
            (typeof response.blockNumber === "string" ||
                response.blockNumber === null));
        assertResponseType(method, response, "blockHash" in response &&
            (typeof response.blockHash === "string" || response.blockHash === null));
        let networkFees;
        if ("maxFeePerGas" in response) {
            assertResponseType(method, response, "maxFeePerGas" in response && typeof response.maxFeePerGas === "string");
            assertResponseType(method, response, "maxPriorityFeePerGas" in response &&
                typeof response.maxPriorityFeePerGas === "string");
            networkFees = {
                maxFeePerGas: jsonRpcQuantityToBigInt(response.maxFeePerGas),
                maxPriorityFeePerGas: jsonRpcQuantityToBigInt(response.maxPriorityFeePerGas),
            };
        }
        else {
            assertResponseType(method, response, "gasPrice" in response && typeof response.gasPrice === "string");
            networkFees = {
                gasPrice: jsonRpcQuantityToBigInt(response.gasPrice),
            };
        }
        return {
            hash: response.hash,
            fees: networkFees,
        };
    }
    async getTransactionReceipt(txHash) {
        const method = "eth_getTransactionReceipt";
        const response = await this._provider.request({
            method,
            params: [txHash],
        });
        if (response === null) {
            return undefined;
        }
        assertResponseType(method, response, typeof response === "object");
        assertResponseType(method, response, "blockHash" in response && typeof response.blockHash === "string");
        assertResponseType(method, response, "blockNumber" in response && typeof response.blockNumber === "string");
        assertResponseType(method, response, "status" in response && typeof response.status === "string");
        assertResponseType(method, response, "contractAddress" in response &&
            (response.contractAddress === null ||
                typeof response.contractAddress === "string"));
        const status = jsonRpcQuantityToNumber(response.status) === 1
            ? jsonrpc_1.TransactionReceiptStatus.SUCCESS
            : jsonrpc_1.TransactionReceiptStatus.FAILURE;
        const contractAddress = status === jsonrpc_1.TransactionReceiptStatus.SUCCESS
            ? response.contractAddress ?? undefined
            : undefined;
        return {
            blockHash: response.blockHash,
            blockNumber: jsonRpcQuantityToNumber(response.blockNumber),
            contractAddress: contractAddress === undefined
                ? undefined
                : (0, address_1.toChecksumFormat)(contractAddress),
            status,
            logs: formatReceiptLogs(method, response),
        };
    }
    async getCode(address) {
        const result = await this._provider.request({
            method: "eth_getCode",
            params: [address, "latest"],
        });
        assertResponseType("eth_getCode", result, typeof result === "string");
        return result;
    }
    async _getNetworkFees() {
        const [latestBlock, chainId] = await Promise.all([
            this.getLatestBlock(),
            this.getChainId(),
        ]);
        // We prioritize EIP-1559 fees over legacy gasPrice fees, however,
        // polygon (chainId 137) requires legacy gasPrice fees
        // so we skip EIP-1559 logic in that case
        if (latestBlock.baseFeePerGas !== undefined && chainId !== 137) {
            // Support zero gas fee chains, such as a private instances
            // of blockchains using Besu. We explicitly exclude BNB
            // Smartchain (chainId 56) and its testnet (chainId 97)
            // from this logic as it is EIP-1559 compliant but
            // only sets a maxPriorityFeePerGas.
            if (latestBlock.baseFeePerGas === 0n &&
                chainId !== 56 &&
                chainId !== 97) {
                return {
                    maxFeePerGas: 0n,
                    maxPriorityFeePerGas: 0n,
                };
            }
            const maxPriorityFeePerGas = await this._resolveMaxPriorityFeePerGas();
            // Logic copied from ethers v6
            const maxFeePerGas = latestBlock.baseFeePerGas * 2n + maxPriorityFeePerGas;
            return {
                maxFeePerGas,
                maxPriorityFeePerGas,
            };
        }
        const response = await this._provider.request({
            method: "eth_gasPrice",
            params: [],
        });
        assertResponseType("eth_gasPrice", response, typeof response === "string");
        return { gasPrice: jsonRpcQuantityToBigInt(response) };
    }
    /**
     * The max fee per gas is needed in the max fee calculation.
     *
     * It is resolved from config if present, falling back to
     * the  `eth_maxPriorityFeePerGas` RPC call if supported by the chain,
     * and finally falling back to the default max fee per gas.
     *
     * @returns a max fee per gas based on the config, RPC call, or default value.
     */
    async _resolveMaxPriorityFeePerGas() {
        if (this._config?.maxPriorityFeePerGas !== undefined) {
            return this._config?.maxPriorityFeePerGas;
        }
        try {
            return await this._getMaxPrioirtyFeePerGas();
        }
        catch {
            // the max priority fee RPC call is not supported by
            // this chain
        }
        return DEFAULT_MAX_PRIORITY_FEE_PER_GAS;
    }
    async _getMaxPrioirtyFeePerGas() {
        const fee = await this._provider.request({
            method: "eth_maxPriorityFeePerGas",
        });
        assertResponseType("eth_maxPriorityFeePerGas", fee, typeof fee === "string");
        return jsonRpcQuantityToBigInt(fee);
    }
}
exports.EIP1193JsonRpcClient = EIP1193JsonRpcClient;
/**
 * A function that returns true if an error thrown by a provider is an
 * execution failure due to a custom error.
 *
 * There are situations where a node may know that an error comes from
 * a custom error, yet we don't have the ABI to decode it. In those cases
 * we want to keep track of the information that the error was a custom error.
 *
 * @param error An error thrown by the provider.
 */
function isCustomErrorError(error) {
    return error.message.includes(" reverted with custom error ");
}
/**
 * Converts a BigInt value to a JSON-RPC quantity string.
 *
 * @param value - The BigInt value to convert.
 * @returns The JSON-RPC quantity string.
 */
function bigIntToJsonRpcQuantity(value) {
    if (value === 0n) {
        return "0x0";
    }
    const hex = value.toString(16);
    const trimmedLeadingZeros = hex.replace(/^0+/, "");
    return `0x${trimmedLeadingZeros}`;
}
/**
 * Converts a JSON-RPC quantity string to a BigInt value.
 **/
function jsonRpcQuantityToBigInt(value) {
    return BigInt(value);
}
/**
 * Converts a JSON-RPC quantity string to a number.
 */
function jsonRpcQuantityToNumber(value) {
    return Number(BigInt(value));
}
/**
 * Converts a number to a JSON-RPC quantity string.
 *
 * @param value The number to convert.
 * @returns The JSON-RPC quantity string.
 */
function numberToJsonRpcQuantity(value) {
    return bigIntToJsonRpcQuantity(BigInt(value));
}
function assertResponseType(method, response, assertion) {
    if (!assertion) {
        throw new errors_1.IgnitionError(errors_list_1.ERRORS.EXECUTION.INVALID_JSON_RPC_RESPONSE, {
            method,
            response: JSON.stringify(response),
        });
    }
}
function formatReceiptLogs(method, response) {
    const formattedLogs = [];
    assertResponseType(method, response, "logs" in response && Array.isArray(response.logs));
    const logs = response.logs;
    for (const rawLog of logs) {
        assertResponseType(method, response, typeof rawLog === "object" && rawLog !== null);
        assertResponseType(method, response, "address" in rawLog && typeof rawLog.address === "string");
        assertResponseType(method, response, "logIndex" in rawLog && typeof rawLog.logIndex === "string");
        assertResponseType(method, response, "data" in rawLog && typeof rawLog.data === "string");
        assertResponseType(method, response, "topics" in rawLog && Array.isArray(rawLog.topics));
        assertResponseType(method, response, rawLog.topics.every((t) => typeof t === "string"));
        formattedLogs.push({
            address: (0, address_1.toChecksumFormat)(rawLog.address),
            logIndex: jsonRpcQuantityToNumber(rawLog.logIndex),
            data: rawLog.data,
            topics: rawLog.topics,
        });
    }
    return formattedLogs;
}
function jsonRpcEncodeNetworkFees(fees) {
    if (fees === undefined) {
        return undefined;
    }
    if ("gasPrice" in fees) {
        return { gasPrice: bigIntToJsonRpcQuantity(fees.gasPrice) };
    }
    return {
        maxFeePerGas: bigIntToJsonRpcQuantity(fees.maxFeePerGas),
        maxPriorityFeePerGas: bigIntToJsonRpcQuantity(fees.maxPriorityFeePerGas),
    };
}
//# sourceMappingURL=jsonrpc-client.js.map