"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuleConstructor = void 0;
const util_1 = require("util");
const errors_1 = require("../errors");
const type_guards_1 = require("../type-guards");
const module_1 = require("../types/module");
const errors_list_1 = require("./errors-list");
const address_1 = require("./execution/utils/address");
const module_2 = require("./module");
const utils_1 = require("./utils");
const assertions_1 = require("./utils/assertions");
const future_id_builders_1 = require("./utils/future-id-builders");
const identifier_validators_1 = require("./utils/identifier-validators");
const STUB_MODULE_RESULTS = {
    [util_1.inspect.custom]() {
        return "<Module being constructed - No results available yet>";
    },
};
/**
 * This class is in charge of turning `IgnitionModuleDefinition`s into
 * `IgnitionModule`s.
 *
 * Part of this class' responsibility is handling any concrete
 * value that's only present during deployment (e.g. chain id, accounts, and
 * module params).
 *
 * TODO: Add support for concrete values.
 */
class ModuleConstructor {
    parameters;
    _modules = new Map();
    constructor(parameters = {}) {
        this.parameters = parameters;
    }
    construct(moduleDefintion) {
        const cachedModule = this._modules.get(moduleDefintion.id);
        if (cachedModule !== undefined) {
            // NOTE: This is actually unsafe, but we accept the risk.
            //  A different module could have been cached with this id, and that would lead
            //  to this method returning a module with a different type than that of its signature.
            return cachedModule;
        }
        const mod = new module_2.IgnitionModuleImplementation(moduleDefintion.id, STUB_MODULE_RESULTS);
        mod.results = moduleDefintion.moduleDefintionFunction(new IgnitionModuleBuilderImplementation(this, mod, this.parameters[moduleDefintion.id]));
        if (mod.results instanceof Promise) {
            throw new errors_1.IgnitionError(errors_list_1.ERRORS.MODULE.ASYNC_MODULE_DEFINITION_FUNCTION, {
                moduleDefinitionId: moduleDefintion.id,
            });
        }
        this._modules.set(moduleDefintion.id, mod);
        return mod;
    }
}
exports.ModuleConstructor = ModuleConstructor;
class IgnitionModuleBuilderImplementation {
    _constructor;
    _module;
    parameters;
    _futureIds;
    constructor(_constructor, _module, parameters = {}) {
        this._constructor = _constructor;
        this._module = _module;
        this.parameters = parameters;
        this._futureIds = new Set();
    }
    getAccount(accountIndex) {
        if (typeof accountIndex !== "number") {
            this._throwErrorWithStackTrace(`Account index must be a number, received ${typeof accountIndex}`, this.getAccount);
        }
        return new module_2.AccountRuntimeValueImplementation(accountIndex);
    }
    getParameter(parameterName, defaultValue) {
        if (typeof parameterName !== "string") {
            this._throwErrorWithStackTrace(`Parameter name must be a string, received ${typeof parameterName}`, this.getParameter);
        }
        return new module_2.ModuleParameterRuntimeValueImplementation(this._module.id, parameterName, defaultValue);
    }
    contract(contractName, artifactOrArgs, argsorOptions, maybeOptions) {
        if (typeof contractName !== "string") {
            this._throwErrorWithStackTrace(`Contract name must be a string, received ${typeof contractName}`, this.contract);
        }
        if (artifactOrArgs === undefined || Array.isArray(artifactOrArgs)) {
            if (Array.isArray(argsorOptions)) {
                this._throwErrorWithStackTrace(`Invalid parameter "options" provided to contract "${contractName}" in module "${this._module.id}"`, this.contract);
            }
            return this._namedArtifactContract(contractName, artifactOrArgs, argsorOptions);
        }
        if (argsorOptions !== undefined && !Array.isArray(argsorOptions)) {
            this._throwErrorWithStackTrace(`Invalid parameter "args" provided to contract "${contractName}" in module "${this._module.id}"`, this.contract);
        }
        return this._contractFromArtifact(contractName, artifactOrArgs, argsorOptions, maybeOptions);
    }
    _namedArtifactContract(contractName, args = [], options = {}) {
        const futureId = (0, future_id_builders_1.toContractFutureId)(this._module.id, options.id, contractName);
        options.libraries ??= {};
        options.value ??= BigInt(0);
        /* validation start */
        this._assertValidId(options.id, this.contract);
        this._assertValidContractName(contractName, this.contract);
        this._assertUniqueFutureId(futureId, options.id, this.contract);
        this._assertValidLibraries(options.libraries, this.contract);
        this._assertValidValue(options.value, this.contract);
        this._assertValidFrom(options.from, this.contract);
        /* validation end */
        const future = new module_2.NamedContractDeploymentFutureImplementation(futureId, this._module, contractName, args, options.libraries, options.value, options.from);
        if ((0, type_guards_1.isFuture)(options.value)) {
            future.dependencies.add(options.value);
        }
        for (const arg of (0, utils_1.resolveArgsToFutures)(args)) {
            future.dependencies.add(arg);
        }
        for (const afterFuture of options.after ?? []) {
            future.dependencies.add(afterFuture);
        }
        for (const libraryFuture of Object.values(options.libraries)) {
            future.dependencies.add(libraryFuture);
        }
        this._module.futures.add(future);
        this._futureIds.add(futureId);
        return future;
    }
    _contractFromArtifact(contractName, artifact, args = [], options = {}) {
        const futureId = (0, future_id_builders_1.toContractFutureId)(this._module.id, options.id, contractName);
        options.libraries ??= {};
        options.value ??= BigInt(0);
        /* validation start */
        this._assertValidId(options.id, this.contract);
        this._assertValidContractName(contractName, this.contract);
        this._assertUniqueFutureId(futureId, options.id, this.contract);
        this._assertValidLibraries(options.libraries, this.contract);
        this._assertValidValue(options.value, this.contract);
        this._assertValidFrom(options.from, this.contract);
        this._assertValidArtifact(artifact, this.contract);
        /* validation end */
        const future = new module_2.ArtifactContractDeploymentFutureImplementation(futureId, this._module, contractName, args, artifact, options.libraries, options.value, options.from);
        if ((0, type_guards_1.isFuture)(options.value)) {
            future.dependencies.add(options.value);
        }
        for (const arg of (0, utils_1.resolveArgsToFutures)(args)) {
            future.dependencies.add(arg);
        }
        for (const afterFuture of options.after ?? []) {
            future.dependencies.add(afterFuture);
        }
        for (const libraryFuture of Object.values(options.libraries)) {
            future.dependencies.add(libraryFuture);
        }
        this._module.futures.add(future);
        this._futureIds.add(futureId);
        return future;
    }
    library(libraryName, artifactOrOptions, options) {
        if (typeof libraryName !== "string") {
            this._throwErrorWithStackTrace(`Library name must be a string, received ${typeof libraryName}`, this.library);
        }
        if ((0, type_guards_1.isArtifactType)(artifactOrOptions)) {
            return this._libraryFromArtifact(libraryName, artifactOrOptions, options);
        }
        return this._namedArtifactLibrary(libraryName, artifactOrOptions);
    }
    _namedArtifactLibrary(libraryName, options = {}) {
        const futureId = (0, future_id_builders_1.toContractFutureId)(this._module.id, options.id, libraryName);
        options.libraries ??= {};
        /* validation start */
        this._assertValidId(options.id, this.library);
        this._assertValidContractName(libraryName, this.library);
        this._assertUniqueFutureId(futureId, options.id, this.library);
        this._assertValidLibraries(options.libraries, this.library);
        this._assertValidFrom(options.from, this.library);
        /* validation end */
        const future = new module_2.NamedLibraryDeploymentFutureImplementation(futureId, this._module, libraryName, options.libraries, options.from);
        for (const afterFuture of options.after ?? []) {
            future.dependencies.add(afterFuture);
        }
        for (const libraryFuture of Object.values(options.libraries)) {
            future.dependencies.add(libraryFuture);
        }
        this._module.futures.add(future);
        this._futureIds.add(futureId);
        return future;
    }
    _libraryFromArtifact(libraryName, artifact, options = {}) {
        const futureId = (0, future_id_builders_1.toContractFutureId)(this._module.id, options.id, libraryName);
        options.libraries ??= {};
        /* validation start */
        this._assertValidId(options.id, this.library);
        this._assertValidContractName(libraryName, this.library);
        this._assertUniqueFutureId(futureId, options.id, this.library);
        this._assertValidLibraries(options.libraries, this.library);
        this._assertValidFrom(options.from, this.library);
        this._assertValidArtifact(artifact, this.library);
        /* validation end */
        const future = new module_2.ArtifactLibraryDeploymentFutureImplementation(futureId, this._module, libraryName, artifact, options.libraries, options.from);
        for (const afterFuture of options.after ?? []) {
            future.dependencies.add(afterFuture);
        }
        for (const libraryFuture of Object.values(options.libraries)) {
            future.dependencies.add(libraryFuture);
        }
        this._module.futures.add(future);
        this._futureIds.add(futureId);
        return future;
    }
    call(contractFuture, functionName, args = [], options = {}) {
        if (!Array.isArray(args)) {
            this._throwErrorWithStackTrace(`Invalid parameter "args" provided to call "${functionName}" in module "${this._module.id}"`, this.call);
        }
        if (typeof options !== "object") {
            this._throwErrorWithStackTrace(`Invalid parameter "options" provided to call "${functionName}" in module "${this._module.id}"`, this.call);
        }
        const futureId = (0, future_id_builders_1.toCallFutureId)(this._module.id, options.id, contractFuture.module.id, contractFuture.id, functionName);
        options.value ??= BigInt(0);
        /* validation start */
        this._assertValidId(options.id, this.call);
        this._assertValidFunctionName(functionName, this.call);
        this._assertUniqueFutureId(futureId, options.id, this.call);
        this._assertValidValue(options.value, this.call);
        this._assertValidFrom(options.from, this.call);
        this._assertValidCallableContract(contractFuture, this.call);
        /* validation end */
        const future = new module_2.NamedContractCallFutureImplementation(futureId, this._module, functionName, contractFuture, args, options.value, options.from);
        future.dependencies.add(contractFuture);
        if ((0, type_guards_1.isFuture)(options.value)) {
            future.dependencies.add(options.value);
        }
        for (const arg of (0, utils_1.resolveArgsToFutures)(args)) {
            future.dependencies.add(arg);
        }
        for (const afterFuture of options.after ?? []) {
            future.dependencies.add(afterFuture);
        }
        this._module.futures.add(future);
        this._futureIds.add(futureId);
        return future;
    }
    staticCall(contractFuture, functionName, args = [], nameOrIndex = 0, options = {}) {
        if (!Array.isArray(args)) {
            this._throwErrorWithStackTrace(`Invalid parameter "args" provided to staticCall "${functionName}" in module "${this._module.id}"`, this.staticCall);
        }
        if (typeof options !== "object") {
            this._throwErrorWithStackTrace(`Invalid parameter "options" provided to staticCall "${functionName}" in module "${this._module.id}"`, this.staticCall);
        }
        const futureId = (0, future_id_builders_1.toCallFutureId)(this._module.id, options.id, contractFuture.module.id, contractFuture.id, functionName);
        /* validation start */
        this._assertValidId(options.id, this.staticCall);
        this._assertValidFunctionName(functionName, this.staticCall);
        this._assertValidNameOrIndex(nameOrIndex, this.staticCall);
        this._assertUniqueFutureId(futureId, options.id, this.staticCall);
        this._assertValidFrom(options.from, this.staticCall);
        this._assertValidCallableContract(contractFuture, this.staticCall);
        /* validation end */
        const future = new module_2.NamedStaticCallFutureImplementation(futureId, this._module, functionName, contractFuture, args, nameOrIndex, options.from);
        future.dependencies.add(contractFuture);
        for (const arg of (0, utils_1.resolveArgsToFutures)(args)) {
            future.dependencies.add(arg);
        }
        for (const afterFuture of options.after ?? []) {
            future.dependencies.add(afterFuture);
        }
        this._module.futures.add(future);
        this._futureIds.add(futureId);
        return future;
    }
    encodeFunctionCall(contractFuture, functionName, args = [], options = {}) {
        if (!Array.isArray(args)) {
            this._throwErrorWithStackTrace(`Invalid parameter "args" provided to encodeFunctionCall "${functionName}" in module "${this._module.id}"`, this.encodeFunctionCall);
        }
        if (typeof options !== "object") {
            this._throwErrorWithStackTrace(`Invalid parameter "options" provided to encodeFunctionCall "${functionName}" in module "${this._module.id}"`, this.encodeFunctionCall);
        }
        const futureId = (0, future_id_builders_1.toEncodeFunctionCallFutureId)(this._module.id, options.id, contractFuture.module.id, contractFuture.id, functionName);
        /* validation start */
        this._assertValidId(options.id, this.encodeFunctionCall);
        this._assertValidFunctionName(functionName, this.encodeFunctionCall);
        this._assertUniqueFutureId(futureId, options.id, this.encodeFunctionCall);
        this._assertValidCallableContract(contractFuture, this.encodeFunctionCall);
        /* validation end */
        const future = new module_2.NamedEncodeFunctionCallFutureImplementation(futureId, this._module, functionName, contractFuture, args);
        future.dependencies.add(contractFuture);
        for (const arg of (0, utils_1.resolveArgsToFutures)(args)) {
            future.dependencies.add(arg);
        }
        for (const afterFuture of options.after ?? []) {
            future.dependencies.add(afterFuture);
        }
        this._module.futures.add(future);
        this._futureIds.add(futureId);
        return future;
    }
    contractAt(contractName, addressOrArtifact, optionsOrAddress, options) {
        if (typeof contractName !== "string") {
            this._throwErrorWithStackTrace(`Contract name must be a string, received ${typeof contractName}`, this.contractAt);
        }
        if ((0, type_guards_1.isArtifactType)(addressOrArtifact)) {
            if (!(typeof optionsOrAddress === "string" ||
                (0, type_guards_1.isFuture)(optionsOrAddress) ||
                (0, type_guards_1.isModuleParameterRuntimeValue)(optionsOrAddress))) {
                this._throwErrorWithStackTrace(`Invalid parameter "address" provided to contractAt "${contractName}" in module "${this._module.id}"`, this.contractAt);
            }
            return this._contractAtFromArtifact(contractName, addressOrArtifact, optionsOrAddress, options);
        }
        return this._namedArtifactContractAt(contractName, addressOrArtifact, optionsOrAddress);
    }
    _namedArtifactContractAt(contractName, address, options = {}) {
        const futureId = (0, future_id_builders_1.toContractFutureId)(this._module.id, options.id, contractName);
        /* validation start */
        this._assertValidId(options.id, this.contractAt);
        this._assertValidContractName(contractName, this.contractAt);
        this._assertUniqueFutureId(futureId, options.id, this.contractAt);
        this._assertValidAddress(address, this.contractAt);
        /* validation end */
        const future = new module_2.NamedContractAtFutureImplementation(futureId, this._module, contractName, address);
        for (const afterFuture of options.after ?? []) {
            future.dependencies.add(afterFuture);
        }
        if ((0, type_guards_1.isFuture)(address)) {
            future.dependencies.add(address);
        }
        this._module.futures.add(future);
        this._futureIds.add(futureId);
        return future;
    }
    _contractAtFromArtifact(contractName, artifact, address, options = {}) {
        const futureId = (0, future_id_builders_1.toContractFutureId)(this._module.id, options.id, contractName);
        /* validation start */
        this._assertValidId(options.id, this.contractAt);
        this._assertValidContractName(contractName, this.contractAt);
        this._assertUniqueFutureId(futureId, options.id, this.contractAt);
        this._assertValidAddress(address, this.contractAt);
        this._assertValidArtifact(artifact, this.contractAt);
        /* validation end */
        const future = new module_2.ArtifactContractAtFutureImplementation(futureId, this._module, contractName, address, artifact);
        for (const afterFuture of options.after ?? []) {
            future.dependencies.add(afterFuture);
        }
        if ((0, type_guards_1.isFuture)(address)) {
            future.dependencies.add(address);
        }
        this._module.futures.add(future);
        this._futureIds.add(futureId);
        return future;
    }
    readEventArgument(futureToReadFrom, eventName, nameOrIndex, options = {}) {
        if (typeof options !== "object") {
            this._throwErrorWithStackTrace(`Invalid parameter "options" provided to readEventArgument "${eventName}" in module "${this._module.id}"`, this.readEventArgument);
        }
        const eventIndex = options.eventIndex ?? 0;
        if (futureToReadFrom.type === module_1.FutureType.SEND_DATA &&
            options.emitter === undefined) {
            throw new errors_1.IgnitionError(errors_list_1.ERRORS.VALIDATION.MISSING_EMITTER);
        }
        const contractToReadFrom = "contract" in futureToReadFrom
            ? futureToReadFrom.contract
            : futureToReadFrom;
        const emitter = options.emitter ?? contractToReadFrom;
        const futureId = (0, future_id_builders_1.toReadEventArgumentFutureId)(this._module.id, options.id, emitter.contractName, eventName, nameOrIndex, eventIndex);
        /* validation start */
        this._assertValidId(options.id, this.readEventArgument);
        this._assertValidEventName(eventName, this.readEventArgument);
        this._assertValidNameOrIndex(nameOrIndex, this.readEventArgument);
        this._assertUniqueFutureId(futureId, options.id, this.readEventArgument);
        /* validation end */
        const future = new module_2.ReadEventArgumentFutureImplementation(futureId, this._module, futureToReadFrom, eventName, nameOrIndex, emitter, eventIndex);
        future.dependencies.add(futureToReadFrom);
        if (options.emitter !== undefined) {
            future.dependencies.add(options.emitter);
        }
        this._module.futures.add(future);
        this._futureIds.add(futureId);
        return future;
    }
    send(id, to, value, data, options = {}) {
        if (typeof options !== "object") {
            this._throwErrorWithStackTrace(`Invalid parameter "options" provided to send "${id}" in module "${this._module.id}"`, this.send);
        }
        const futureId = (0, future_id_builders_1.toSendDataFutureId)(this._module.id, id);
        const val = value ?? BigInt(0);
        /* validation start */
        this._assertValidId(id, this.send);
        this._assertUniqueFutureId(futureId, id, this.send);
        this._assertValidAddress(to, this.send);
        this._assertValidValue(val, this.send);
        this._assertValidData(data, this.send);
        this._assertValidFrom(options.from, this.send);
        this._assertUniqueToAndFrom(to, options.from, this.send);
        /* validation end */
        const future = new module_2.SendDataFutureImplementation(futureId, this._module, to, val, data, options.from);
        if ((0, type_guards_1.isFuture)(to)) {
            future.dependencies.add(to);
        }
        if ((0, type_guards_1.isFuture)(data)) {
            future.dependencies.add(data);
        }
        for (const afterFuture of options.after ?? []) {
            future.dependencies.add(afterFuture);
        }
        this._module.futures.add(future);
        this._futureIds.add(futureId);
        return future;
    }
    useModule(ignitionSubmodule) {
        (0, assertions_1.assertIgnitionInvariant)(ignitionSubmodule !== undefined, "Trying to use `undefined` as submodule. Make sure you don't have a circular dependency of modules.");
        // Some things that should be done here:
        //   - Keep track of the submodule
        //   - return the submodule's results
        //
        this._module.submodules.add(ignitionSubmodule);
        return ignitionSubmodule.results;
    }
    _throwErrorWithStackTrace(message, func) {
        const validationError = new errors_1.IgnitionError(errors_list_1.ERRORS.VALIDATION.INVALID_MODULE, { message });
        // Improve the stack trace to stop on module api level
        Error.captureStackTrace(validationError, func);
        throw validationError;
    }
    _assertValidId(id, func) {
        if (id === undefined) {
            return;
        }
        if ((0, identifier_validators_1.isValidIgnitionIdentifier)(id)) {
            return;
        }
        this._throwErrorWithStackTrace(`The id "${id}" is invalid. Ids can only contain alphanumerics or underscores, and they must start with an alphanumeric character.`, func);
    }
    _assertValidContractName(contractName, func) {
        if ((0, identifier_validators_1.isValidContractName)(contractName)) {
            return;
        }
        this._throwErrorWithStackTrace(`The contract name "${contractName}" is invalid.`, func);
    }
    _assertValidEventName(eventName, func) {
        if ((0, identifier_validators_1.isValidFunctionOrEventName)(eventName)) {
            return;
        }
        this._throwErrorWithStackTrace(`The event name "${eventName}" is invalid, make sure you use a valid identifier.`, func);
    }
    _assertValidFunctionName(functionName, func) {
        if ((0, identifier_validators_1.isValidFunctionOrEventName)(functionName)) {
            return;
        }
        this._throwErrorWithStackTrace(`The function name "${functionName}" is invalid, make sure you use a valid identifier.`, func);
    }
    _assertUniqueFutureId(futureId, userProvidedId, futureConstructor) {
        if (!this._futureIds.has(futureId)) {
            return;
        }
        if (userProvidedId !== undefined) {
            this._throwErrorWithStackTrace(`The future id "${userProvidedId}" is already used, please provide a different one.`, futureConstructor);
        }
        this._throwErrorWithStackTrace(`The autogenerated future id ("${futureId}") is already used. Please provide a unique id, as shown below:

m.${futureConstructor.name}(..., { id: "MyUniqueId"})`, futureConstructor);
    }
    _assertValidLibraries(libraries, func) {
        for (const [libraryName, libraryFuture] of Object.entries(libraries)) {
            if (!(0, type_guards_1.isContractFuture)(libraryFuture)) {
                this._throwErrorWithStackTrace(`The value you provided for the library '${libraryName}' is not a valid Future or it doesn't represent a contract`, func);
            }
        }
    }
    _assertValidValue(value, func) {
        if (!(0, type_guards_1.isReadEventArgumentFuture)(value) &&
            !(0, type_guards_1.isNamedStaticCallFuture)(value) &&
            !(0, type_guards_1.isModuleParameterRuntimeValue)(value) &&
            typeof value !== "bigint") {
            this._throwErrorWithStackTrace(`Invalid option "value" received. It should be a bigint, a module parameter, or a value obtained from an event or static call.`, func);
        }
    }
    _assertValidFrom(from, func) {
        if (!(0, type_guards_1.isAccountRuntimeValue)(from) &&
            typeof from !== "string" &&
            from !== undefined) {
            this._throwErrorWithStackTrace(`Invalid type for option "from": ${typeof from}`, func);
        }
    }
    _assertValidArtifact(artifact, func) {
        if ((0, type_guards_1.isArtifactType)(artifact)) {
            return;
        }
        this._throwErrorWithStackTrace(`Invalid artifact given`, func);
    }
    _assertValidCallableContract(contract, func) {
        if ((0, type_guards_1.isCallableContractFuture)(contract)) {
            return;
        }
        this._throwErrorWithStackTrace(`Invalid contract given`, func);
    }
    _assertValidNameOrIndex(nameOrIndex, func) {
        if (typeof nameOrIndex !== "string" && typeof nameOrIndex !== "number") {
            this._throwErrorWithStackTrace(`Invalid nameOrIndex given`, func);
        }
        if (typeof nameOrIndex === "number") {
            return;
        }
        if ((0, identifier_validators_1.isValidSolidityIdentifier)(nameOrIndex)) {
            return;
        }
        this._throwErrorWithStackTrace(`The argument "${nameOrIndex}" is expected to have a valid name, but it's invalid.`, func);
    }
    _assertValidAddress(address, func) {
        if (typeof address === "string" && !(0, address_1.isAddress)(address)) {
            return this._throwErrorWithStackTrace(`Invalid address given`, func);
        }
        if (typeof address !== "string" &&
            !(0, type_guards_1.isModuleParameterRuntimeValue)(address) &&
            !(0, type_guards_1.isAccountRuntimeValue)(address) &&
            !(0, type_guards_1.isAddressResolvableFuture)(address)) {
            return this._throwErrorWithStackTrace(`Invalid address given`, func);
        }
    }
    _assertValidData(data, func) {
        if (typeof data !== "string" &&
            data !== undefined &&
            !(0, type_guards_1.isEncodeFunctionCallFuture)(data)) {
            this._throwErrorWithStackTrace(`Invalid data given`, func);
        }
    }
    _assertUniqueToAndFrom(to, from, func) {
        if (typeof to === "string" &&
            typeof from === "string" &&
            (0, address_1.equalAddresses)(to, from)) {
            this._throwErrorWithStackTrace(`The "to" and "from" addresses are the same`, func);
        }
        else if ((0, type_guards_1.isAccountRuntimeValue)(to) &&
            (0, type_guards_1.isAccountRuntimeValue)(from) &&
            to.accountIndex === from.accountIndex) {
            this._throwErrorWithStackTrace(`The "to" and "from" addresses are the same`, func);
        }
    }
}
//# sourceMappingURL=module-builder.js.map