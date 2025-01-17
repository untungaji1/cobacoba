"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IgnitionModuleDeserializer = exports.IgnitionModuleSerializer = void 0;
const errors_1 = require("./errors");
const errors_list_1 = require("./internal/errors-list");
const module_1 = require("./internal/module");
const topological_order_1 = require("./internal/topological-order");
const replace_within_arg_1 = require("./internal/utils/replace-within-arg");
const type_guards_1 = require("./type-guards");
const module_2 = require("./types/module");
/**
 * Serialize an Ignition module.
 *
 * @beta
 */
class IgnitionModuleSerializer {
    static serialize(ignitionModule) {
        const argReplacer = (arg) => (0, replace_within_arg_1.replaceWithinArg)(arg, {
            accountRuntimeValue: this._serializeAccountRuntimeValue,
            moduleParameterRuntimeValue: (mprv) => this._serializeModuleParamterRuntimeValue(mprv),
            bigint: this._serializeBigint,
            future: this._convertFutureToFutureToken,
        });
        const allModules = this._getModulesAndSubmoduleFor(ignitionModule);
        return {
            startModule: ignitionModule.id,
            modules: Object.fromEntries(allModules.map((m) => [m.id, this._serializeModule(m, { argReplacer })])),
        };
    }
    static _serializeModule(userModule, context) {
        return {
            id: userModule.id,
            futures: Array.from(userModule.futures).map((future) => this._serializeFuture(future, context)),
            submodules: Array.from(userModule.submodules).map(this._convertModuleToModuleToken),
            results: Object.entries(userModule.results).map(([key, future]) => [
                key,
                this._convertFutureToFutureToken(future),
            ]),
        };
    }
    static _serializeFuture(future, context) {
        switch (future.type) {
            case module_2.FutureType.NAMED_ARTIFACT_CONTRACT_DEPLOYMENT:
                const serializedNamedContractDeploymentFuture = {
                    id: future.id,
                    moduleId: future.module.id,
                    type: future.type,
                    dependencies: Array.from(future.dependencies).map((d) => this._convertFutureToFutureToken(d)),
                    contractName: future.contractName,
                    constructorArgs: future.constructorArgs.map((arg) => context.argReplacer(arg)),
                    from: (0, type_guards_1.isRuntimeValue)(future.from)
                        ? this._serializeAccountRuntimeValue(future.from)
                        : future.from,
                    libraries: this._convertLibrariesToLibraryTokens(future.libraries),
                    value: (0, type_guards_1.isFuture)(future.value)
                        ? this._convertFutureToFutureToken(future.value)
                        : (0, type_guards_1.isRuntimeValue)(future.value)
                            ? this._serializeModuleParamterRuntimeValue(future.value)
                            : this._serializeBigint(future.value),
                };
                return serializedNamedContractDeploymentFuture;
            case module_2.FutureType.CONTRACT_DEPLOYMENT:
                const serializedArtifactContractDeploymentFuture = {
                    id: future.id,
                    moduleId: future.module.id,
                    type: future.type,
                    dependencies: Array.from(future.dependencies).map((d) => this._convertFutureToFutureToken(d)),
                    contractName: future.contractName,
                    artifact: future.artifact,
                    constructorArgs: future.constructorArgs.map((arg) => context.argReplacer(arg)),
                    from: (0, type_guards_1.isRuntimeValue)(future.from)
                        ? this._serializeAccountRuntimeValue(future.from)
                        : future.from,
                    libraries: this._convertLibrariesToLibraryTokens(future.libraries),
                    value: (0, type_guards_1.isFuture)(future.value)
                        ? this._convertFutureToFutureToken(future.value)
                        : (0, type_guards_1.isRuntimeValue)(future.value)
                            ? this._serializeModuleParamterRuntimeValue(future.value)
                            : this._serializeBigint(future.value),
                };
                return serializedArtifactContractDeploymentFuture;
            case module_2.FutureType.NAMED_ARTIFACT_LIBRARY_DEPLOYMENT:
                const serializedNamedLibraryDeploymentFuture = {
                    id: future.id,
                    moduleId: future.module.id,
                    type: future.type,
                    dependencies: Array.from(future.dependencies).map((d) => this._convertFutureToFutureToken(d)),
                    contractName: future.contractName,
                    from: (0, type_guards_1.isRuntimeValue)(future.from)
                        ? this._serializeAccountRuntimeValue(future.from)
                        : future.from,
                    libraries: this._convertLibrariesToLibraryTokens(future.libraries),
                };
                return serializedNamedLibraryDeploymentFuture;
            case module_2.FutureType.LIBRARY_DEPLOYMENT:
                const serializedArtifactLibraryDeploymentFuture = {
                    id: future.id,
                    moduleId: future.module.id,
                    type: future.type,
                    dependencies: Array.from(future.dependencies).map((d) => this._convertFutureToFutureToken(d)),
                    contractName: future.contractName,
                    artifact: future.artifact,
                    from: (0, type_guards_1.isRuntimeValue)(future.from)
                        ? this._serializeAccountRuntimeValue(future.from)
                        : future.from,
                    libraries: this._convertLibrariesToLibraryTokens(future.libraries),
                };
                return serializedArtifactLibraryDeploymentFuture;
            case module_2.FutureType.CONTRACT_CALL:
                const serializedNamedContractCallFuture = {
                    id: future.id,
                    moduleId: future.module.id,
                    type: future.type,
                    dependencies: Array.from(future.dependencies).map((d) => this._convertFutureToFutureToken(d)),
                    contract: this._convertFutureToFutureToken(future.contract),
                    functionName: future.functionName,
                    args: future.args.map((arg) => context.argReplacer(arg)),
                    value: (0, type_guards_1.isFuture)(future.value)
                        ? this._convertFutureToFutureToken(future.value)
                        : (0, type_guards_1.isRuntimeValue)(future.value)
                            ? this._serializeModuleParamterRuntimeValue(future.value)
                            : this._serializeBigint(future.value),
                    from: (0, type_guards_1.isRuntimeValue)(future.from)
                        ? this._serializeAccountRuntimeValue(future.from)
                        : future.from,
                };
                return serializedNamedContractCallFuture;
            case module_2.FutureType.STATIC_CALL:
                const serializedNamedStaticCallFuture = {
                    id: future.id,
                    moduleId: future.module.id,
                    type: future.type,
                    dependencies: Array.from(future.dependencies).map((d) => this._convertFutureToFutureToken(d)),
                    contract: this._convertFutureToFutureToken(future.contract),
                    functionName: future.functionName,
                    args: future.args.map((arg) => context.argReplacer(arg)),
                    nameOrIndex: future.nameOrIndex,
                    from: (0, type_guards_1.isRuntimeValue)(future.from)
                        ? this._serializeAccountRuntimeValue(future.from)
                        : future.from,
                };
                return serializedNamedStaticCallFuture;
            case module_2.FutureType.ENCODE_FUNCTION_CALL:
                const serializedEncodeFunctionCallFuture = {
                    id: future.id,
                    moduleId: future.module.id,
                    type: future.type,
                    dependencies: Array.from(future.dependencies).map((d) => this._convertFutureToFutureToken(d)),
                    contract: this._convertFutureToFutureToken(future.contract),
                    functionName: future.functionName,
                    args: future.args.map((arg) => context.argReplacer(arg)),
                };
                return serializedEncodeFunctionCallFuture;
            case module_2.FutureType.NAMED_ARTIFACT_CONTRACT_AT:
                const serializedNamedContractAtFuture = {
                    id: future.id,
                    moduleId: future.module.id,
                    type: future.type,
                    dependencies: Array.from(future.dependencies).map((d) => this._convertFutureToFutureToken(d)),
                    contractName: future.contractName,
                    address: (0, type_guards_1.isFuture)(future.address)
                        ? this._convertFutureToFutureToken(future.address)
                        : (0, type_guards_1.isRuntimeValue)(future.address) &&
                            future.address.type === module_2.RuntimeValueType.MODULE_PARAMETER
                            ? this._serializeModuleParamterRuntimeValue(future.address)
                            : future.address,
                };
                return serializedNamedContractAtFuture;
            case module_2.FutureType.CONTRACT_AT:
                const serializedArtifactContractAtFuture = {
                    id: future.id,
                    moduleId: future.module.id,
                    type: future.type,
                    dependencies: Array.from(future.dependencies).map((d) => this._convertFutureToFutureToken(d)),
                    contractName: future.contractName,
                    artifact: future.artifact,
                    address: (0, type_guards_1.isFuture)(future.address)
                        ? this._convertFutureToFutureToken(future.address)
                        : (0, type_guards_1.isRuntimeValue)(future.address) &&
                            future.address.type === module_2.RuntimeValueType.MODULE_PARAMETER
                            ? this._serializeModuleParamterRuntimeValue(future.address)
                            : future.address,
                };
                return serializedArtifactContractAtFuture;
            case module_2.FutureType.READ_EVENT_ARGUMENT:
                const serializedReadEventArgumentFuture = {
                    id: future.id,
                    moduleId: future.module.id,
                    type: future.type,
                    dependencies: Array.from(future.dependencies).map((d) => this._convertFutureToFutureToken(d)),
                    futureToReadFrom: this._convertFutureToFutureToken(future.futureToReadFrom),
                    emitter: this._convertFutureToFutureToken(future.emitter),
                    eventName: future.eventName,
                    nameOrIndex: future.nameOrIndex,
                    eventIndex: future.eventIndex,
                };
                return serializedReadEventArgumentFuture;
            case module_2.FutureType.SEND_DATA:
                const serializedSendDataFuture = {
                    id: future.id,
                    moduleId: future.module.id,
                    type: future.type,
                    dependencies: Array.from(future.dependencies).map((d) => this._convertFutureToFutureToken(d)),
                    to: (0, type_guards_1.isFuture)(future.to)
                        ? this._convertFutureToFutureToken(future.to)
                        : (0, type_guards_1.isModuleParameterRuntimeValue)(future.to)
                            ? this._serializeModuleParamterRuntimeValue(future.to)
                            : (0, type_guards_1.isAccountRuntimeValue)(future.to)
                                ? this._serializeAccountRuntimeValue(future.to)
                                : future.to,
                    value: (0, type_guards_1.isRuntimeValue)(future.value)
                        ? this._serializeModuleParamterRuntimeValue(future.value)
                        : this._serializeBigint(future.value),
                    data: (0, type_guards_1.isEncodeFunctionCallFuture)(future.data)
                        ? this._convertFutureToFutureToken(future.data)
                        : future.data,
                    from: (0, type_guards_1.isRuntimeValue)(future.from)
                        ? this._serializeAccountRuntimeValue(future.from)
                        : future.from,
                };
                return serializedSendDataFuture;
        }
    }
    static _convertLibrariesToLibraryTokens(libraries) {
        return Object.entries(libraries).map(([key, lib]) => [
            key,
            this._convertFutureToFutureToken(lib),
        ]);
    }
    static _serializeAccountRuntimeValue(arg) {
        return { _kind: "AccountRuntimeValue", accountIndex: arg.accountIndex };
    }
    static _serializeModuleParamterRuntimeValue(arg) {
        return {
            _kind: "ModuleParameterRuntimeValue",
            moduleId: arg.moduleId,
            name: arg.name,
            defaultValue: arg.defaultValue === undefined
                ? undefined
                : this._jsonStringifyWithBigint(arg.defaultValue),
        };
    }
    static _serializeBigint(n) {
        return { _kind: "bigint", value: n.toString(10) };
    }
    static _jsonStringifyWithBigint(value, prettyPrint = true) {
        return JSON.stringify(value, (_, v) => typeof v === "bigint" ? this._serializeBigint(v) : v, prettyPrint ? 2 : undefined);
    }
    static _convertFutureToFutureToken(future) {
        return {
            futureId: future.id,
            _kind: "FutureToken",
        };
    }
    static _convertModuleToModuleToken(m) {
        return {
            moduleId: m.id,
            _kind: "ModuleToken",
        };
    }
    static _getModulesAndSubmoduleFor(module) {
        return [module].concat(Array.from(module.submodules).flatMap((sm) => this._getModulesAndSubmoduleFor(sm)));
    }
}
exports.IgnitionModuleSerializer = IgnitionModuleSerializer;
/**
 * Deserialize an `IgnitionModule` that was previously serialized using
 * IgnitionModuleSerializer.
 *
 * @beta
 */
