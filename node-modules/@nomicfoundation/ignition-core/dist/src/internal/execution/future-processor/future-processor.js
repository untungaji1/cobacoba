"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FutureProcessor = void 0;
const assertions_1 = require("../../utils/assertions");
const is_execution_state_complete_1 = require("../../views/is-execution-state-complete");
const deployment_state_helpers_1 = require("../deployment-state-helpers");
const execution_result_1 = require("../types/execution-result");
const execution_state_1 = require("../types/execution-state");
const messages_1 = require("../types/messages");
const monitor_onchain_interaction_1 = require("./handlers/monitor-onchain-interaction");
const query_static_call_1 = require("./handlers/query-static-call");
const run_strategy_1 = require("./handlers/run-strategy");
const send_transaction_1 = require("./handlers/send-transaction");
const build_initialize_message_for_1 = require("./helpers/build-initialize-message-for");
const next_action_for_execution_state_1 = require("./helpers/next-action-for-execution-state");
const save_artifacts_for_future_1 = require("./helpers/save-artifacts-for-future");
/**
 * This class is used to process a future, executing as much as possible, and
 * returning the new deployment state and a boolean indicating if the future
 * was completed.
 */
class FutureProcessor {
    _deploymentLoader;
    _artifactResolver;
    _executionStrategy;
    _jsonRpcClient;
    _transactionTrackingTimer;
    _nonceManager;
    _requiredConfirmations;
    _millisecondBeforeBumpingFees;
    _maxFeeBumps;
    _accounts;
    _deploymentParameters;
    _defaultSender;
    constructor(_deploymentLoader, _artifactResolver, _executionStrategy, _jsonRpcClient, _transactionTrackingTimer, _nonceManager, _requiredConfirmations, _millisecondBeforeBumpingFees, _maxFeeBumps, _accounts, _deploymentParameters, _defaultSender) {
        this._deploymentLoader = _deploymentLoader;
        this._artifactResolver = _artifactResolver;
        this._executionStrategy = _executionStrategy;
        this._jsonRpcClient = _jsonRpcClient;
        this._transactionTrackingTimer = _transactionTrackingTimer;
        this._nonceManager = _nonceManager;
        this._requiredConfirmations = _requiredConfirmations;
        this._millisecondBeforeBumpingFees = _millisecondBeforeBumpingFees;
        this._maxFeeBumps = _maxFeeBumps;
        this._accounts = _accounts;
        this._deploymentParameters = _deploymentParameters;
        this._defaultSender = _defaultSender;
    }
    /**
     * Process a future, executing as much as possible, and returning the new
     * deployment state and a boolean indicating if the future was completed.
     *
     * @param future The future to process.
     * @returns An object with the new state and a boolean indicating if the future
     *  was completed. If it wasn't completed, it should be processed again later,
     *  as there's a transactions awaiting to be confirmed.
     */
    async processFuture(future, deploymentState) {
        let exState = deploymentState.executionStates[future.id];
        if (exState === undefined) {
            const initMessage = await (0, build_initialize_message_for_1.buildInitializeMessageFor)(future, deploymentState, this._executionStrategy, this._deploymentParameters, this._deploymentLoader, this._accounts, this._defaultSender);
            await (0, save_artifacts_for_future_1.saveArtifactsForFuture)(future, this._artifactResolver, this._deploymentLoader);
            deploymentState = await (0, deployment_state_helpers_1.applyNewMessage)(initMessage, deploymentState, this._deploymentLoader);
            exState = deploymentState.executionStates[future.id];
            (0, assertions_1.assertIgnitionInvariant)(exState !== undefined, `Invalid initialization message for future ${future.id}: it didn't create its execution state`);
            await this._recordDeployedAddressIfNeeded(initMessage);
        }
        while (!(0, is_execution_state_complete_1.isExecutionStateComplete)(exState)) {
            (0, assertions_1.assertIgnitionInvariant)(exState.type !== execution_state_1.ExecutionSateType.CONTRACT_AT_EXECUTION_STATE &&
                exState.type !==
                    execution_state_1.ExecutionSateType.READ_EVENT_ARGUMENT_EXECUTION_STATE &&
                exState.type !==
                    execution_state_1.ExecutionSateType.ENCODE_FUNCTION_CALL_EXECUTION_STATE, `Unexpected ExectutionState ${exState.id} with type ${exState.type} and status ${exState.status}: it should have been immediately completed`);
            const nextAction = (0, next_action_for_execution_state_1.nextActionForExecutionState)(exState);
            const nextMessage = await this._nextActionDispatch(exState, nextAction);
            if (nextMessage === undefined) {
                // continue with the next future
                return { newState: deploymentState };
            }
            deploymentState = await (0, deployment_state_helpers_1.applyNewMessage)(nextMessage, deploymentState, this._deploymentLoader);
            exState = deploymentState.executionStates[future.id];
            await this._recordDeployedAddressIfNeeded(nextMessage);
        }
        return { newState: deploymentState };
    }
    /**
     * Records a deployed address if the last applied message was a
     * successful completion of a deployment.
     *
     * @param lastAppliedMessage The last message that was applied to the deployment state.
     */
    async _recordDeployedAddressIfNeeded(lastAppliedMessage) {
        if (lastAppliedMessage.type ===
            messages_1.JournalMessageType.DEPLOYMENT_EXECUTION_STATE_COMPLETE &&
            lastAppliedMessage.result.type === execution_result_1.ExecutionResultType.SUCCESS) {
            await this._deploymentLoader.recordDeployedAddress(lastAppliedMessage.futureId, lastAppliedMessage.result.address);
        }
        else if (lastAppliedMessage.type ===
            messages_1.JournalMessageType.CONTRACT_AT_EXECUTION_STATE_INITIALIZE) {
            await this._deploymentLoader.recordDeployedAddress(lastAppliedMessage.futureId, lastAppliedMessage.contractAddress);
        }
    }
    /**
     * Executes the next action for the execution state, and returns a message to
     * be applied as a result of the execution, or undefined if no progress can be made
     * yet and execution should be resumed later.
     */
    async _nextActionDispatch(exState, nextAction) {
        switch (nextAction) {
            case next_action_for_execution_state_1.NextAction.RUN_STRATEGY:
                return (0, run_strategy_1.runStrategy)(exState, this._executionStrategy);
            case next_action_for_execution_state_1.NextAction.SEND_TRANSACTION:
                (0, assertions_1.assertIgnitionInvariant)(exState.type !== execution_state_1.ExecutionSateType.STATIC_CALL_EXECUTION_STATE, `Unexpected transaction request in StaticCallExecutionState ${exState.id}`);
                return (0, send_transaction_1.sendTransaction)(exState, this._executionStrategy, this._jsonRpcClient, this._nonceManager, this._transactionTrackingTimer);
            case next_action_for_execution_state_1.NextAction.QUERY_STATIC_CALL:
                return (0, query_static_call_1.queryStaticCall)(exState, this._jsonRpcClient);
            case next_action_for_execution_state_1.NextAction.MONITOR_ONCHAIN_INTERACTION:
                (0, assertions_1.assertIgnitionInvariant)(exState.type !== execution_state_1.ExecutionSateType.STATIC_CALL_EXECUTION_STATE, `Unexpected transaction request in StaticCallExecutionState ${exState.id}`);
                return (0, monitor_onchain_interaction_1.monitorOnchainInteraction)(exState, this._jsonRpcClient, this._transactionTrackingTimer, this._requiredConfirmations, this._millisecondBeforeBumpingFees, this._maxFeeBumps);
        }
    }
}
exports.FutureProcessor = FutureProcessor;
//# sourceMappingURL=future-processor.js.map