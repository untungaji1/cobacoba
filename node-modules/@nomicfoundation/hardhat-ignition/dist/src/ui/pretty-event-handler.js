"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrettyEventHandler = void 0;
const ignition_core_1 = require("@nomicfoundation/ignition-core");
const readline_1 = __importDefault(require("readline"));
const calculate_batch_display_1 = require("./helpers/calculate-batch-display");
const calculate_deploying_module_panel_1 = require("./helpers/calculate-deploying-module-panel");
const calculate_deployment_complete_display_1 = require("./helpers/calculate-deployment-complete-display");
const calculate_starting_message_1 = require("./helpers/calculate-starting-message");
const was_anything_executed_1 = require("./helpers/was-anything-executed");
const types_1 = require("./types");
class PrettyEventHandler {
    _deploymentParams;
    _disableOutput;
    _uiState = {
        status: types_1.UiStateDeploymentStatus.UNSTARTED,
        chainId: null,
        moduleName: null,
        deploymentDir: null,
        batches: [],
        currentBatch: 0,
        result: null,
        warnings: [],
        isResumed: null,
        maxFeeBumps: 0,
        gasBumps: {},
        strategy: null,
        ledger: false,
        ledgerMessage: "",
        ledgerMessageIsDisplayed: false,
    };
    constructor(_deploymentParams = {}, _disableOutput = false) {
        this._deploymentParams = _deploymentParams;
        this._disableOutput = _disableOutput;
    }
    get state() {
        return this._uiState;
    }
    set state(uiState) {
        this._uiState = uiState;
    }
    deploymentStart(event) {
        this.state = {
            ...this.state,
            status: types_1.UiStateDeploymentStatus.DEPLOYING,
            moduleName: event.moduleName,
            deploymentDir: event.deploymentDir,
            isResumed: event.isResumed,
            maxFeeBumps: event.maxFeeBumps,
        };
        process.stdout.write((0, calculate_starting_message_1.calculateStartingMessage)(this.state));
    }
    deploymentInitialize(event) {
        this.state = {
            ...this.state,
            chainId: event.chainId,
        };
    }
    runStart(_event) {
        this._clearCurrentLine();
        console.log((0, calculate_deploying_module_panel_1.calculateDeployingModulePanel)(this.state));
    }
    beginNextBatch(_event) {
        // rerender the previous batch
        if (this.state.currentBatch > 0) {
            this._redisplayCurrentBatch();
        }
        this.state = {
            ...this.state,
            currentBatch: this.state.currentBatch + 1,
        };
        if (this.state.currentBatch === 0) {
            return;
        }
        // render the new batch
        console.log((0, calculate_batch_display_1.calculateBatchDisplay)(this.state).text);
    }
    wipeApply(event) {
        const batches = [];
        for (const batch of this.state.batches) {
            const futureBatch = [];
            for (const future of batch) {
                if (future.futureId === event.futureId) {
                    continue;
                }
                else {
                    futureBatch.push(future);
                }
            }
            batches.push(futureBatch);
        }
        this.state = {
            ...this.state,
            batches,
        };
    }
    deploymentExecutionStateInitialize(event) {
        this._setFutureStatusInitializedAndRedisplayBatch(event);
    }
    deploymentExecutionStateComplete(event) {
        this._setFutureStatusCompleteAndRedisplayBatch(event);
    }
    callExecutionStateInitialize(event) {
        this._setFutureStatusInitializedAndRedisplayBatch(event);
    }
    callExecutionStateComplete(event) {
        this._setFutureStatusCompleteAndRedisplayBatch(event);
    }
    staticCallExecutionStateInitialize(event) {
        this._setFutureStatusInitializedAndRedisplayBatch(event);
    }
    staticCallExecutionStateComplete(event) {
        this._setFutureStatusCompleteAndRedisplayBatch(event);
    }
    sendDataExecutionStateInitialize(event) {
        this._setFutureStatusInitializedAndRedisplayBatch(event);
    }
    sendDataExecutionStateComplete(event) {
        this._setFutureStatusCompleteAndRedisplayBatch(event);
    }
    contractAtExecutionStateInitialize(event) {
        this._setFutureStatusAndRedisplayBatch(event.futureId, {
            type: types_1.UiFutureStatusType.SUCCESS,
        });
    }
    readEventArgumentExecutionStateInitialize(event) {
        this._setFutureStatusAndRedisplayBatch(event.futureId, {
            type: types_1.UiFutureStatusType.SUCCESS,
        });
    }
    encodeFunctionCallExecutionStateInitialize(event) {
        this._setFutureStatusAndRedisplayBatch(event.futureId, {
            type: types_1.UiFutureStatusType.SUCCESS,
        });
    }
    batchInitialize(event) {
        const batches = [];
        for (const batch of event.batches) {
            const futureBatch = [];
            for (const futureId of batch) {
                futureBatch.push({
                    futureId,
                    status: {
                        type: types_1.UiFutureStatusType.UNSTARTED,
                    },
                });
            }
            batches.push(futureBatch);
        }
        this.state = {
            ...this.state,
            batches,
        };
    }
    networkInteractionRequest(_event) { }
    transactionSend(_event) { }
    transactionConfirm(_event) { }
    staticCallComplete(_event) { }
    onchainInteractionBumpFees(event) {
        if (this._uiState.gasBumps[event.futureId] === undefined) {
            this._uiState.gasBumps[event.futureId] = 0;
        }
        this._uiState.gasBumps[event.futureId] += 1;
        this._redisplayCurrentBatch();
    }
    onchainInteractionDropped(_event) { }
    onchainInteractionReplacedByUser(_event) { }
    onchainInteractionTimeout(_event) { }
    deploymentComplete(event) {
        this.state = {
            ...this.state,
            status: types_1.UiStateDeploymentStatus.COMPLETE,
            result: event.result,
            batches: this._applyResultToBatches(this.state.batches, event.result),
        };
        // If batches where executed, rerender the last batch
        if ((0, was_anything_executed_1.wasAnythingExecuted)(this.state)) {
            this._redisplayCurrentBatch();
        }
        else {
            // Otherwise only the completion panel will be shown so clear
            // the Starting Ignition line.
            this._clearCurrentLine();
        }
        console.log((0, calculate_deployment_complete_display_1.calculateDeploymentCompleteDisplay)(event, this.state));
    }
    reconciliationWarnings(event) {
        this.state = {
            ...this.state,
            warnings: [...this.state.warnings, ...event.warnings],
        };
    }
    setModuleId(event) {
        this.state = {
            ...this.state,
            moduleName: event.moduleName,
        };
    }
    setStrategy(event) {
        this.state = {
            ...this.state,
            strategy: event.strategy,
        };
    }
    ledgerConnectionStart() {
        this.state = {
            ...this.state,
            ledger: true,
            ledgerMessage: "Connecting wallet",
        };
        this._redisplayCurrentBatch();
        this.state = {
            ...this.state,
            ledgerMessageIsDisplayed: true,
        };
    }
    ledgerConnectionSuccess() {
        this.state = {
            ...this.state,
            ledgerMessage: "Wallet connected",
        };
        this._redisplayCurrentBatch();
    }
    ledgerConnectionFailure() {
        this.state = {
            ...this.state,
            ledgerMessage: "Wallet connection failed",
        };
        this._redisplayCurrentBatch();
    }
    ledgerConfirmationStart() {
        this.state = {
            ...this.state,
            ledger: true,
            ledgerMessage: "Waiting for confirmation on device",
        };
        this._redisplayCurrentBatch();
        this.state = {
            ...this.state,
            ledgerMessageIsDisplayed: true,
        };
    }
    ledgerConfirmationSuccess() {
        this.state = {
            ...this.state,
            ledgerMessage: "Transaction approved by device",
        };
        this._redisplayCurrentBatch();
        this.state = {
            ...this.state,
            ledger: false,
        };
    }
    ledgerConfirmationFailure() {
        this.state = {
            ...this.state,
            ledgerMessage: "Transaction confirmation failed",
        };
        this._redisplayCurrentBatch();
    }
    _setFutureStatusInitializedAndRedisplayBatch({ futureId, }) {
        this._setFutureStatusAndRedisplayBatch(futureId, {
            type: types_1.UiFutureStatusType.UNSTARTED,
        });
    }
    _setFutureStatusCompleteAndRedisplayBatch({ futureId, result, }) {
        this._setFutureStatusAndRedisplayBatch(futureId, this._getFutureStatusFromEventResult(result));
        this.state = {
            ...this.state,
            ledgerMessageIsDisplayed: false,
        };
    }
    _setFutureStatusAndRedisplayBatch(futureId, status) {
        const updatedFuture = {
            futureId,
            status,
        };
        this.state = {
            ...this.state,
            batches: this._applyUpdateToBatchFuture(updatedFuture),
        };
        this._redisplayCurrentBatch();
    }
    _applyUpdateToBatchFuture(updatedFuture) {
        const batches = [];
        for (const batch of this.state.batches) {
            const futureBatch = [];
            for (const future of batch) {
                if (future.futureId === updatedFuture.futureId) {
                    futureBatch.push(updatedFuture);
                }
                else {
                    futureBatch.push(future);
                }
            }
            batches.push(futureBatch);
        }
        return batches;
    }
    _getFutureStatusFromEventResult(result) {
        switch (result.type) {
            case ignition_core_1.ExecutionEventResultType.SUCCESS: {
                return {
                    type: types_1.UiFutureStatusType.SUCCESS,
                    result: result.result,
                };
            }
            case ignition_core_1.ExecutionEventResultType.ERROR: {
                return {
                    type: types_1.UiFutureStatusType.ERRORED,
                    message: result.error,
                };
            }
            case ignition_core_1.ExecutionEventResultType.HELD: {
                return {
                    type: types_1.UiFutureStatusType.HELD,
                    heldId: result.heldId,
                    reason: result.reason,
                };
            }
        }
    }
    _applyResultToBatches(batches, result) {
        const newBatches = [];
        for (const oldBatch of batches) {
            const newBatch = [];
            for (const future of oldBatch) {
                const updatedFuture = this._hasUpdatedResult(future.futureId, result);
                newBatch.push(updatedFuture ?? future);
            }
            newBatches.push(newBatch);
        }
        return newBatches;
    }
    _hasUpdatedResult(futureId, result) {
        if (result.type !== ignition_core_1.DeploymentResultType.EXECUTION_ERROR) {
            return null;
        }
        const failed = result.failed.find((f) => f.futureId === futureId);
        if (failed !== undefined) {
            const f = {
                futureId,
                status: {
                    type: types_1.UiFutureStatusType.ERRORED,
                    message: failed.error,
                },
            };
            return f;
        }
        const timedout = result.timedOut.find((f) => f.futureId === futureId);
        if (timedout !== undefined) {
            const f = {
                futureId,
                status: {
                    type: types_1.UiFutureStatusType.TIMEDOUT,
                },
            };
            return f;
        }
        return null;
    }
    _redisplayCurrentBatch() {
        if (!this._disableOutput) {
            const { height, text: batch } = (0, calculate_batch_display_1.calculateBatchDisplay)(this.state);
            this._clearUpToHeight(height);
            console.log(batch);
        }
    }
    _clearCurrentLine() {
        readline_1.default.clearLine(process.stdout, 0);
        readline_1.default.cursorTo(process.stdout, 0);
    }
    _clearUpToHeight(height) {
        readline_1.default.moveCursor(process.stdout, 0, -height);
        readline_1.default.clearScreenDown(process.stdout);
    }
}
exports.PrettyEventHandler = PrettyEventHandler;
//# sourceMappingURL=pretty-event-handler.js.map