class IgnitionModuleDeserializer {
    static deserialize(serializedIgnitionModule) {
        const sortedModules = this._getSerializedModulesInReverseTopologicalOrder(serializedIgnitionModule);
        const modulesLookup = new Map();
        for (const serializedModule of sortedModules) {
            const mod = new module_1.IgnitionModuleImplementation(serializedModule.id, {});
            modulesLookup.set(mod.id, mod);
            for (const submoduleToken of serializedModule.submodules) {
                const submodule = this._lookup(modulesLookup, submoduleToken.moduleId);
                mod.submodules.add(submodule);
            }
        }
        const sortedFutures = this._getSerializedFuturesInReverseTopologicalOrder(serializedIgnitionModule);
        const futuresLookup = new Map();
        const contractFuturesLookup = new Map();
        const addressResolvableFutureLookup = new Map();
        for (const serializedFuture of sortedFutures) {
            const future = this._deserializeFuture(serializedFuture, modulesLookup, futuresLookup, contractFuturesLookup, addressResolvableFutureLookup);
            for (const dependencyId of serializedFuture.dependencies) {
                const dependency = this._lookup(futuresLookup, dependencyId.futureId);
                future.dependencies.add(dependency);
            }
            futuresLookup.set(future.id, future);
            if ((0, type_guards_1.isContractFuture)(future)) {
                contractFuturesLookup.set(future.id, future);
            }
            if ((0, type_guards_1.isAddressResolvableFuture)(future)) {
                addressResolvableFutureLookup.set(future.id, future);
            }
        }
        for (const serializedModule of Object.values(serializedIgnitionModule.modules)) {
            const mod = this._lookup(modulesLookup, serializedModule.id);
            for (const [name, futureToken] of serializedModule.results) {
                const contract = this._lookup(contractFuturesLookup, futureToken.futureId);
                mod.results[name] = contract;
            }
            // Add futures to the module in the original order
            for (const futureToken of serializedModule.futures) {
                mod.futures.add(this._lookup(futuresLookup, futureToken.id));
            }
        }
        return this._lookup(modulesLookup, serializedIgnitionModule.startModule);
    }
    static _getSerializedModulesInReverseTopologicalOrder(serializedIgnitionModule) {
        const graph = new Map();
        for (const mod of Object.values(serializedIgnitionModule.modules)) {
            graph.set(mod, new Set());
        }
        for (const mod of Object.values(serializedIgnitionModule.modules)) {
            for (const submodToken of mod.submodules) {
                const submod = serializedIgnitionModule.modules[submodToken.moduleId];
                graph.get(submod).add(mod);
            }
        }
        return (0, topological_order_1.getNodesInTopologicalOrder)(graph);
    }
    static _getSerializedFuturesInReverseTopologicalOrder(serializedIgnitionModule) {
        const serializedFutures = this._getAllFuturesFor(serializedIgnitionModule);
        const serializedFuturesMap = Object.fromEntries(serializedFutures.map((f) => [f.id, f]));
        const graph = new Map();
        for (const serializedFuture of serializedFutures) {
            graph.set(serializedFuture, new Set());
        }
        for (const serializedFuture of serializedFutures) {
            for (const dependencyToken of serializedFuture.dependencies) {
                const dependency = serializedFuturesMap[dependencyToken.futureId];
                graph.get(dependency).add(serializedFuture);
            }
        }
        return (0, topological_order_1.getNodesInTopologicalOrder)(graph);
    }
    static _deserializeArgument(arg, futureLookup) {
        if (this._isSerializedFutureToken(arg)) {
            const swappedFuture = this._lookup(futureLookup, arg.futureId);
            if (swappedFuture === undefined) {
                throw new errors_1.IgnitionError(errors_list_1.ERRORS.SERIALIZATION.INVALID_FUTURE_ID, {
                    futureId: arg.futureId,
                });
            }
            if (swappedFuture.type === module_2.FutureType.CONTRACT_CALL ||
                swappedFuture.type === module_2.FutureType.SEND_DATA) {
                throw new errors_1.IgnitionError(errors_list_1.ERRORS.SERIALIZATION.INVALID_FUTURE_TYPE, {
                    type: module_2.FutureType[swappedFuture.type],
                });
            }
            return swappedFuture;
        }
        if (this._isSerializedAccountRuntimeValue(arg)) {
            return this._deserializeAccountRuntimeValue(arg);
        }
        if (this._isSerializedModuleParameterRuntimeValue(arg)) {
            return this._deserializeModuleParameterRuntimeValue(arg);
        }
        if (this._isSerializedBigInt(arg)) {
            return this._deserializedBigint(arg);
        }
        if (Array.isArray(arg)) {
            return arg.map((a) => this._deserializeArgument(a, futureLookup));
        }
        if (typeof arg === "object" && arg !== null) {
            return Object.fromEntries(Object.entries(arg).map(([k, v]) => [
                k,
                this._deserializeArgument(v, futureLookup),
            ]));
        }
        return arg;
    }
    static _deserializedBigint(n) {
        return BigInt(n.value);
    }
    static _jsonParseWithBigint(jsonString) {
        return JSON.parse(jsonString, (k, v) => {
            if (this._isSerializedBigInt(v)) {
                return this._deserializedBigint(v);
            }
            return v;
        });
    }
    static _isSerializedFutureToken(arg) {
        return (typeof arg === "object" && "_kind" in arg && arg._kind === "FutureToken");
    }
    static _isSerializedBigInt(arg) {
        return typeof arg === "object" && "_kind" in arg && arg._kind === "bigint";
    }
    static _getAllFuturesFor(deployment) {
        return Object.values(deployment.modules).flatMap((m) => Object.values(m.futures));
    }
    static _deserializeFuture(serializedFuture, modulesLookup, futuresLookup, contractFuturesLookup, addressResolvableFutureLookup) {
        const mod = this._lookup(modulesLookup, serializedFuture.moduleId);
        switch (serializedFuture.type) {
            case module_2.FutureType.NAMED_ARTIFACT_CONTRACT_DEPLOYMENT:
                return new module_1.NamedContractDeploymentFutureImplementation(serializedFuture.id, mod, serializedFuture.contractName, serializedFuture.constructorArgs.map((arg) => this._deserializeArgument(arg, futuresLookup)), Object.fromEntries(serializedFuture.libraries.map(([name, lib]) => [
                    name,
                    this._lookup(contractFuturesLookup, lib.futureId),
                ])), this._isSerializedFutureToken(serializedFuture.value)
                    ? this._lookup(futuresLookup, serializedFuture.value.futureId)
                    : this._isSerializedModuleParameterRuntimeValue(serializedFuture.value)
                        ? this._deserializeModuleParameterRuntimeValue(serializedFuture.value) // This is unsafe, but we only serialize valid values
                        : this._deserializedBigint(serializedFuture.value), this._isSerializedAccountRuntimeValue(serializedFuture.from)
                    ? this._deserializeAccountRuntimeValue(serializedFuture.from)
                    : serializedFuture.from);
            case module_2.FutureType.CONTRACT_DEPLOYMENT:
                return new module_1.ArtifactContractDeploymentFutureImplementation(serializedFuture.id, mod, serializedFuture.contractName, serializedFuture.constructorArgs.map((arg) => this._deserializeArgument(arg, futuresLookup)), serializedFuture.artifact, Object.fromEntries(serializedFuture.libraries.map(([name, lib]) => [
                    name,
                    this._lookup(contractFuturesLookup, lib.futureId),
                ])), this._isSerializedFutureToken(serializedFuture.value)
                    ? this._lookup(futuresLookup, serializedFuture.value.futureId)
                    : this._isSerializedModuleParameterRuntimeValue(serializedFuture.value)
                        ? this._deserializeModuleParameterRuntimeValue(serializedFuture.value) // This is unsafe, but we only serialize valid values
                        : this._deserializedBigint(serializedFuture.value), this._isSerializedAccountRuntimeValue(serializedFuture.from)
                    ? this._deserializeAccountRuntimeValue(serializedFuture.from)
                    : serializedFuture.from);
            case module_2.FutureType.NAMED_ARTIFACT_LIBRARY_DEPLOYMENT:
                return new module_1.NamedLibraryDeploymentFutureImplementation(serializedFuture.id, mod, serializedFuture.contractName, Object.fromEntries(serializedFuture.libraries.map(([name, lib]) => [
                    name,
                    this._lookup(contractFuturesLookup, lib.futureId),
                ])), this._isSerializedAccountRuntimeValue(serializedFuture.from)
                    ? this._deserializeAccountRuntimeValue(serializedFuture.from)
                    : serializedFuture.from);
            case module_2.FutureType.LIBRARY_DEPLOYMENT:
                return new module_1.ArtifactLibraryDeploymentFutureImplementation(serializedFuture.id, mod, serializedFuture.contractName, serializedFuture.artifact, Object.fromEntries(serializedFuture.libraries.map(([name, lib]) => [
                    name,
                    this._lookup(contractFuturesLookup, lib.futureId),
                ])), this._isSerializedAccountRuntimeValue(serializedFuture.from)
                    ? this._deserializeAccountRuntimeValue(serializedFuture.from)
                    : serializedFuture.from);
            case module_2.FutureType.CONTRACT_CALL:
                return new module_1.NamedContractCallFutureImplementation(serializedFuture.id, mod, serializedFuture.functionName, this._lookup(contractFuturesLookup, serializedFuture.contract.futureId), serializedFuture.args.map((arg) => this._deserializeArgument(arg, futuresLookup)), this._isSerializedFutureToken(serializedFuture.value)
                    ? this._lookup(futuresLookup, serializedFuture.value.futureId)
                    : this._isSerializedModuleParameterRuntimeValue(serializedFuture.value)
                        ? this._deserializeModuleParameterRuntimeValue(serializedFuture.value) // This is unsafe, but we only serialize valid values
                        : this._deserializedBigint(serializedFuture.value), this._isSerializedAccountRuntimeValue(serializedFuture.from)
                    ? this._deserializeAccountRuntimeValue(serializedFuture.from)
                    : serializedFuture.from);
            case module_2.FutureType.STATIC_CALL:
                return new module_1.NamedStaticCallFutureImplementation(serializedFuture.id, mod, serializedFuture.functionName, this._lookup(contractFuturesLookup, serializedFuture.contract.futureId), serializedFuture.args.map((arg) => this._deserializeArgument(arg, futuresLookup)), serializedFuture.nameOrIndex, this._isSerializedAccountRuntimeValue(serializedFuture.from)
                    ? this._deserializeAccountRuntimeValue(serializedFuture.from)
                    : serializedFuture.from);
            case module_2.FutureType.ENCODE_FUNCTION_CALL:
                return new module_1.NamedEncodeFunctionCallFutureImplementation(serializedFuture.id, mod, serializedFuture.functionName, this._lookup(contractFuturesLookup, serializedFuture.contract.futureId), serializedFuture.args.map((arg) => this._deserializeArgument(arg, futuresLookup)));
            case module_2.FutureType.NAMED_ARTIFACT_CONTRACT_AT:
                return new module_1.NamedContractAtFutureImplementation(serializedFuture.id, mod, serializedFuture.contractName, this._isSerializedFutureToken(serializedFuture.address)
                    ? this._lookup(addressResolvableFutureLookup, serializedFuture.address.futureId)
                    : this._isSerializedModuleParameterRuntimeValue(serializedFuture.address)
                        ? this._deserializeModuleParameterRuntimeValue(serializedFuture.address) // This is unsafe, but we only serialize valid values
                        : serializedFuture.address);
            case module_2.FutureType.CONTRACT_AT:
                return new module_1.ArtifactContractAtFutureImplementation(serializedFuture.id, mod, serializedFuture.contractName, this._isSerializedFutureToken(serializedFuture.address)
                    ? this._lookup(addressResolvableFutureLookup, serializedFuture.address.futureId)
                    : this._isSerializedModuleParameterRuntimeValue(serializedFuture.address)
                        ? this._deserializeModuleParameterRuntimeValue(serializedFuture.address) // This is unsafe, but we only serialize valid values
                        : serializedFuture.address, serializedFuture.artifact);
            case module_2.FutureType.READ_EVENT_ARGUMENT:
                return new module_1.ReadEventArgumentFutureImplementation(serializedFuture.id, mod, this._lookup(futuresLookup, serializedFuture.futureToReadFrom.futureId), serializedFuture.eventName, serializedFuture.nameOrIndex, this._lookup(contractFuturesLookup, serializedFuture.emitter.futureId), serializedFuture.eventIndex);
            case module_2.FutureType.SEND_DATA:
                return new module_1.SendDataFutureImplementation(serializedFuture.id, mod, this._isSerializedFutureToken(serializedFuture.to)
                    ? this._lookup(addressResolvableFutureLookup, serializedFuture.to.futureId)
                    : this._isSerializedModuleParameterRuntimeValue(serializedFuture.to)
                        ? this._deserializeModuleParameterRuntimeValue(serializedFuture.to) // This is unsafe, but we only serialize valid values
                        : this._isSerializedAccountRuntimeValue(serializedFuture.to)
                            ? this._deserializeAccountRuntimeValue(serializedFuture.to)
                            : serializedFuture.to, this._isSerializedModuleParameterRuntimeValue(serializedFuture.value)
                    ? this._deserializeModuleParameterRuntimeValue(serializedFuture.value) // This is unsafe, but we only serialize valid values
                    : this._deserializedBigint(serializedFuture.value), serializedFuture.data === undefined ||
                    typeof serializedFuture.data === "string"
                    ? serializedFuture.data
                    : this._lookup(futuresLookup, serializedFuture.data.futureId), this._isSerializedAccountRuntimeValue(serializedFuture.from)
                    ? this._deserializeAccountRuntimeValue(serializedFuture.from)
                    : serializedFuture.from);
        }
    }
    static _lookup(lookupTable, key) {
        const value = lookupTable.get(key);
        if (value === undefined) {
            throw new errors_1.IgnitionError(errors_list_1.ERRORS.SERIALIZATION.LOOKAHEAD_NOT_FOUND, {
                key,
            });
        }
        return value;
    }
    static _isSerializedAccountRuntimeValue(v) {
        return (v instanceof Object && "_kind" in v && v._kind === "AccountRuntimeValue");
    }
    static _deserializeAccountRuntimeValue(serialized) {
        return new module_1.AccountRuntimeValueImplementation(serialized.accountIndex);
    }
    static _isSerializedModuleParameterRuntimeValue(v) {
        return (v instanceof Object &&
            "_kind" in v &&
            v._kind === "ModuleParameterRuntimeValue");
    }
    static _deserializeModuleParameterRuntimeValue(serialized) {
        let defaultValue;
        if (serialized.defaultValue !== undefined) {
            // We cast here because we receive an `unknown`, but we known it came from
            // serializing a ModuleParameterType
            const parsedDefaultValue = this._jsonParseWithBigint(serialized.defaultValue);
            if (typeof parsedDefaultValue === "object" &&
                parsedDefaultValue !== null &&
                "accountIndex" in parsedDefaultValue &&
                typeof parsedDefaultValue.accountIndex === "number") {
                defaultValue = new module_1.AccountRuntimeValueImplementation(parsedDefaultValue.accountIndex);
            }
            else {
                defaultValue = parsedDefaultValue;
            }
        }
        return new module_1.ModuleParameterRuntimeValueImplementation(serialized.moduleId, serialized.name, defaultValue);
    }
}
exports.IgnitionModuleDeserializer = IgnitionModuleDeserializer;
//# sourceMappingURL=ignition-module-serializer.js.map