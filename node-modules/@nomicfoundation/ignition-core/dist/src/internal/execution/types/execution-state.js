"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecutionSateType = exports.ExecutionStatus = void 0;
/**
 * The different status that the execution can be at.
 */
var ExecutionStatus;
(function (ExecutionStatus) {
    ExecutionStatus["STARTED"] = "STARATED";
    ExecutionStatus["TIMEOUT"] = "TIMEOUT";
    ExecutionStatus["SUCCESS"] = "SUCCESS";
    ExecutionStatus["HELD"] = "HELD";
    ExecutionStatus["FAILED"] = "FAILED";
})(ExecutionStatus || (exports.ExecutionStatus = ExecutionStatus = {}));
/**
 * The different kinds of execution states.
 */
var ExecutionSateType;
(function (ExecutionSateType) {
    ExecutionSateType["DEPLOYMENT_EXECUTION_STATE"] = "DEPLOYMENT_EXECUTION_STATE";
    ExecutionSateType["CALL_EXECUTION_STATE"] = "CALL_EXECUTION_STATE";
    ExecutionSateType["STATIC_CALL_EXECUTION_STATE"] = "STATIC_CALL_EXECUTION_STATE";
    ExecutionSateType["ENCODE_FUNCTION_CALL_EXECUTION_STATE"] = "ENCODE_FUNCTION_CALL_EXECUTION_STATE";
    ExecutionSateType["CONTRACT_AT_EXECUTION_STATE"] = "CONTRACT_AT_EXECUTION_STATE";
    ExecutionSateType["READ_EVENT_ARGUMENT_EXECUTION_STATE"] = "READ_EVENT_ARGUMENT_EXECUTION_STATE";
    ExecutionSateType["SEND_DATA_EXECUTION_STATE"] = "SEND_DATA_EXECUTION_STATE";
})(ExecutionSateType || (exports.ExecutionSateType = ExecutionSateType = {}));
//# sourceMappingURL=execution-state.js.map