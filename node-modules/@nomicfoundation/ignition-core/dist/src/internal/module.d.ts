import { Artifact } from "../types/artifact";
import { AccountRuntimeValue, AddressResolvableFuture, ArgumentType, ContractAtFuture, ContractDeploymentFuture, LibraryDeploymentFuture, ContractFuture, Future, FutureType, IgnitionModule, IgnitionModuleResult, ModuleParameterRuntimeValue, ModuleParameterType, NamedArtifactContractAtFuture, ContractCallFuture, NamedArtifactContractDeploymentFuture, NamedArtifactLibraryDeploymentFuture, StaticCallFuture, ReadEventArgumentFuture, RuntimeValueType, SendDataFuture, EncodeFunctionCallFuture } from "../types/module";
declare const customInspectSymbol: unique symbol;
declare abstract class BaseFutureImplementation<FutureTypeT extends FutureType> {
    readonly id: string;
    readonly type: FutureTypeT;
    readonly module: IgnitionModuleImplementation;
    readonly dependencies: Set<Future>;
    constructor(id: string, type: FutureTypeT, module: IgnitionModuleImplementation);
    [customInspectSymbol](_depth: number, { inspect }: {
        inspect: (arg: {}) => string;
    }): string;
}
export declare class NamedContractDeploymentFutureImplementation<ContractNameT extends string> extends BaseFutureImplementation<FutureType.NAMED_ARTIFACT_CONTRACT_DEPLOYMENT> implements NamedArtifactContractDeploymentFuture<ContractNameT> {
    readonly id: string;
    readonly module: IgnitionModuleImplementation;
    readonly contractName: ContractNameT;
    readonly constructorArgs: ArgumentType[];
    readonly libraries: Record<string, ContractFuture<string>>;
    readonly value: bigint | ModuleParameterRuntimeValue<bigint> | StaticCallFuture<string, string> | ReadEventArgumentFuture;
    readonly from: string | AccountRuntimeValue | undefined;
    constructor(id: string, module: IgnitionModuleImplementation, contractName: ContractNameT, constructorArgs: ArgumentType[], libraries: Record<string, ContractFuture<string>>, value: bigint | ModuleParameterRuntimeValue<bigint> | StaticCallFuture<string, string> | ReadEventArgumentFuture, from: string | AccountRuntimeValue | undefined);
}
export declare class ArtifactContractDeploymentFutureImplementation<ContractNameT extends string> extends BaseFutureImplementation<FutureType.CONTRACT_DEPLOYMENT> implements ContractDeploymentFuture {
    readonly id: string;
    readonly module: IgnitionModuleImplementation;
    readonly contractName: ContractNameT;
    readonly constructorArgs: ArgumentType[];
    readonly artifact: Artifact;
    readonly libraries: Record<string, ContractFuture<string>>;
    readonly value: bigint | ModuleParameterRuntimeValue<bigint> | StaticCallFuture<string, string> | ReadEventArgumentFuture;
    readonly from: string | AccountRuntimeValue | undefined;
    constructor(id: string, module: IgnitionModuleImplementation, contractName: ContractNameT, constructorArgs: ArgumentType[], artifact: Artifact, libraries: Record<string, ContractFuture<string>>, value: bigint | ModuleParameterRuntimeValue<bigint> | StaticCallFuture<string, string> | ReadEventArgumentFuture, from: string | AccountRuntimeValue | undefined);
}
export declare class NamedLibraryDeploymentFutureImplementation<LibraryNameT extends string> extends BaseFutureImplementation<FutureType.NAMED_ARTIFACT_LIBRARY_DEPLOYMENT> implements NamedArtifactLibraryDeploymentFuture<LibraryNameT> {
    readonly id: string;
    readonly module: IgnitionModuleImplementation;
    readonly contractName: LibraryNameT;
    readonly libraries: Record<string, ContractFuture<string>>;
    readonly from: string | AccountRuntimeValue | undefined;
    constructor(id: string, module: IgnitionModuleImplementation, contractName: LibraryNameT, libraries: Record<string, ContractFuture<string>>, from: string | AccountRuntimeValue | undefined);
}
export declare class ArtifactLibraryDeploymentFutureImplementation<LibraryNameT extends string> extends BaseFutureImplementation<FutureType.LIBRARY_DEPLOYMENT> implements LibraryDeploymentFuture {
    readonly id: string;
    readonly module: IgnitionModuleImplementation;
    readonly contractName: LibraryNameT;
    readonly artifact: Artifact;
    readonly libraries: Record<string, ContractFuture<string>>;
    readonly from: string | AccountRuntimeValue | undefined;
    constructor(id: string, module: IgnitionModuleImplementation, contractName: LibraryNameT, artifact: Artifact, libraries: Record<string, ContractFuture<string>>, from: string | AccountRuntimeValue | undefined);
}
export declare class NamedContractCallFutureImplementation<ContractNameT extends string, FunctionNameT extends string> extends BaseFutureImplementation<FutureType.CONTRACT_CALL> implements ContractCallFuture<ContractNameT, FunctionNameT> {
    readonly id: string;
    readonly module: IgnitionModuleImplementation;
    readonly functionName: FunctionNameT;
    readonly contract: ContractFuture<ContractNameT>;
    readonly args: ArgumentType[];
    readonly value: bigint | ModuleParameterRuntimeValue<bigint> | StaticCallFuture<string, string> | ReadEventArgumentFuture;
    readonly from: string | AccountRuntimeValue | undefined;
    constructor(id: string, module: IgnitionModuleImplementation, functionName: FunctionNameT, contract: ContractFuture<ContractNameT>, args: ArgumentType[], value: bigint | ModuleParameterRuntimeValue<bigint> | StaticCallFuture<string, string> | ReadEventArgumentFuture, from: string | AccountRuntimeValue | undefined);
}
export declare class NamedStaticCallFutureImplementation<ContractNameT extends string, FunctionNameT extends string> extends BaseFutureImplementation<FutureType.STATIC_CALL> implements StaticCallFuture<ContractNameT, FunctionNameT> {
    readonly id: string;
    readonly module: IgnitionModuleImplementation;
    readonly functionName: FunctionNameT;
    readonly contract: ContractFuture<ContractNameT>;
    readonly args: ArgumentType[];
    readonly nameOrIndex: string | number;
    readonly from: string | AccountRuntimeValue | undefined;
    constructor(id: string, module: IgnitionModuleImplementation, functionName: FunctionNameT, contract: ContractFuture<ContractNameT>, args: ArgumentType[], nameOrIndex: string | number, from: string | AccountRuntimeValue | undefined);
}
export declare class NamedEncodeFunctionCallFutureImplementation<ContractNameT extends string, FunctionNameT extends string> extends BaseFutureImplementation<FutureType.ENCODE_FUNCTION_CALL> implements EncodeFunctionCallFuture<ContractNameT, FunctionNameT> {
    readonly id: string;
    readonly module: IgnitionModuleImplementation;
    readonly functionName: FunctionNameT;
    readonly contract: ContractFuture<ContractNameT>;
    readonly args: ArgumentType[];
    constructor(id: string, module: IgnitionModuleImplementation, functionName: FunctionNameT, contract: ContractFuture<ContractNameT>, args: ArgumentType[]);
}
export declare class NamedContractAtFutureImplementation<ContractNameT extends string> extends BaseFutureImplementation<FutureType.NAMED_ARTIFACT_CONTRACT_AT> implements NamedArtifactContractAtFuture<ContractNameT> {
    readonly id: string;
    readonly module: IgnitionModuleImplementation;
    readonly contractName: ContractNameT;
    readonly address: string | AddressResolvableFuture | ModuleParameterRuntimeValue<string>;
    constructor(id: string, module: IgnitionModuleImplementation, contractName: ContractNameT, address: string | AddressResolvableFuture | ModuleParameterRuntimeValue<string>);
}
export declare class ArtifactContractAtFutureImplementation extends BaseFutureImplementation<FutureType.CONTRACT_AT> implements ContractAtFuture {
    readonly id: string;
    readonly module: IgnitionModuleImplementation;
    readonly contractName: string;
    readonly address: string | AddressResolvableFuture | ModuleParameterRuntimeValue<string>;
    readonly artifact: Artifact;
    constructor(id: string, module: IgnitionModuleImplementation, contractName: string, address: string | AddressResolvableFuture | ModuleParameterRuntimeValue<string>, artifact: Artifact);
}
export declare class ReadEventArgumentFutureImplementation extends BaseFutureImplementation<FutureType.READ_EVENT_ARGUMENT> implements ReadEventArgumentFuture {
    readonly id: string;
    readonly module: IgnitionModuleImplementation;
    readonly futureToReadFrom: NamedArtifactContractDeploymentFuture<string> | ContractDeploymentFuture | SendDataFuture | ContractCallFuture<string, string>;
    readonly eventName: string;
    readonly nameOrIndex: string | number;
    readonly emitter: ContractFuture<string>;
    readonly eventIndex: number;
    constructor(id: string, module: IgnitionModuleImplementation, futureToReadFrom: NamedArtifactContractDeploymentFuture<string> | ContractDeploymentFuture | SendDataFuture | ContractCallFuture<string, string>, eventName: string, nameOrIndex: string | number, emitter: ContractFuture<string>, eventIndex: number);
}
export declare class SendDataFutureImplementation extends BaseFutureImplementation<FutureType.SEND_DATA> implements SendDataFuture {
    readonly id: string;
    readonly module: IgnitionModuleImplementation;
    readonly to: string | AddressResolvableFuture | ModuleParameterRuntimeValue<string> | AccountRuntimeValue;
    readonly value: bigint | ModuleParameterRuntimeValue<bigint>;
    readonly data: string | EncodeFunctionCallFuture<string, string> | undefined;
    readonly from: string | AccountRuntimeValue | undefined;
    constructor(id: string, module: IgnitionModuleImplementation, to: string | AddressResolvableFuture | ModuleParameterRuntimeValue<string> | AccountRuntimeValue, value: bigint | ModuleParameterRuntimeValue<bigint>, data: string | EncodeFunctionCallFuture<string, string> | undefined, from: string | AccountRuntimeValue | undefined);
}
export declare class IgnitionModuleImplementation<ModuleIdT extends string = string, ContractNameT extends string = string, IgnitionModuleResultsT extends IgnitionModuleResult<ContractNameT> = IgnitionModuleResult<ContractNameT>> implements IgnitionModule<ModuleIdT, ContractNameT, IgnitionModuleResultsT> {
    readonly id: ModuleIdT;
    readonly results: IgnitionModuleResultsT;
    readonly futures: Set<Future>;
    readonly submodules: Set<IgnitionModule>;
    constructor(id: ModuleIdT, results: IgnitionModuleResultsT);
    [customInspectSymbol](_depth: number, { inspect }: {
        inspect: (arg: {}) => string;
    }): string;
}
export declare class AccountRuntimeValueImplementation implements AccountRuntimeValue {
    readonly accountIndex: number;
    readonly type = RuntimeValueType.ACCOUNT;
    constructor(accountIndex: number);
    [customInspectSymbol](_depth: number, _inspectOptions: {
        inspect: (arg: {}) => string;
    }): string;
}
export declare class ModuleParameterRuntimeValueImplementation<ParamTypeT extends ModuleParameterType> implements ModuleParameterRuntimeValue<ParamTypeT> {
    readonly moduleId: string;
    readonly name: string;
    readonly defaultValue: ParamTypeT | undefined;
    readonly type = RuntimeValueType.MODULE_PARAMETER;
    constructor(moduleId: string, name: string, defaultValue: ParamTypeT | undefined);
    [customInspectSymbol](_depth: number, { inspect }: {
        inspect: (arg: {}) => string;
    }): string;
}
export {};
//# sourceMappingURL=module.d.ts.map