"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidContractName = exports.isValidFunctionOrEventName = exports.isValidSolidityIdentifier = exports.isValidIgnitionIdentifier = void 0;
/**
 * A regex that captures Ignitions rules for user provided ids, specifically
 * that they can only contain alphanumerics and underscores, and that they
 * start with a letter.
 */
const ignitionIdRegex = /^[a-zA-Z][a-zA-Z0-9_]*$/;
/**
 * The regex that captures Solidity's identifier rule.
 */
const solidityIdentifierRegex = /^[a-zA-Z$_][a-zA-Z0-9$_]*$/;
/**
 * A regex capturing the solidity identifier rule but extended to support
 * the `myfun(uint256,bool)` parameter syntax
 *
 * This *could* be even stricter, but it works for now and covers obvious mistakes
 */
const functionNameRegex = /^[a-zA-Z$_][a-zA-Z0-9$_]*(\([a-zA-Z0-9$_,\[\]]*\))?$/;
/**
 * Does the identifier match Ignition's rules for ids. Specifically that they
 * started with a letter and only contain alphanumerics and underscores.
 *
 * @param identifier - the id to test
 * @returns true if the identifier is valid
 */
function isValidIgnitionIdentifier(identifier) {
    return ignitionIdRegex.test(identifier);
}
exports.isValidIgnitionIdentifier = isValidIgnitionIdentifier;
/**
 * Does the identifier match Solidity's rules for ids. See the Solidity
 * language spec for more details.
 *
 * @param identifier - the id to test
 * @returns true if the identifier is a valid Solidity identifier
 */
function isValidSolidityIdentifier(identifier) {
    return solidityIdentifierRegex.test(identifier);
}
exports.isValidSolidityIdentifier = isValidSolidityIdentifier;
/**
 * Does the function or event name match Ignition's rules. This is
 * looser than Solidity's rules, but allows Ethers style `myfun(uint256,bool)`
 * function/event specifications.
 *
 * @param functionName - the function name to test
 * @returns true if the function name is valid
 */
function isValidFunctionOrEventName(functionName) {
    return functionNameRegex.test(functionName);
}
exports.isValidFunctionOrEventName = isValidFunctionOrEventName;
/**
 * Returns true if a contract name (either bare - e.g. `MyContract` - or fully
 * qualified - e.g. `contracts/MyContract.sol:MyContract`) is valid.
 *
 * In the case of FQNs, we only validate the contract name part.
 *
 * The reason to validate the contract name is that we want to use them in
 * future ids, and those need to be compatible with most common file systems
 * (including Windows!).
 *
 * We don't validate the entire FQN, as we'll only use its bare name to
 * derive ids.
 *
 * @param contractName A bare or FQN contract name to validate.
 * @returns true if the contract name is valid.
 */
function isValidContractName(contractName) {
    // IMPORTANT: Keep in sync with src/internal/utils/future-id-builders.ts#toContractFutureId
    // Is it an FQN?
    if (contractName.includes(":")) {
        contractName = contractName.split(":").at(-1);
    }
    return isValidSolidityIdentifier(contractName);
}
exports.isValidContractName = isValidContractName;
//# sourceMappingURL=identifier-validators.js.map