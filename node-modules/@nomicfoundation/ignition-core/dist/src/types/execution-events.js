"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecutionEventResultType = exports.ExecutionEventNetworkInteractionType = exports.ExecutionEventType = void 0;
/**
 * The types of diagnostic events emitted during a deploy.
 *
 * @beta
 */
var ExecutionEventType;
(function (ExecutionEventType) {
    ExecutionEventType["WIPE_APPLY"] = "WIPE_APPLY";
    ExecutionEventType["DEPLOYMENT_EXECUTION_STATE_INITIALIZE"] = "DEPLOYMENT_EXECUTION_STATE_INITIALIZE";
    ExecutionEventType["DEPLOYMENT_EXECUTION_STATE_COMPLETE"] = "DEPLOYMENT_EXECUTION_STATE_COMPLETE";
    ExecutionEventType["CALL_EXECUTION_STATE_INITIALIZE"] = "CALL_EXECUTION_STATE_INITIALIZE";
    ExecutionEventType["CALL_EXECUTION_STATE_COMPLETE"] = "CALL_EXECUTION_STATE_COMPLETE";
    ExecutionEventType["STATIC_CALL_EXECUTION_STATE_INITIALIZE"] = "STATIC_CALL_EXECUTION_STATE_INITIALIZE";
    ExecutionEventType["STATIC_CALL_EXECUTION_STATE_COMPLETE"] = "STATIC_CALL_EXECUTION_STATE_COMPLETE";
    ExecutionEventType["SEND_DATA_EXECUTION_STATE_INITIALIZE"] = "SEND_DATA_EXECUTION_STATE_INITIALIZE";
    ExecutionEventType["SEND_DATA_EXECUTION_STATE_COMPLETE"] = "SEND_DATA_EXECUTION_STATE_COMPLETE";
    ExecutionEventType["CONTRACT_AT_EXECUTION_STATE_INITIALIZE"] = "CONTRACT_AT_EXECUTION_STATE_INITIALIZE";
    ExecutionEventType["READ_EVENT_ARGUMENT_EXECUTION_STATE_INITIALIZE"] = "READ_EVENT_ARGUMENT_EXECUTION_STATE_INITIALIZE";
    ExecutionEventType["ENCODE_FUNCTION_CALL_EXECUTION_STATE_INITIALIZE"] = "ENCODE_FUNCTION_CALL_EXECUTION_STATE_INITIALIZE";
    ExecutionEventType["NETWORK_INTERACTION_REQUEST"] = "NETWORK_INTERACTION_REQUEST";
    ExecutionEventType["TRANSACTION_SEND"] = "TRANSACTION_SEND";
    ExecutionEventType["TRANSACTION_CONFIRM"] = "TRANSACTION_CONFIRM";
    ExecutionEventType["STATIC_CALL_COMPLETE"] = "STATIC_CALL_COMPLETE";
    ExecutionEventType["ONCHAIN_INTERACTION_BUMP_FEES"] = "ONCHAIN_INTERACTION_BUMP_FEES";
    ExecutionEventType["ONCHAIN_INTERACTION_DROPPED"] = "ONCHAIN_INTERACTION_DROPPED";
    ExecutionEventType["ONCHAIN_INTERACTION_REPLACED_BY_USER"] = "ONCHAIN_INTERACTION_REPLACED_BY_USER";
    ExecutionEventType["ONCHAIN_INTERACTION_TIMEOUT"] = "ONCHAIN_INTERACTION_TIMEOUT";
    ExecutionEventType["DEPLOYMENT_START"] = "DEPLOYMENT_START";
    ExecutionEventType["DEPLOYMENT_INITIALIZE"] = "DEPLOYMENT_INITIALIZE";
    ExecutionEventType["RECONCILIATION_WARNINGS"] = "RECONCILIATION_WARNINGS";
    ExecutionEventType["BATCH_INITIALIZE"] = "BATCH_INITIALIZE";
    ExecutionEventType["RUN_START"] = "RUN_START";
    ExecutionEventType["BEGIN_NEXT_BATCH"] = "BEGIN_NEXT_BATCH";
    ExecutionEventType["DEPLOYMENT_COMPLETE"] = "DEPLOYMENT_COMPLETE";
    ExecutionEventType["SET_MODULE_ID"] = "SET_MODULE_ID";
    ExecutionEventType["SET_STRATEGY"] = "SET_STRATEGY";
})(ExecutionEventType || (exports.ExecutionEventType = ExecutionEventType = {}));
/**
 * The types of network interactions that can be requested by a future.
 *
 * @beta
 */
var ExecutionEventNetworkInteractionType;
(function (ExecutionEventNetworkInteractionType) {
    ExecutionEventNetworkInteractionType["ONCHAIN_INTERACTION"] = "ONCHAIN_INTERACTION";
    ExecutionEventNetworkInteractionType["STATIC_CALL"] = "STATIC_CALL";
})(ExecutionEventNetworkInteractionType || (exports.ExecutionEventNetworkInteractionType = ExecutionEventNetworkInteractionType = {}));
/**
 * The status of a future's completed execution.
 *
 * @beta
 */
var ExecutionEventResultType;
(function (ExecutionEventResultType) {
    ExecutionEventResultType["SUCCESS"] = "SUCCESS";
    ExecutionEventResultType["ERROR"] = "ERROR";
    ExecutionEventResultType["HELD"] = "HELD";
})(ExecutionEventResultType || (exports.ExecutionEventResultType = ExecutionEventResultType = {}));
//# sourceMappingURL=execution-events.js.map