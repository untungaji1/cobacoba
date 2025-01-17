"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuntimeValueType = exports.FutureType = void 0;
/**
 * The different future types supported by Ignition.
 *
 * @beta
 */
var FutureType;
(function (FutureType) {
    FutureType["NAMED_ARTIFACT_CONTRACT_DEPLOYMENT"] = "NAMED_ARTIFACT_CONTRACT_DEPLOYMENT";
    FutureType["CONTRACT_DEPLOYMENT"] = "CONTRACT_DEPLOYMENT";
    FutureType["NAMED_ARTIFACT_LIBRARY_DEPLOYMENT"] = "NAMED_ARTIFACT_LIBRARY_DEPLOYMENT";
    FutureType["LIBRARY_DEPLOYMENT"] = "LIBRARY_DEPLOYMENT";
    FutureType["CONTRACT_CALL"] = "CONTRACT_CALL";
    FutureType["STATIC_CALL"] = "STATIC_CALL";
    FutureType["ENCODE_FUNCTION_CALL"] = "ENCODE_FUNCTION_CALL";
    FutureType["NAMED_ARTIFACT_CONTRACT_AT"] = "NAMED_ARTIFACT_CONTRACT_AT";
    FutureType["CONTRACT_AT"] = "CONTRACT_AT";
    FutureType["READ_EVENT_ARGUMENT"] = "READ_EVENT_ARGUMENT";
    FutureType["SEND_DATA"] = "SEND_DATA";
})(FutureType || (exports.FutureType = FutureType = {}));
/**
 * The different runtime values supported by Ignition.
 *
 * @beta
 */
var RuntimeValueType;
(function (RuntimeValueType) {
    RuntimeValueType["ACCOUNT"] = "ACCOUNT";
    RuntimeValueType["MODULE_PARAMETER"] = "MODULE_PARAMETER";
})(RuntimeValueType || (exports.RuntimeValueType = RuntimeValueType = {}));
//# sourceMappingURL=module.js.map