"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialiseCallExecutionStateFrom = exports.initialiseEncodeFunctionCallExecutionStateFrom = exports.initialiseContractAtExecutionStateFrom = exports.initialiseReadEventArgumentExecutionStateFrom = exports.initialiseSendDataExecutionStateFrom = exports.initialiseStaticCallExecutionStateFrom = exports.initialiseDeploymentExecutionStateFrom = void 0;
const module_1 = require("../../../../types/module");
const execution_state_1 = require("../../types/execution-state");
function initialiseDeploymentExecutionStateFrom(action) {
    const deploymentExecutionInitialState = {
        id: action.futureId,
        type: execution_state_1.ExecutionSateType.DEPLOYMENT_EXECUTION_STATE,
        futureType: action.futureType,
        strategy: action.strategy,
        strategyConfig: action.strategyConfig,
        status: execution_state_1.ExecutionStatus.STARTED,
        dependencies: new Set(action.dependencies),
        artifactId: action.artifactId,
        contractName: action.contractName,
        constructorArgs: action.constructorArgs,
        libraries: action.libraries,
        value: action.value,
        from: action.from,
        networkInteractions: [],
    };
    return deploymentExecutionInitialState;
}
exports.initialiseDeploymentExecutionStateFrom = initialiseDeploymentExecutionStateFrom;
function initialiseStaticCallExecutionStateFrom(action) {
    const callExecutionInitialState = {
        id: action.futureId,
        type: execution_state_1.ExecutionSateType.STATIC_CALL_EXECUTION_STATE,
        futureType: module_1.FutureType.STATIC_CALL,
        strategy: action.strategy,
        strategyConfig: action.strategyConfig,
        status: execution_state_1.ExecutionStatus.STARTED,
        dependencies: new Set(action.dependencies),
        artifactId: action.artifactId,
        contractAddress: action.contractAddress,
        functionName: action.functionName,
        args: action.args,
        nameOrIndex: action.nameOrIndex,
        from: action.from,
        networkInteractions: [],
    };
    return callExecutionInitialState;
}
exports.initialiseStaticCallExecutionStateFrom = initialiseStaticCallExecutionStateFrom;
function initialiseSendDataExecutionStateFrom(action) {
    const callExecutionInitialState = {
        id: action.futureId,
        type: execution_state_1.ExecutionSateType.SEND_DATA_EXECUTION_STATE,
        futureType: module_1.FutureType.SEND_DATA,
        strategy: action.strategy,
        strategyConfig: action.strategyConfig,
        status: execution_state_1.ExecutionStatus.STARTED,
        dependencies: new Set(action.dependencies),
        to: action.to,
        data: action.data,
        value: action.value,
        from: action.from,
        networkInteractions: [],
    };
    return callExecutionInitialState;
}
exports.initialiseSendDataExecutionStateFrom = initialiseSendDataExecutionStateFrom;
function initialiseReadEventArgumentExecutionStateFrom(action) {
    const readEventArgumentExecutionInitialState = {
        id: action.futureId,
        type: execution_state_1.ExecutionSateType.READ_EVENT_ARGUMENT_EXECUTION_STATE,
        futureType: module_1.FutureType.READ_EVENT_ARGUMENT,
        strategy: action.strategy,
        strategyConfig: action.strategyConfig,
        status: execution_state_1.ExecutionStatus.SUCCESS,
        dependencies: new Set(action.dependencies),
        artifactId: action.artifactId,
        eventName: action.eventName,
        nameOrIndex: action.nameOrIndex,
        txToReadFrom: action.txToReadFrom,
        emitterAddress: action.emitterAddress,
        eventIndex: action.eventIndex,
        result: action.result,
    };
    return readEventArgumentExecutionInitialState;
}
exports.initialiseReadEventArgumentExecutionStateFrom = initialiseReadEventArgumentExecutionStateFrom;
function initialiseContractAtExecutionStateFrom(action) {
    const contractAtExecutionInitialState = {
        id: action.futureId,
        type: execution_state_1.ExecutionSateType.CONTRACT_AT_EXECUTION_STATE,
        futureType: action.futureType,
        strategy: action.strategy,
        strategyConfig: action.strategyConfig,
        status: execution_state_1.ExecutionStatus.SUCCESS,
        dependencies: new Set(action.dependencies),
        artifactId: action.artifactId,
        contractName: action.contractName,
        contractAddress: action.contractAddress,
    };
    return contractAtExecutionInitialState;
}
exports.initialiseContractAtExecutionStateFrom = initialiseContractAtExecutionStateFrom;
function initialiseEncodeFunctionCallExecutionStateFrom(action) {
    const encodeFunctionCallExecutionInitialState = {
        id: action.futureId,
        type: execution_state_1.ExecutionSateType.ENCODE_FUNCTION_CALL_EXECUTION_STATE,
        futureType: module_1.FutureType.ENCODE_FUNCTION_CALL,
        strategy: action.strategy,
        strategyConfig: action.strategyConfig,
        status: execution_state_1.ExecutionStatus.SUCCESS,
        dependencies: new Set(action.dependencies),
        artifactId: action.artifactId,
        functionName: action.functionName,
        args: action.args,
        result: action.result,
    };
    return encodeFunctionCallExecutionInitialState;
}
exports.initialiseEncodeFunctionCallExecutionStateFrom = initialiseEncodeFunctionCallExecutionStateFrom;
function initialiseCallExecutionStateFrom(action) {
    const callExecutionInitialState = {
        id: action.futureId,
        type: execution_state_1.ExecutionSateType.CALL_EXECUTION_STATE,
        futureType: module_1.FutureType.CONTRACT_CALL,
        strategy: action.strategy,
        strategyConfig: action.strategyConfig,
        status: execution_state_1.ExecutionStatus.STARTED,
        dependencies: new Set(action.dependencies),
        artifactId: action.artifactId,
        contractAddress: action.contractAddress,
        functionName: action.functionName,
        args: action.args,
        value: action.value,
        from: action.from,
        networkInteractions: [],
    };
    return callExecutionInitialState;
}
exports.initialiseCallExecutionStateFrom = initialiseCallExecutionStateFrom;
//# sourceMappingURL=initializers.js.map