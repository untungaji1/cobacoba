"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImportSourceNames = exports.getVerificationInformation = void 0;
const solidity_analyzer_1 = require("@nomicfoundation/solidity-analyzer");
const path_1 = __importDefault(require("path"));
const errors_1 = require("./errors");
const chain_config_1 = require("./internal/chain-config");
const file_deployment_loader_1 = require("./internal/deployment-loader/file-deployment-loader");
const errors_list_1 = require("./internal/errors-list");
const abi_1 = require("./internal/execution/abi");
const deployment_state_helpers_1 = require("./internal/execution/deployment-state-helpers");
const execution_result_1 = require("./internal/execution/types/execution-result");
const execution_state_1 = require("./internal/execution/types/execution-state");
const assertions_1 = require("./internal/utils/assertions");
const find_execution_states_by_type_1 = require("./internal/views/find-execution-states-by-type");
/**
 * Retrieve the information required to verify all contracts from a deployment on Etherscan.
 *
 * @param deploymentDir - the file directory of the deployment
 * @param customChains - an array of custom chain configurations
 *
 * @beta
 */
async function* getVerificationInformation(deploymentDir, customChains = [], includeUnrelatedContracts = false) {
    const deploymentLoader = new file_deployment_loader_1.FileDeploymentLoader(deploymentDir);
    const deploymentState = await (0, deployment_state_helpers_1.loadDeploymentState)(deploymentLoader);
    if (deploymentState === undefined) {
        throw new errors_1.IgnitionError(errors_list_1.ERRORS.VERIFY.UNINITIALIZED_DEPLOYMENT, {
            deploymentDir,
        });
    }
    const chainConfig = resolveChainConfig(deploymentState, customChains);
    const deploymentExStates = (0, find_execution_states_by_type_1.findExecutionStatesByType)(execution_state_1.ExecutionSateType.DEPLOYMENT_EXECUTION_STATE, deploymentState).filter((exState) => exState.status === execution_state_1.ExecutionStatus.SUCCESS);
    if (deploymentExStates.length === 0) {
        throw new errors_1.IgnitionError(errors_list_1.ERRORS.VERIFY.NO_CONTRACTS_DEPLOYED, {
            deploymentDir,
        });
    }
    for (const exState of deploymentExStates) {
        const verifyInfo = await convertExStateToVerifyInfo(exState, deploymentLoader, includeUnrelatedContracts);
        const verifyResult = [chainConfig, verifyInfo];
        yield verifyResult;
    }
}
exports.getVerificationInformation = getVerificationInformation;
function resolveChainConfig(deploymentState, customChains) {
    // implementation note:
    // if a user has set a custom chain with the same chainId as a builtin chain,
    // the custom chain will be used instead of the builtin chain
    const chainConfig = [...customChains, ...chain_config_1.builtinChains].find((c) => c.chainId === deploymentState.chainId);
    if (chainConfig === undefined) {
        throw new errors_1.IgnitionError(errors_list_1.ERRORS.VERIFY.UNSUPPORTED_CHAIN, {
            chainId: deploymentState.chainId,
        });
    }
    return chainConfig;
}
function getImportSourceNames(sourceName, buildInfo, visited = {}) {
    if (visited[sourceName]) {
        return [];
    }
    visited[sourceName] = true;
    const contractSource = buildInfo.input.sources[sourceName].content;
    const { imports } = (0, solidity_analyzer_1.analyze)(contractSource);
    const importSources = imports.map((i) => {
        if (/^\.\.?[\/|\\]/.test(i)) {
            return path_1.default.join(path_1.default.dirname(sourceName), i).replaceAll("\\", "/");
        }
        return i;
    });
    return [
        ...importSources,
        ...importSources.flatMap((i) => getImportSourceNames(i, buildInfo, visited)),
    ];
}
exports.getImportSourceNames = getImportSourceNames;
async function convertExStateToVerifyInfo(exState, deploymentLoader, includeUnrelatedContracts = false) {
    const [buildInfo, artifact] = await Promise.all([
        deploymentLoader.readBuildInfo(exState.artifactId),
        deploymentLoader.loadArtifact(exState.artifactId),
    ]);
    const { contractName, constructorArgs, libraries } = exState;
    (0, assertions_1.assertIgnitionInvariant)(exState.result !== undefined &&
        exState.result.type === execution_result_1.ExecutionResultType.SUCCESS, `Deployment execution state ${exState.id} should have a successful result to retrieve address`);
    const sourceCode = prepareInputBasedOn(buildInfo, artifact, libraries);
    if (!includeUnrelatedContracts) {
        const sourceNames = [
            artifact.sourceName,
            ...getImportSourceNames(artifact.sourceName, buildInfo),
        ];
        for (const source of Object.keys(sourceCode.sources)) {
            if (!sourceNames.includes(source)) {
                delete sourceCode.sources[source];
            }
        }
    }
    const verifyInfo = {
        address: exState.result.address,
        compilerVersion: buildInfo.solcLongVersion.startsWith("v")
            ? buildInfo.solcLongVersion
            : `v${buildInfo.solcLongVersion}`,
        sourceCode: JSON.stringify(sourceCode),
        name: `${artifact.sourceName}:${contractName}`,
        args: (0, abi_1.encodeDeploymentArguments)(artifact, constructorArgs),
    };
    return verifyInfo;
}
function prepareInputBasedOn(buildInfo, artifact, libraries) {
    const sourceToLibraryAddresses = resolveLibraryInfoForArtifact(artifact, libraries);
    if (sourceToLibraryAddresses === null) {
        return buildInfo.input;
    }
    const { input } = buildInfo;
    input.settings.libraries = sourceToLibraryAddresses;
    return input;
}
function resolveLibraryInfoForArtifact(artifact, libraries) {
    const sourceToLibraryToAddress = {};
    for (const [sourceName, refObj] of Object.entries(artifact.linkReferences)) {
        for (const [libName] of Object.entries(refObj)) {
            sourceToLibraryToAddress[sourceName] ??= {};
            const libraryAddress = libraries[libName];
            (0, assertions_1.assertIgnitionInvariant)(libraryAddress !== undefined, `Could not find address for library ${libName}`);
            sourceToLibraryToAddress[sourceName][libName] = libraryAddress;
        }
    }
    if (Object.entries(sourceToLibraryToAddress).length === 0) {
        return null;
    }
    return sourceToLibraryToAddress;
}
//# sourceMappingURL=verify.js.map