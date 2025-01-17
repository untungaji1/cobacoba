/**
 * The type of the contract artifact's ABI.
 *
 * @beta
 */
export declare type Abi = readonly any[] | any[];

/**
 * A local account.
 *
 * @beta
 */
export declare interface AccountRuntimeValue {
    type: RuntimeValueType.ACCOUNT;
    accountIndex: number;
}

/**
 * A future that can be resolved to a standard Ethereum address.
 *
 * @beta
 */
export declare type AddressResolvableFuture = ContractFuture<string> | StaticCallFuture<string, string> | ReadEventArgumentFuture;

/**
 * Argument type that smart contracts can receive in their constructors and functions.
 *
 * @beta
 */
export declare type ArgumentType = BaseArgumentType | ArgumentType[] | {
    [field: string]: ArgumentType;
};

/**
 * An compilation artifact representing a smart contract.
 *
 * @beta
 */
export declare interface Artifact<AbiT extends Abi = Abi> {
    contractName: string;
    sourceName: string;
    bytecode: string;
    abi: AbiT;
    linkReferences: Record<string, Record<string, Array<{
        length: number;
        start: number;
    }>>>;
}

/**
 * Retrieve artifacts based on contract name.
 *
 * @beta
 */
export declare interface ArtifactResolver {
    loadArtifact(contractName: string): Promise<Artifact>;
    getBuildInfo(contractName: string): Promise<BuildInfo | undefined>;
}

/**
 * Base argument type that smart contracts can receive in their constructors
 * and functions.
 *
 * @beta
 */
export declare type BaseArgumentType = number | bigint | string | boolean | ContractFuture<string> | StaticCallFuture<string, string> | EncodeFunctionCallFuture<string, string> | ReadEventArgumentFuture | RuntimeValue;

/**
 * The base of the different serialized futures.
 *
 * @beta
 */
export declare interface BaseSerializedFuture {
    id: string;
    type: FutureType;
    dependencies: FutureToken[];
    moduleId: string;
}

/**
 * Base type of module parameters's values.
 *
 * @beta
 */
export declare type BaseSolidityParameterType = number | bigint | string | boolean;

/**
 * Provides a array of batches, where each batch is an array of futureIds,
 * based on Ignition's batching algorithm, assuming a the module is being
 * run from as a fresh deployment.
 *
 * @param ignitionModule - the Ignition module to be get batch information for
 * @returns the batches Ignition will use for the module
 *
 * @beta
 */
export declare function batches(ignitionModule: IgnitionModule<string, string, IgnitionModuleResult<string>>): string[][];

/**
 * An event indicating that batches have been generated for a deployment run.
 *
 * @beta
 */
export declare interface BatchInitializeEvent {
    type: ExecutionEventType.BATCH_INITIALIZE;
    batches: string[][];
}

/**
 * An event indicating that the execution engine has moved onto
 * the next batch.
 *
 * @beta
 */
export declare interface BeginNextBatchEvent {
    type: ExecutionEventType.BEGIN_NEXT_BATCH;
}

/**
 * A BuildInfo is a file that contains all the information of a solc run. It
 * includes all the necessary information to recreate that exact same run, and
 * all of its output.
 *
 * @beta
 */
export declare interface BuildInfo {
    _format: string;
    id: string;
    solcVersion: string;
    solcLongVersion: string;
    input: CompilerInput;
    output: CompilerOutput;
}

/**
 * Construct a module definition that can be deployed through Ignition.
 *
 * @param moduleId - the id of the module
 * @param moduleDefintionFunction - a function accepting the
 * IgnitionModuleBuilder to configure the deployment
 * @returns a module definition
 *
 * @beta
 */
export declare function buildModule<ModuleIdT extends string, ContractNameT extends string, IgnitionModuleResultsT extends IgnitionModuleResult<ContractNameT>>(moduleId: ModuleIdT, moduleDefintionFunction: (m: IgnitionModuleBuilder) => IgnitionModuleResultsT): IgnitionModule<ModuleIdT, ContractNameT, IgnitionModuleResultsT>;

/**
 * A future representing only contracts that can be called off-chain (i.e. not libraries).
 * Either an existing one or one that will be deployed.
 *
 * @beta
 */
export declare type CallableContractFuture<ContractNameT extends string> = NamedArtifactContractDeploymentFuture<ContractNameT> | ContractDeploymentFuture | NamedArtifactContractAtFuture<ContractNameT> | ContractAtFuture;

/**
 * An event indicating a future that calls a function onchain
 * via transactions has completed execution.
 *
 * @beta
 */
export declare interface CallExecutionStateCompleteEvent {
    type: ExecutionEventType.CALL_EXECUTION_STATE_COMPLETE;
    futureId: string;
    result: ExecutionEventResult;
}

/**
 * An event indicating a future that calls a function onchain
 * via transactions has started execution.
 *
 * @beta
 */
export declare interface CallExecutionStateInitializeEvent {
    type: ExecutionEventType.CALL_EXECUTION_STATE_INITIALIZE;
    futureId: string;
}

/**
 * The options for a `call` call.
 *
 * @beta
 */
export declare interface CallOptions {
    /**
     * The future id.
     */
    id?: string;
    /**
     * The futures to execute before this one.
     */
    after?: Future[];
    /**
     * The value in wei to send with the transaction.
     */
    value?: bigint | ModuleParameterRuntimeValue<bigint> | StaticCallFuture<string, string> | ReadEventArgumentFuture;
    /**
     * The account to send the transaction from.
     */
    from?: string | AccountRuntimeValue;
}

/**
 * The configuration info needed to verify a contract on Etherscan on a given chain.
 *
 * @beta
 */
export declare interface ChainConfig {
    network: string;
    chainId: number;
    urls: {
        apiURL: string;
        browserURL: string;
    };
}

/**
 * The solc input for running the compilation.
 *
 * @beta
 */
export declare interface CompilerInput {
    language: string;
    sources: {
        [sourceName: string]: {
            content: string;
        };
    };
    settings: {
        viaIR?: boolean;
        optimizer: {
            runs?: number;
            enabled?: boolean;
            details?: {
                yulDetails: {
                    optimizerSteps: string;
                };
            };
        };
        metadata?: {
            useLiteralContent: boolean;
        };
        outputSelection: {
            [sourceName: string]: {
                [contractName: string]: string[];
            };
        };
        evmVersion?: string;
        libraries?: {
            [libraryFileName: string]: {
                [libraryName: string]: string;
            };
        };
        remappings?: string[];
    };
}

/**
 * The compilation output from solc.
 *
 * @beta
 */
export declare interface CompilerOutput {
    sources: CompilerOutputSources;
    contracts: {
        [sourceName: string]: {
            [contractName: string]: CompilerOutputContract;
        };
    };
}

/**
 * The solc bytecode output.
 *
 * @beta
 */
export declare interface CompilerOutputBytecode {
    object: string;
    opcodes: string;
    sourceMap: string;
    linkReferences: {
        [sourceName: string]: {
            [libraryName: string]: Array<{
                start: number;
                length: 20;
            }>;
        };
    };
    immutableReferences?: {
        [key: string]: Array<{
            start: number;
            length: number;
        }>;
    };
}

/**
 * The output of a compiled contract from solc.
 *
 * @beta
 */
export declare interface CompilerOutputContract {
    abi: any;
    evm: {
        bytecode: CompilerOutputBytecode;
        deployedBytecode: CompilerOutputBytecode;
        methodIdentifiers: {
            [methodSignature: string]: string;
        };
    };
}

/**
 * The ast for a compiled contract.
 *
 * @beta
 */
export declare interface CompilerOutputSource {
    id: number;
    ast: any;
}

/**
 * The asts for the compiled contracts.
 *
 * @beta
 */
export declare interface CompilerOutputSources {
    [sourceName: string]: CompilerOutputSource;
}

/**
 * An event indicating that a future that represents an existing contract
 * has been initialized, there is no complete event as it initializes
 * as complete.
 *
 * @beta
 */
export declare interface ContractAtExecutionStateInitializeEvent {
    type: ExecutionEventType.CONTRACT_AT_EXECUTION_STATE_INITIALIZE;
    futureId: string;
}

/**
 * A future representing a previously deployed contract at a known address with a given artifact.
 * It may not belong to this project, and we may struggle to type.
 *
 * @beta
 */
export declare interface ContractAtFuture<AbiT extends Abi = Abi> {
    type: FutureType.CONTRACT_AT;
    id: string;
    module: IgnitionModule;
    dependencies: Set<Future>;
    contractName: string;
    address: string | AddressResolvableFuture | ModuleParameterRuntimeValue<string>;
    artifact: Artifact<AbiT>;
}

/**
 * The options for a `contractAt` call.
 *
 * @beta
 */
export declare interface ContractAtOptions {
    /**
     * The future id.
     */
    id?: string;
    /**
     * The futures to execute before this one.
     */
    after?: Future[];
}

/**
 * A future representing the calling of a contract function that modifies on-chain state
 *
 * @beta
 */
export declare interface ContractCallFuture<ContractNameT extends string, FunctionNameT extends string> {
    type: FutureType.CONTRACT_CALL;
    id: string;
    module: IgnitionModule;
    dependencies: Set<Future>;
    contract: ContractFuture<ContractNameT>;
    functionName: FunctionNameT;
    args: ArgumentType[];
    value: bigint | ModuleParameterRuntimeValue<bigint> | StaticCallFuture<string, string> | ReadEventArgumentFuture;
    from: string | AccountRuntimeValue | undefined;
}

/**
 * A future representing the deployment of a contract that we only know its artifact.
 * It may not belong to this project, and we may struggle to type.
 *
 * @beta
 */
export declare interface ContractDeploymentFuture<AbiT extends Abi = Abi> {
    type: FutureType.CONTRACT_DEPLOYMENT;
    id: string;
    module: IgnitionModule;
    dependencies: Set<Future>;
    contractName: string;
    artifact: Artifact<AbiT>;
    constructorArgs: ArgumentType[];
    libraries: Record<string, ContractFuture<string>>;
    value: bigint | ModuleParameterRuntimeValue<bigint> | StaticCallFuture<string, string> | ReadEventArgumentFuture;
    from: string | AccountRuntimeValue | undefined;
}

/**
 * A future representing a contract. Either an existing one or one
 * that will be deployed.
 *
 * @beta
 */
export declare type ContractFuture<ContractNameT extends string> = NamedArtifactContractDeploymentFuture<ContractNameT> | ContractDeploymentFuture | NamedArtifactLibraryDeploymentFuture<ContractNameT> | LibraryDeploymentFuture | NamedArtifactContractAtFuture<ContractNameT> | ContractAtFuture;

/**
 * The options for a `contract` deployment.
 *
 * @beta
 */
export declare interface ContractOptions {
    /**
     * The future id.
     */
    id?: string;
    /**
     * The futures to execute before this one.
     */
    after?: Future[];
    /**
     * The libraries to link to the contract.
     */
    libraries?: Record<string, ContractFuture<string>>;
    /**
     * The value in wei to send with the transaction.
     */
    value?: bigint | ModuleParameterRuntimeValue<bigint> | StaticCallFuture<string, string> | ReadEventArgumentFuture;
    /**
     * The account to send the transaction from.
     */
    from?: string | AccountRuntimeValue;
}

/**
 * Base error class extended by all custom errors.
 * Placeholder to allow us to customize error output formatting in the future.
 *
 * @beta
 */
export declare class CustomError extends Error {
    constructor(message: string, cause?: Error);
}

/**
 * Deploy an IgnitionModule to the chain
 *
 * @beta
 */
export declare function deploy<ModuleIdT extends string, ContractNameT extends string, IgnitionModuleResultsT extends IgnitionModuleResult<ContractNameT>, StrategyT extends keyof StrategyConfig = "basic">({ config, artifactResolver, provider, executionEventListener, deploymentDir, ignitionModule, deploymentParameters, accounts, defaultSender: givenDefaultSender, strategy, strategyConfig, maxFeePerGasLimit, maxPriorityFeePerGas, }: {
    config?: Partial<DeployConfig>;
    artifactResolver: ArtifactResolver;
    provider: EIP1193Provider;
    executionEventListener?: ExecutionEventListener;
    deploymentDir?: string;
    ignitionModule: IgnitionModule<ModuleIdT, ContractNameT, IgnitionModuleResultsT>;
    deploymentParameters: DeploymentParameters;
    accounts: string[];
    defaultSender?: string;
    strategy?: StrategyT;
    strategyConfig?: StrategyConfig[StrategyT];
    maxFeePerGasLimit?: bigint;
    maxPriorityFeePerGas?: bigint;
}): Promise<DeploymentResult>;

/**
 * Configuration options for the deployment.
 *
 * @beta
 */
export declare interface DeployConfig {
    /**
     * The interval, in milliseconds, between checks to see if a new block
     * has been created
     */
    blockPollingInterval: number;
    /**
     * The amount of time, in milliseconds, to wait on a transaction before
     * bumping its fees.
     */
    timeBeforeBumpingFees: number;
    /**
     * The maximum amount of times a transaction is bumped.
     */
    maxFeeBumps: number;
    /**
     * The number of block confirmations to wait before considering
     * a transaction to be confirmed during Ignition execution.
     */
    requiredConfirmations: number;
}

/**
 * The details of a deployed contract.
 *
 * @beta
 */
export declare interface DeployedContract {
    id: string;
    contractName: string;
    address: string;
}

/**
 * An event indicating that a deployment has started.
 *
 * @beta
 */
export declare interface DeploymentCompleteEvent {
    type: ExecutionEventType.DEPLOYMENT_COMPLETE;
    result: DeploymentResult;
}

/**
 * An event indicating that a future that deploys a contract
 * or library has completed execution.
 *
 * @beta
 */
export declare interface DeploymentExecutionStateCompleteEvent {
    type: ExecutionEventType.DEPLOYMENT_EXECUTION_STATE_COMPLETE;
    futureId: string;
    result: ExecutionEventResult;
}

/**
 * An event indicating a future that deploys a contract
 * or library has started execution.
 *
 * @beta
 */
export declare interface DeploymentExecutionStateInitializeEvent {
    type: ExecutionEventType.DEPLOYMENT_EXECUTION_STATE_INITIALIZE;
    futureId: string;
}

/**
 * A future representing a deployment.
 *
 * @beta
 */
export declare type DeploymentFuture<ContractNameT extends string> = NamedArtifactContractDeploymentFuture<ContractNameT> | ContractDeploymentFuture | NamedArtifactLibraryDeploymentFuture<ContractNameT> | LibraryDeploymentFuture;

/**
 * An event indicating a new deployment has been initialized.
 *
 * @beta
 */
export declare interface DeploymentInitializeEvent {
    type: ExecutionEventType.DEPLOYMENT_INITIALIZE;
    chainId: number;
}

/**
 * An object containing a map of module ID's to their respective ModuleParameters.
 *
 * @beta
 */
export declare interface DeploymentParameters {
    [moduleId: string]: ModuleParameters;
}

/**
 * The result of running a deployment.
 *
 * @beta
 */
export declare type DeploymentResult = ValidationErrorDeploymentResult | ReconciliationErrorDeploymentResult | ExecutionErrorDeploymentResult | PreviousRunErrorDeploymentResult | SuccessfulDeploymentResult;

/**
 * The different kinds of results that a deployment can produce.
 *
 * @beta
 */
export declare enum DeploymentResultType {
    /**
     * One or more futures failed validation.
     */
    VALIDATION_ERROR = "VALIDATION_ERROR",
    /**
     * One or more futures failed the reconciliation process with
     * the previous state of the deployment.
     */
    RECONCILIATION_ERROR = "RECONCILIATION_ERROR",
    /**
     * One or more future's execution failed or timed out.
     */
    EXECUTION_ERROR = "EXECUTION_ERROR",
    /**
     * One or more futures from a previous run failed or timed out.
     */
    PREVIOUS_RUN_ERROR = "PREVIOUS_RUN_ERROR",
    /**
     * The entire deployment was successful.
     */
    SUCCESSFUL_DEPLOYMENT = "SUCCESSFUL_DEPLOYMENT"
}

/**
 * An event indicating that a deployment has started.
 *
 * @beta
 */
export declare interface DeploymentStartEvent {
    type: ExecutionEventType.DEPLOYMENT_START;
    moduleName: string;
    deploymentDir: string | undefined;
    isResumed: boolean;
    maxFeeBumps: number;
}

/**
 * A provider for on-chain interactions.
 *
 * @beta
 */
export declare interface EIP1193Provider {
    request(args: RequestArguments): Promise<unknown>;
}

/**
 * An event indicating that a future that represents encoding a function
 * call has been initialized, there is no complete event as it initializes
 * as complete.
 *
 * @beta
 */
export declare interface EncodeFunctionCallExecutionStateInitializeEvent {
    type: ExecutionEventType.ENCODE_FUNCTION_CALL_EXECUTION_STATE_INITIALIZE;
    futureId: string;
    result: ExecutionEventSuccess;
}

/**
 * A future representing the encoding of a contract function call
 *
 * @beta
 */
export declare interface EncodeFunctionCallFuture<ContractNameT extends string, FunctionNameT extends string> {
    type: FutureType.ENCODE_FUNCTION_CALL;
    id: string;
    module: IgnitionModule;
    dependencies: Set<Future>;
    contract: ContractFuture<ContractNameT>;
    functionName: FunctionNameT;
    args: ArgumentType[];
}

/**
 * The options for an `encodeFunctionCall` call.
 *
 * @beta
 */
export declare interface EncodeFunctionCallOptions {
    /**
     * The future id.
     */
    id?: string;
    /**
     * The futures to execute before this one.
     */
    after?: Future[];
}

/**
 * ErrorDescriptor is a type that describes an error.
 * It's used to generate error codes and messages.
 *
 * @beta
 */
export declare interface ErrorDescriptor {
    number: number;
    message: string;
}

/**
 * A deployment result where one or more futures errored during execution or
 * timed out.
 *
 * @beta
 */
export declare interface ExecutionErrorDeploymentResult {
    type: DeploymentResultType.EXECUTION_ERROR;
    /**
     * A list of all the futures that have started executing but have not
     * finished, neither successfully nor unsuccessfully.
     */
    started: string[];
    /**
     * A list of all the futures that have timed out, including details of the
     * network interaction that timed out.
     */
    timedOut: Array<{
        futureId: string;
        networkInteractionId: number;
    }>;
    /**
     * A list of all the futures that are being Held as determined by the execution
     * strategy, i.e. an off-chain process is not yet complete.
     */
    held: Array<{
        futureId: string;
        heldId: number;
        reason: string;
    }>;
    /**
     * A list of all the future that have failed, including the details of
     * the network interaction that errored.
     */
    failed: Array<{
        futureId: string;
        networkInteractionId: number;
        error: string;
    }>;
    /**
     * A list with the id of all the future that have successfully executed.
     */
    successful: string[];
}

/**
 * Events emitted by the execution engine to allow tracking
 * progress of a deploy.
 *
 * @beta
 */
export declare type ExecutionEvent = DeploymentInitializeEvent | WipeApplyEvent | DeploymentExecutionStateInitializeEvent | DeploymentExecutionStateCompleteEvent | CallExecutionStateInitializeEvent | CallExecutionStateCompleteEvent | StaticCallExecutionStateInitializeEvent | StaticCallExecutionStateCompleteEvent | SendDataExecutionStateInitializeEvent | SendDataExecutionStateCompleteEvent | ContractAtExecutionStateInitializeEvent | ReadEventArgExecutionStateInitializeEvent | EncodeFunctionCallExecutionStateInitializeEvent | NetworkInteractionRequestEvent | TransactionSendEvent | TransactionConfirmEvent | StaticCallCompleteEvent | OnchainInteractionBumpFeesEvent | OnchainInteractionDroppedEvent | OnchainInteractionReplacedByUserEvent | OnchainInteractionTimeoutEvent | BatchInitializeEvent | DeploymentStartEvent | ReconciliationWarningsEvent | BeginNextBatchEvent | SetModuleIdEvent | SetStrategyEvent;

/**
 * An errored result of a future's execution.
 *
 * @beta
 */
export declare interface ExecutionEventError {
    type: ExecutionEventResultType.ERROR;
    error: string;
}

/**
 * A hold result of a future's execution.
 *
 * @beta
 */
export declare interface ExecutionEventHeld {
    type: ExecutionEventResultType.HELD;
    heldId: number;
    reason: string;
}

/**
 * A listener for execution events.
 *
 * @beta
 */
export declare type ExecutionEventListener = {
    [eventType in ExecutionEventType as SnakeToCamelCase<eventType>]: (event: ExecutionEventTypeMap[eventType]) => void;
};

/**
 * The types of network interactions that can be requested by a future.
 *
 * @beta
 */
export declare enum ExecutionEventNetworkInteractionType {
    ONCHAIN_INTERACTION = "ONCHAIN_INTERACTION",
    STATIC_CALL = "STATIC_CALL"
}

/**
 * The result of a future's completed execution.
 *
 * @beta
 */
export declare type ExecutionEventResult = ExecutionEventSuccess | ExecutionEventError | ExecutionEventHeld;

/**
 * The status of a future's completed execution.
 *
 * @beta
 */
export declare enum ExecutionEventResultType {
    SUCCESS = "SUCCESS",
    ERROR = "ERROR",
    HELD = "HELD"
}

/**
 * A successful result of a future's execution.
 *
 * @beta
 */
export declare interface ExecutionEventSuccess {
    type: ExecutionEventResultType.SUCCESS;
    result?: string;
}

/**
 * The types of diagnostic events emitted during a deploy.
 *
 * @beta
 */
export declare enum ExecutionEventType {
    WIPE_APPLY = "WIPE_APPLY",
    DEPLOYMENT_EXECUTION_STATE_INITIALIZE = "DEPLOYMENT_EXECUTION_STATE_INITIALIZE",
    DEPLOYMENT_EXECUTION_STATE_COMPLETE = "DEPLOYMENT_EXECUTION_STATE_COMPLETE",
    CALL_EXECUTION_STATE_INITIALIZE = "CALL_EXECUTION_STATE_INITIALIZE",
    CALL_EXECUTION_STATE_COMPLETE = "CALL_EXECUTION_STATE_COMPLETE",
    STATIC_CALL_EXECUTION_STATE_INITIALIZE = "STATIC_CALL_EXECUTION_STATE_INITIALIZE",
    STATIC_CALL_EXECUTION_STATE_COMPLETE = "STATIC_CALL_EXECUTION_STATE_COMPLETE",
    SEND_DATA_EXECUTION_STATE_INITIALIZE = "SEND_DATA_EXECUTION_STATE_INITIALIZE",
    SEND_DATA_EXECUTION_STATE_COMPLETE = "SEND_DATA_EXECUTION_STATE_COMPLETE",
    CONTRACT_AT_EXECUTION_STATE_INITIALIZE = "CONTRACT_AT_EXECUTION_STATE_INITIALIZE",
    READ_EVENT_ARGUMENT_EXECUTION_STATE_INITIALIZE = "READ_EVENT_ARGUMENT_EXECUTION_STATE_INITIALIZE",
    ENCODE_FUNCTION_CALL_EXECUTION_STATE_INITIALIZE = "ENCODE_FUNCTION_CALL_EXECUTION_STATE_INITIALIZE",
    NETWORK_INTERACTION_REQUEST = "NETWORK_INTERACTION_REQUEST",
    TRANSACTION_SEND = "TRANSACTION_SEND",
    TRANSACTION_CONFIRM = "TRANSACTION_CONFIRM",
    STATIC_CALL_COMPLETE = "STATIC_CALL_COMPLETE",
    ONCHAIN_INTERACTION_BUMP_FEES = "ONCHAIN_INTERACTION_BUMP_FEES",
    ONCHAIN_INTERACTION_DROPPED = "ONCHAIN_INTERACTION_DROPPED",
    ONCHAIN_INTERACTION_REPLACED_BY_USER = "ONCHAIN_INTERACTION_REPLACED_BY_USER",
    ONCHAIN_INTERACTION_TIMEOUT = "ONCHAIN_INTERACTION_TIMEOUT",
    DEPLOYMENT_START = "DEPLOYMENT_START",
    DEPLOYMENT_INITIALIZE = "DEPLOYMENT_INITIALIZE",
    RECONCILIATION_WARNINGS = "RECONCILIATION_WARNINGS",
    BATCH_INITIALIZE = "BATCH_INITIALIZE",
    RUN_START = "RUN_START",
    BEGIN_NEXT_BATCH = "BEGIN_NEXT_BATCH",
    DEPLOYMENT_COMPLETE = "DEPLOYMENT_COMPLETE",
    SET_MODULE_ID = "SET_MODULE_ID",
    SET_STRATEGY = "SET_STRATEGY"
}

/**
 * A mapping of execution event types to their corresponding event.
 *
 * @beta
 */
export declare interface ExecutionEventTypeMap {
    [ExecutionEventType.WIPE_APPLY]: WipeApplyEvent;
    [ExecutionEventType.DEPLOYMENT_EXECUTION_STATE_INITIALIZE]: DeploymentExecutionStateInitializeEvent;
    [ExecutionEventType.DEPLOYMENT_EXECUTION_STATE_COMPLETE]: DeploymentExecutionStateCompleteEvent;
    [ExecutionEventType.CALL_EXECUTION_STATE_INITIALIZE]: CallExecutionStateInitializeEvent;
    [ExecutionEventType.CALL_EXECUTION_STATE_COMPLETE]: CallExecutionStateCompleteEvent;
    [ExecutionEventType.STATIC_CALL_EXECUTION_STATE_INITIALIZE]: StaticCallExecutionStateInitializeEvent;
    [ExecutionEventType.STATIC_CALL_EXECUTION_STATE_COMPLETE]: StaticCallExecutionStateCompleteEvent;
    [ExecutionEventType.SEND_DATA_EXECUTION_STATE_INITIALIZE]: SendDataExecutionStateInitializeEvent;
    [ExecutionEventType.SEND_DATA_EXECUTION_STATE_COMPLETE]: SendDataExecutionStateCompleteEvent;
    [ExecutionEventType.CONTRACT_AT_EXECUTION_STATE_INITIALIZE]: ContractAtExecutionStateInitializeEvent;
    [ExecutionEventType.READ_EVENT_ARGUMENT_EXECUTION_STATE_INITIALIZE]: ReadEventArgExecutionStateInitializeEvent;
    [ExecutionEventType.ENCODE_FUNCTION_CALL_EXECUTION_STATE_INITIALIZE]: EncodeFunctionCallExecutionStateInitializeEvent;
    [ExecutionEventType.NETWORK_INTERACTION_REQUEST]: NetworkInteractionRequestEvent;
    [ExecutionEventType.TRANSACTION_SEND]: TransactionSendEvent;
    [ExecutionEventType.TRANSACTION_CONFIRM]: TransactionConfirmEvent;
    [ExecutionEventType.STATIC_CALL_COMPLETE]: StaticCallCompleteEvent;
    [ExecutionEventType.ONCHAIN_INTERACTION_BUMP_FEES]: OnchainInteractionBumpFeesEvent;
    [ExecutionEventType.ONCHAIN_INTERACTION_DROPPED]: OnchainInteractionDroppedEvent;
    [ExecutionEventType.ONCHAIN_INTERACTION_REPLACED_BY_USER]: OnchainInteractionReplacedByUserEvent;
    [ExecutionEventType.ONCHAIN_INTERACTION_TIMEOUT]: OnchainInteractionTimeoutEvent;
    [ExecutionEventType.DEPLOYMENT_START]: DeploymentStartEvent;
    [ExecutionEventType.DEPLOYMENT_INITIALIZE]: DeploymentInitializeEvent;
    [ExecutionEventType.RECONCILIATION_WARNINGS]: ReconciliationWarningsEvent;
    [ExecutionEventType.BATCH_INITIALIZE]: BatchInitializeEvent;
    [ExecutionEventType.RUN_START]: RunStartEvent;
    [ExecutionEventType.BEGIN_NEXT_BATCH]: BeginNextBatchEvent;
    [ExecutionEventType.DEPLOYMENT_COMPLETE]: DeploymentCompleteEvent;
    [ExecutionEventType.SET_MODULE_ID]: SetModuleIdEvent;
    [ExecutionEventType.SET_STRATEGY]: SetStrategyEvent;
}

/**
 * Formats a Solidity parameter into a human-readable string.
 *
 * @beta
 */
export declare function formatSolidityParameter(param: SolidityParameterType): string;

/**
 * A future representing a call. Either a static one or one that modifies contract state
 *
 * @beta
 */
export declare type FunctionCallFuture<ContractNameT extends string, FunctionNameT extends string> = ContractCallFuture<ContractNameT, FunctionNameT> | StaticCallFuture<ContractNameT, FunctionNameT>;

/**
 * The unit of execution in an Ignition deploy.
 *
 * @beta
 */
export declare type Future = NamedArtifactContractDeploymentFuture<string> | ContractDeploymentFuture | NamedArtifactLibraryDeploymentFuture<string> | LibraryDeploymentFuture | ContractCallFuture<string, string> | StaticCallFuture<string, string> | EncodeFunctionCallFuture<string, string> | NamedArtifactContractAtFuture<string> | ContractAtFuture | ReadEventArgumentFuture | SendDataFuture;

/**
 * In serialized form a pointer to a future stored at the top level
 * within the module.
 *
 * @beta
 */
export declare interface FutureToken {
    futureId: string;
    _kind: "FutureToken";
}

/**
 * The different future types supported by Ignition.
 *
 * @beta
 */
export declare enum FutureType {
    NAMED_ARTIFACT_CONTRACT_DEPLOYMENT = "NAMED_ARTIFACT_CONTRACT_DEPLOYMENT",
    CONTRACT_DEPLOYMENT = "CONTRACT_DEPLOYMENT",
    NAMED_ARTIFACT_LIBRARY_DEPLOYMENT = "NAMED_ARTIFACT_LIBRARY_DEPLOYMENT",
    LIBRARY_DEPLOYMENT = "LIBRARY_DEPLOYMENT",
    CONTRACT_CALL = "CONTRACT_CALL",
    STATIC_CALL = "STATIC_CALL",
    ENCODE_FUNCTION_CALL = "ENCODE_FUNCTION_CALL",
    NAMED_ARTIFACT_CONTRACT_AT = "NAMED_ARTIFACT_CONTRACT_AT",
    CONTRACT_AT = "CONTRACT_AT",
    READ_EVENT_ARGUMENT = "READ_EVENT_ARGUMENT",
    SEND_DATA = "SEND_DATA"
}

/**
 * The information of a deployed contract.
 *
 * @beta
 */
export declare interface GenericContractInfo extends DeployedContract {
    sourceName: string;
    abi: Abi;
}

/**
 * Retrieve the information required to verify all contracts from a deployment on Etherscan.
 *
 * @param deploymentDir - the file directory of the deployment
 * @param customChains - an array of custom chain configurations
 *
 * @beta
 */
export declare function getVerificationInformation(deploymentDir: string, customChains?: ChainConfig[], includeUnrelatedContracts?: boolean): AsyncGenerator<VerifyResult>;

/**
 * All exceptions intentionally thrown with Ignition-core
 * extend this class.
 *
 * @beta
 */
export declare class IgnitionError extends CustomError {
    #private;
    constructor(errorDescriptor: ErrorDescriptor, messageArguments?: Record<string, string | number>, cause?: Error);
    get errorNumber(): number;
}

/**
 * A recipe for deploying and configuring contracts.
 *
 * @beta
 */
export declare interface IgnitionModule<ModuleIdT extends string = string, ContractNameT extends string = string, IgnitionModuleResultsT extends IgnitionModuleResult<ContractNameT> = IgnitionModuleResult<ContractNameT>> {
    id: ModuleIdT;
    futures: Set<Future>;
    submodules: Set<IgnitionModule>;
    results: IgnitionModuleResultsT;
}

/**
 * The build api for configuring a deployment within a module.
 *
 * @beta
 */
export declare interface IgnitionModuleBuilder {
    /**
     * Returns an account runtime value representing the
     * Hardhat account the underlying transactions for a
     * future will be sent from.
     *
     * @param accountIndex - The index of the account to return
     *
     * @example
     * ```
     * const owner = m.getAccount(1);
     * const myContract = m.contract("MyContract", { from: owner });
     * // can also be used anywhere an address is expected
     * m.send("sendToOwner", owner, { value: 100 });
     * ```
     */
    getAccount(accountIndex: number): AccountRuntimeValue;
    /**
     * A parameter whose value can be set at deployment.
     *
     * @param parameterName - The name of the parameter
     * @param defaultValue - The default value to use if the parameter is not
     * provided
     *
     * @example
     * ```
     * const amount = m.getParameter("amount", 100);
     * const myContract = m.contract("MyContract", { value: amount });
     * ```
     */
    getParameter<ParamTypeT extends ModuleParameterType = any>(parameterName: string, defaultValue?: ParamTypeT): ModuleParameterRuntimeValue<ParamTypeT>;
    /**
     * Deploy a contract.
     *
     * @param contractName - The name of the contract to deploy
     * @param args - The arguments to pass to the contract constructor
     * @param options - The options for the deployment
     *
     * @example
     * ```
     * const myContract = m.contract("MyContract", [], { value: 100 });
     * ```
     */
    contract<ContractNameT extends string>(contractName: ContractNameT, args?: ArgumentType[], options?: ContractOptions): NamedArtifactContractDeploymentFuture<ContractNameT>;
    /**
     * Deploy a contract.
     *
     * @param contractName - The name of the contract to deploy
     * @param artifact - The artifact of the contract to deploy
     * @param args - The arguments to pass to the contract constructor
     * @param options - The options for the deployment
     *
     * @example
     * ```
     * const myContract = m.contract("MyContract", [], { value: 100 });
     * ```
     */
    contract<const AbiT extends Abi>(contractName: string, artifact: Artifact<AbiT>, args?: ArgumentType[], options?: ContractOptions): ContractDeploymentFuture<AbiT>;
    /**
     * Deploy a library.
     *
     * @param libraryName - The name of the library to deploy
     * @param options - The options for the deployment
     *
     * @example
     * ```
     * const owner = m.getAccount(1);
     * const myLibrary = m.library("MyLibrary", { from: owner } );
     * ```
     */
    library<LibraryNameT extends string>(libraryName: LibraryNameT, options?: LibraryOptions): NamedArtifactLibraryDeploymentFuture<LibraryNameT>;
    /**
     * Deploy a library.
     *
     * @param libraryName - The name of the library to deploy
     * @param artifact - The artifact of the library to deploy
     * @param options - The options for the deployment
     *
     * @example
     * ```
     * const owner = m.getAccount(1);
     * const myLibrary = m.library(
     *   "MyLibrary",
     *   myLibraryArtifact,
     *   { from: owner }
     * );
     * ```
     */
    library<const AbiT extends Abi>(libraryName: string, artifact: Artifact<AbiT>, options?: LibraryOptions): LibraryDeploymentFuture<AbiT>;
    /**
     * Call a contract function.
     *
     * @param contractFuture - The contract to call
     * @param functionName - The name of the function to call
     * @param args - The arguments to pass to the function
     * @param options - The options for the call
     *
     * @example
     * ```
     * const myContract = m.contract("MyContract");
     * const myContractCall = m.call(myContract, "updateCounter", [100]);
     * ```
     */
    call<ContractNameT extends string, FunctionNameT extends string>(contractFuture: CallableContractFuture<ContractNameT>, functionName: FunctionNameT, args?: ArgumentType[], options?: CallOptions): ContractCallFuture<ContractNameT, FunctionNameT>;
    /**
     * Statically call a contract function and return the result.
     *
     * This allows you to read data from a contract without sending a transaction.
     * This is only supported for functions that are marked as `view` or `pure`,
     * or variables marked `public`.
     *
     * @param contractFuture - The contract to call
     * @param functionName - The name of the function to call
     * @param args - The arguments to pass to the function
     * @param nameOrIndex - The name or index of the return argument to read
     * @param options - The options for the call
     *
     * @example
     * ```
     * const myContract = m.contract("MyContract");
     * const counter = m.staticCall(
     *   myContract,
     *   "getCounterAndOwner",
     *   [],
     *   "counter"
     * );
     * ```
     */
    staticCall<ContractNameT extends string, FunctionNameT extends string>(contractFuture: CallableContractFuture<ContractNameT>, functionName: FunctionNameT, args?: ArgumentType[], nameOrIndex?: string | number, options?: StaticCallOptions): StaticCallFuture<ContractNameT, FunctionNameT>;
    /**
     * ABI encode a function call, including both the function's name and
     * the parameters it is being called with. This is useful when
     * sending a raw transaction to invoke a smart contract or
     * when invoking a smart contract proxied through an intermediary function.
     *
     * @param contractFuture - The contract that the ABI for encoding will be taken from
     * @param functionName - The name of the function
     * @param args - The arguments to pass to the function
     * @param options - The options for the call
     *
     * @example
     * ```
     * const myContract = m.contract("MyContract");
     * const data = m.encodeFunctionCall(myContract, "updateCounter", [100]);
     * m.send("callUpdateCounter", myContract, 0n, data);
     * ```
     */
    encodeFunctionCall<ContractNameT extends string, FunctionNameT extends string>(contractFuture: CallableContractFuture<ContractNameT>, functionName: FunctionNameT, args?: ArgumentType[], options?: EncodeFunctionCallOptions): EncodeFunctionCallFuture<ContractNameT, FunctionNameT>;
    /**
     * Create a future for an existing deployed contract so that it can be
     * referenced in subsequent futures.
     *
     * The resulting future can be used anywhere a contract future or address
     * is expected.
     *
     * @param contractName - The name of the contract
     * @param address - The address of the contract
     * @param options - The options for the instance
     *
     * @example
     * ```
     * const myContract = m.contractAt("MyContract", "0x1234...");
     * ```
     */
    contractAt<ContractNameT extends string>(contractName: ContractNameT, address: string | AddressResolvableFuture | ModuleParameterRuntimeValue<string>, options?: ContractAtOptions): NamedArtifactContractAtFuture<ContractNameT>;
    /**
     * Create a future for an existing deployed contract so that it can be
     * referenced in subsequent futures.
     *
     * The resulting future can be used anywhere a contract future or address is
     * expected.
     *
     * @param contractName - The name of the contract
     * @param artifact - The artifact of the contract
     * @param address - The address of the contract
     * @param options - The options for the instance
     *
     * @example
     * ```
     * const myContract = m.contractAt(
     *   "MyContract",
     *   myContractArtifact,
     *   "0x1234..."
     * );
     * ```
     */
    contractAt<const AbiT extends Abi>(contractName: string, artifact: Artifact<AbiT>, address: string | AddressResolvableFuture | ModuleParameterRuntimeValue<string>, options?: ContractAtOptions): ContractAtFuture<AbiT>;
    /**
     * Read an event argument from a contract.
     *
     * The resulting value can be used wherever a value of the same type is
     * expected i.e. contract function arguments, `send` value, etc.
     *
     * @param futureToReadFrom - The future to read the event from
     * @param eventName - The name of the event
     * @param nameOrIndex - The name or index of the event argument to read
     * @param options - The options for the event
     *
     * @example
     * ```
     * const myContract = m.contract("MyContract");
     * // assuming the event is emitted by the constructor of MyContract
     * const owner = m.readEventArgument(myContract, "ContractCreated", "owner");
     *
     * // or, if the event is emitted during a function call:
     * const myContractCall = m.call(myContract, "updateCounter", [100]);
     * const counter = m.readEventArgument(
     *   myContractCall,
     *   "CounterUpdated",
     *   "counter",
     *   {
     *     emitter: myContract
     *   }
     * );
     * ```
     */
    readEventArgument(futureToReadFrom: NamedArtifactContractDeploymentFuture<string> | ContractDeploymentFuture | SendDataFuture | ContractCallFuture<string, string>, eventName: string, nameOrIndex: string | number, options?: ReadEventArgumentOptions): ReadEventArgumentFuture;
    /**
     * Send an arbitrary transaction.
     *
     * Can be used to transfer ether and/or send raw data to an address.
     *
     * @param id - A custom id for the Future
     * @param to - The address to send the transaction to
     * @param value - The amount of wei to send
     * @param data - The data to send
     * @param options - The options for the transaction
     *
     * @example
     * ```
     * const myContract = m.contract("MyContract");
     * m.send("sendToMyContract", myContract, 100);
     *
     * // you can also send to an address directly
     * const owner = m.getAccount(1);
     * const otherAccount = m.getAccount(2);
     * m.send("sendToOwner", owner, 100, undefined, { from: otherAccount });
     * ```
     */
    send(id: string, to: string | AddressResolvableFuture | ModuleParameterRuntimeValue<string> | AccountRuntimeValue, value?: bigint | ModuleParameterRuntimeValue<bigint>, data?: string | EncodeFunctionCallFuture<string, string>, options?: SendDataOptions): SendDataFuture;
    /**
     * Allows you to deploy then use the results of another module within this
     * module.
     *
     * @param ignitionSubmodule - The submodule to use
     *
     * @example
     * ```
     * const otherModule = buildModule("otherModule", (m) => {
     *  const myContract = m.contract("MyContract");
     *
     *  return { myContract };
     * });
     *
     * const mainModule = buildModule("mainModule", (m) => {
     *  const { myContract } = m.useModule(otherModule);
     *
     *  const myContractCall = m.call(myContract, "updateCounter", [100]);
     * });
     * ```
     */
    useModule<ModuleIdT extends string, ContractNameT extends string, IgnitionModuleResultsT extends IgnitionModuleResult<ContractNameT>>(ignitionSubmodule: IgnitionModule<ModuleIdT, ContractNameT, IgnitionModuleResultsT>): IgnitionModuleResultsT;
}

/**
 * The results of deploying a module must be a dictionary of contract futures
 *
 * @beta
 */
export declare interface IgnitionModuleResult<ContractNameT extends string> {
    [name: string]: ContractFuture<ContractNameT>;
}

/**
 * Serialize an Ignition module.
 *
 * @beta
 */
export declare class IgnitionModuleSerializer {
    static serialize(ignitionModule: IgnitionModule<string, string, IgnitionModuleResult<string>>): SerializedIgnitionModule;
    private static _serializeModule;
    private static _serializeFuture;
    private static _convertLibrariesToLibraryTokens;
    private static _serializeAccountRuntimeValue;
    private static _serializeModuleParamterRuntimeValue;
    private static _serializeBigint;
    private static _jsonStringifyWithBigint;
    private static _convertFutureToFutureToken;
    private static _convertModuleToModuleToken;
    private static _getModulesAndSubmoduleFor;
}

/**
 * This class is used to throw errors from Ignition plugins made by third parties.
 *
 * @beta
 */
export declare class IgnitionPluginError extends CustomError {
    static isIgnitionPluginError(error: any): error is IgnitionPluginError;
    private readonly _isIgnitionPluginError;
    readonly pluginName: string;
    constructor(pluginName: string, message: string, cause?: Error);
}

/**
 * Return true if potential is an account runtime value.
 *
 * @beta
 */
export declare function isAccountRuntimeValue(potential: unknown): potential is AccountRuntimeValue;

/**
 * Returns true if future is of type AddressResolvable.
 *
 * @beta
 */
export declare function isAddressResolvableFuture(future: Future): future is AddressResolvableFuture;

/**
 * Returns true if future is of type ArtifactContractAtFuture.
 *
 * @beta
 */
export declare function isArtifactContractAtFuture(future: Future): future is ContractAtFuture;

/**
 * Returns true if future is of type ArtifactContractDeploymentFuture.
 *
 * @beta
 */
export declare function isArtifactContractDeploymentFuture(future: Future): future is ContractDeploymentFuture;

/**
 * Returns true if future is of type ArtifactLibraryDeploymentFuture.
 *
 * @beta
 */
export declare function isArtifactLibraryDeploymentFuture(future: Future): future is LibraryDeploymentFuture;

/**
 * Returns true if potential is of type Artifact.
 *
 * @beta
 */
export declare function isArtifactType(potential: unknown): potential is Artifact;

/**
 * Returns true if future is of type CallableContractFuture<string>.
 *
 * @beta
 */
export declare function isCallableContractFuture(future: Future): future is CallableContractFuture<string>;

/**
 * Returns true if future is of type ContractFuture<string>.
 *
 * @beta
 */
export declare function isContractFuture(future: Future): future is ContractFuture<string>;

/**
 * Returns true if future is of type DeploymentFuture<string>.
 *
 * @beta
 */
export declare function isDeploymentFuture(future: Future): future is DeploymentFuture<string>;

/**
 * Returns true if the type is of type DeploymentFuture<string>.
 *
 * @beta
 */
export declare function isDeploymentType(potential: unknown): potential is DeploymentFuture<string>["type"];

/**
 * Returns true if future is of type EncodeFunctionCallFuture\<string, string\>.
 *
 * @beta
 */
export declare function isEncodeFunctionCallFuture(potential: unknown): potential is EncodeFunctionCallFuture<string, string>;

/**
 * Returns true if future is of type FunctionCallFuture\<string, string\>.
 *
 * @beta
 */
export declare function isFunctionCallFuture(future: Future): future is FunctionCallFuture<string, string>;

/**
 * Returns true if potential is of type Future.
 *
 * @beta
 */
export declare function isFuture(potential: unknown): potential is Future;

/**
 * Returns true if the future requires submitting a transaction on-chain
 *
 * @beta
 */
export declare function isFutureThatSubmitsOnchainTransaction(f: Future): f is Exclude<Exclude<Exclude<Exclude<Future, StaticCallFuture<string, string>>, ReadEventArgumentFuture>, NamedArtifactContractAtFuture<string>>, ContractAtFuture>;

/**
 * Returns true if potential is of type FutureType.
 *
 * @beta
 */
export declare function isFutureType(potential: unknown): potential is FutureType;

/**
 * Returns true if potential is of type ModuleParameterRuntimeValue<any>.
 *
 * @beta
 */
export declare function isModuleParameterRuntimeValue(potential: unknown): potential is ModuleParameterRuntimeValue<any>;

/**
 * Returns true if future is of type NamedContractAtFuture.
 *
 * @beta
 */
export declare function isNamedContractAtFuture(future: Future): future is NamedArtifactContractAtFuture<string>;

/**
 * Returns true if future is of type NamedContractDeploymentFuture.
 *
 * @beta
 */
export declare function isNamedContractDeploymentFuture(future: Future): future is NamedArtifactContractDeploymentFuture<string>;

/**
 * Returns true if future is of type NamedLibraryDeploymentFuture.
 *
 * @beta
 */
export declare function isNamedLibraryDeploymentFuture(future: Future): future is NamedArtifactLibraryDeploymentFuture<string>;

/**
 * Returns true if future is of type NamedStaticCallFuture.
 *
 * @beta
 */
export declare function isNamedStaticCallFuture(future: Future): future is StaticCallFuture<string, string>;

/**
 * Returns true if future is of type ReadEventArgumentFuture.
 *
 * @beta
 */
export declare function isReadEventArgumentFuture(future: Future): future is ReadEventArgumentFuture;

/**
 * Returns true if potential is of type RuntimeValue.
 *
 * @beta
 */
export declare function isRuntimeValue(potential: unknown): potential is RuntimeValue;

/**
 * Returns true if potential is of type RuntimeValueType.
 *
 * @beta
 */
export declare function isRuntimeValueType(potential: unknown): potential is RuntimeValueType;

/**
 * A future representing the deployment of a library that we only know its artifact.
 * It may not belong to this project, and we may struggle to type.
 *
 * @beta
 */
export declare interface LibraryDeploymentFuture<AbiT extends Abi = Abi> {
    type: FutureType.LIBRARY_DEPLOYMENT;
    id: string;
    module: IgnitionModule;
    dependencies: Set<Future>;
    contractName: string;
    artifact: Artifact<AbiT>;
    libraries: Record<string, ContractFuture<string>>;
    from: string | AccountRuntimeValue | undefined;
}

/**
 * The options for a `library` call.
 *
 * @beta
 */
export declare interface LibraryOptions {
    /**
     * The future id.
     */
    id?: string;
    /**
     * The futures to execute before this one.
     */
    after?: Future[];
    /**
     * The libraries to link to the contract.
     */
    libraries?: Record<string, ContractFuture<string>>;
    /**
     * The account to send the transaction from.
     */
    from?: string | AccountRuntimeValue;
}

/**
 * Return a list of all deployments in the deployment directory.
 *
 * @param deploymentDir - the directory of the deployments
 *
 * @beta
 */
export declare function listDeployments(deploymentDir: string): Promise<string[]>;

/**
 * A module parameter.
 *
 * @beta
 */
export declare interface ModuleParameterRuntimeValue<ParamTypeT extends ModuleParameterType> {
    type: RuntimeValueType.MODULE_PARAMETER;
    moduleId: string;
    name: string;
    defaultValue: ParamTypeT | undefined;
}

/**
 * An object containing the parameters passed into the module.
 *
 * @beta
 */
export declare interface ModuleParameters {
    [parameterName: string]: SolidityParameterType;
}

/**
 * Type of module parameters's values.
 *
 * @beta
 */
export declare type ModuleParameterType = SolidityParameterType | AccountRuntimeValue;

/**
 * In serialized form a pointer to a module stored at the top level
 * within the deployment.
 *
 * @beta
 */
export declare interface ModuleToken {
    moduleId: string;
    _kind: "ModuleToken";
}

/**
 * A future representing a previously deployed contract at a known address that belongs to this project.
 *
 * @beta
 */
export declare interface NamedArtifactContractAtFuture<ContractNameT extends string> {
    type: FutureType.NAMED_ARTIFACT_CONTRACT_AT;
    id: string;
    module: IgnitionModule;
    dependencies: Set<Future>;
    contractName: ContractNameT;
    address: string | AddressResolvableFuture | ModuleParameterRuntimeValue<string>;
}

/**
 * A future representing the deployment of a contract that belongs to this project.
 *
 * @beta
 */
export declare interface NamedArtifactContractDeploymentFuture<ContractNameT extends string> {
    type: FutureType.NAMED_ARTIFACT_CONTRACT_DEPLOYMENT;
    id: string;
    module: IgnitionModule;
    dependencies: Set<Future>;
    contractName: ContractNameT;
    constructorArgs: ArgumentType[];
    libraries: Record<string, ContractFuture<string>>;
    value: bigint | ModuleParameterRuntimeValue<bigint> | StaticCallFuture<string, string> | ReadEventArgumentFuture;
    from: string | AccountRuntimeValue | undefined;
}

/**
 * A future representing the deployment of a library that belongs to this project
 *
 * @beta
 */
export declare interface NamedArtifactLibraryDeploymentFuture<LibraryNameT extends string> {
    type: FutureType.NAMED_ARTIFACT_LIBRARY_DEPLOYMENT;
    id: string;
    module: IgnitionModule;
    dependencies: Set<Future>;
    contractName: LibraryNameT;
    libraries: Record<string, ContractFuture<string>>;
    from: string | AccountRuntimeValue | undefined;
}

/**
 * An event indicating that a future has requested a network interaction,
 * either a transaction or a static call query.
 *
 * @beta
 */
export declare interface NetworkInteractionRequestEvent {
    type: ExecutionEventType.NETWORK_INTERACTION_REQUEST;
    networkInteractionType: ExecutionEventNetworkInteractionType;
    futureId: string;
}

/**
 * This class is used to throw errors from *core* Ignition plugins.
 * If you are developing a third-party plugin, use IgnitionPluginError instead.
 *
 * @beta
 */
export declare class NomicIgnitionPluginError extends IgnitionPluginError {
    static isNomicIgnitionPluginError(error: any): error is NomicIgnitionPluginError;
    private readonly _isNomicIgnitionPluginError;
}

/**
 * An event indicating that a future's onchain interaction has had
 * its its latest transaction fee bumped.
 *
 * @beta
 */
export declare interface OnchainInteractionBumpFeesEvent {
    type: ExecutionEventType.ONCHAIN_INTERACTION_BUMP_FEES;
    futureId: string;
}

/**
 * An event indicating that a future's onchain interaction has
 * had its transaction dropped and will be resent.
 *
 * @beta
 */
export declare interface OnchainInteractionDroppedEvent {
    type: ExecutionEventType.ONCHAIN_INTERACTION_DROPPED;
    futureId: string;
}

/**
 * An event indicating that a future's onchain interaction has
 * been replaced by a transaction from the user.
 *
 * @beta
 */
export declare interface OnchainInteractionReplacedByUserEvent {
    type: ExecutionEventType.ONCHAIN_INTERACTION_REPLACED_BY_USER;
    futureId: string;
}

/**
 * An event indicating that a future's onchain interaction has
 * timed out.
 *
 * @beta
 */
export declare interface OnchainInteractionTimeoutEvent {
    type: ExecutionEventType.ONCHAIN_INTERACTION_TIMEOUT;
    futureId: string;
}

/**
 * A deployment result where one or more futures from a previous run failed or timed out
 * and need their state wiped.
 *
 * @beta
 */
export declare interface PreviousRunErrorDeploymentResult {
    type: DeploymentResultType.PREVIOUS_RUN_ERROR;
    /**
     * A map from future id to a list of all of its previous run errors.
     */
    errors: {
        [futureId: string]: string[];
    };
}

/**
 * An event indicating that a future that represents resolving an event
 * from a previous futures onchain interaction, there is no complete event
 * as it initializes as complete.
 *
 * @beta
 */
export declare interface ReadEventArgExecutionStateInitializeEvent {
    type: ExecutionEventType.READ_EVENT_ARGUMENT_EXECUTION_STATE_INITIALIZE;
    futureId: string;
    result: ExecutionEventSuccess;
}

/**
 * A future that represents reading an argument of an event emitted by the
 * transaction that executed another future.
 *
 * @beta
 */
export declare interface ReadEventArgumentFuture {
    type: FutureType.READ_EVENT_ARGUMENT;
    id: string;
    module: IgnitionModule;
    dependencies: Set<Future>;
    futureToReadFrom: NamedArtifactContractDeploymentFuture<string> | ContractDeploymentFuture | SendDataFuture | ContractCallFuture<string, string>;
    eventName: string;
    nameOrIndex: string | number;
    emitter: ContractFuture<string>;
    eventIndex: number;
}

/**
 * The options for a `readEventArgument` call.
 *
 * @beta
 */
export declare interface ReadEventArgumentOptions {
    /**
     * The future id.
     */
    id?: string;
    /**
     * The contract that emitted the event. If omitted the contract associated
     * with the future you are reading the event from will be used.
     */
    emitter?: ContractFuture<string>;
    /**
     * If multiple events with the same name were emitted by the contract, you can
     * choose which of those to read from by specifying its index (0-indexed).
     */
    eventIndex?: number;
}

/**
 * A deployment result where one or more futures failed reconciliation.
 *
 * @beta
 */
export declare interface ReconciliationErrorDeploymentResult {
    type: DeploymentResultType.RECONCILIATION_ERROR;
    /**
     * A map form future id to a list of all of its reconciliation errors.
     */
    errors: {
        [futureId: string]: string[];
    };
}

/**
 * An event indicating that a deployment has reconciliation warnings.
 *
 * @beta
 */
export declare interface ReconciliationWarningsEvent {
    type: ExecutionEventType.RECONCILIATION_WARNINGS;
    warnings: string[];
}

/**
 * Arguments for a request to an EIP-1193 Provider.
 *
 * @beta
 */
export declare interface RequestArguments {
    readonly method: string;
    readonly params?: readonly unknown[] | object;
}

/**
 * An event indicating that the deployment is commenencing an execution run.
 *
 * @beta
 */
export declare interface RunStartEvent {
    type: ExecutionEventType.RUN_START;
}

/**
 * A value that's only available during deployment.
 *
 * @beta
 */
export declare type RuntimeValue = AccountRuntimeValue | ModuleParameterRuntimeValue<ModuleParameterType>;

/**
 * The different runtime values supported by Ignition.
 *
 * @beta
 */
export declare enum RuntimeValueType {
    ACCOUNT = "ACCOUNT",
    MODULE_PARAMETER = "MODULE_PARAMETER"
}

/**
 * An event indicationing that a future that sends data or eth to a contract
 * has completed execution.
 *
 * @beta
 */
export declare interface SendDataExecutionStateCompleteEvent {
    type: ExecutionEventType.SEND_DATA_EXECUTION_STATE_COMPLETE;
    futureId: string;
    result: ExecutionEventResult;
}

/**
 * An event indicationing that a future that sends data or eth to a contract
 * has started execution.
 *
 * @beta
 */
export declare interface SendDataExecutionStateInitializeEvent {
    type: ExecutionEventType.SEND_DATA_EXECUTION_STATE_INITIALIZE;
    futureId: string;
}

/**
 * A future that represents sending arbitrary data to the EVM.
 *
 * @beta
 */
export declare interface SendDataFuture {
    type: FutureType.SEND_DATA;
    id: string;
    module: IgnitionModule;
    dependencies: Set<Future>;
    to: string | AddressResolvableFuture | ModuleParameterRuntimeValue<string> | AccountRuntimeValue;
    value: bigint | ModuleParameterRuntimeValue<bigint>;
    data: string | EncodeFunctionCallFuture<string, string> | undefined;
    from: string | AccountRuntimeValue | undefined;
}

/**
 * The options for a `send` call.
 *
 * @beta
 */
export declare interface SendDataOptions {
    /**
     * The futures to execute before this one.
     */
    after?: Future[];
    /**
     * The account to send the transaction from.
     */
    from?: string | AccountRuntimeValue;
}

/**
 * The serialized version of AccountRuntimeValue.
 *
 * @beta
 */
export declare interface SerializedAccountRuntimeValue {
    _kind: "AccountRuntimeValue";
    accountIndex: number;
}

/**
 * The serialized version of ArgumentType
 *
 * @beta
 */
export declare type SerializedArgumentType = SerializedBaseArgumentType | SerializedArgumentType[] | {
    [field: string]: SerializedArgumentType;
};

/**
 * The serialized version of ArtifactContractAtFuture.
 *
 * @beta
 */
export declare interface SerializedArtifactContractAtFuture extends BaseSerializedFuture {
    type: FutureType.CONTRACT_AT;
    contractName: string;
    address: string | FutureToken | SerializedModuleParameterRuntimeValue;
    artifact: Artifact;
}

/**
 * The serialized version of the ArtifactContractDeploymentFuture.
 *
 * @beta
 */
export declare interface SerializedArtifactContractDeploymentFuture extends BaseSerializedFuture {
    type: FutureType.CONTRACT_DEPLOYMENT;
    contractName: string;
    constructorArgs: SerializedArgumentType[];
    artifact: Artifact;
    libraries: SerializedLibraries;
    value: SerializedBigInt | SerializedModuleParameterRuntimeValue | FutureToken;
    from: string | SerializedAccountRuntimeValue | undefined;
}

/**
 * The serialized version of the ArtifactLibraryDeploymentFuture.
 *
 * @beta
 */
export declare interface SerializedArtifactLibraryDeploymentFuture extends BaseSerializedFuture {
    type: FutureType.LIBRARY_DEPLOYMENT;
    contractName: string;
    artifact: Artifact;
    libraries: SerializedLibraries;
    from: string | SerializedAccountRuntimeValue | undefined;
}

/**
 * The serialized version of BaseArgumentType
 *
 * @beta
 */
export declare type SerializedBaseArgumentType = number | SerializedBigInt | string | boolean | FutureToken | SerializedRuntimeValue;

/**
 * A serialized bigint.
 *
 * @beta
 */
export declare interface SerializedBigInt {
    _kind: "bigint";
    value: string;
}

/**
 * The set of serialized future types
 *
 * @beta
 */
export declare type SerializedFuture = SerializedNamedContractDeploymentFuture | SerializedArtifactContractDeploymentFuture | SerializedNamedLibraryDeploymentFuture | SerializedArtifactLibraryDeploymentFuture | SerializedNamedContractCallFuture | SerializedNamedStaticCallFuture | SerializedNamedEncodeFunctionCallFuture | SerializedNamedContractAtFuture | SerializedArtifactContractAtFuture | SerializedReadEventArgumentFuture | SerializedSendDataFuture;

/**
 * The serialized version of an Ignition module and its submodules.
 *
 * @beta
 */
export declare interface SerializedIgnitionModule {
    startModule: string;
    modules: {
        [key: string]: SerializedModuleDescription;
    };
}

/**
 * The serialized libraries, where each library
 * has been replaced by a token.
 *
 * @beta
 */
export declare type SerializedLibraries = Array<[name: string, token: FutureToken]>;

/**
 * A subpart of the `SerializedIgnitionModule` that describes one
 * module/submodule and its relations to futures and other submodule.
 *
 * @beta
 */
export declare interface SerializedModuleDescription {
    id: string;
    submodules: ModuleToken[];
    futures: SerializedFuture[];
    results: Array<[name: string, token: FutureToken]>;
}

/**
 * The serialized version of ModuleParameterRuntimeValue.
 *
 * @beta
 */
export declare interface SerializedModuleParameterRuntimeValue {
    _kind: "ModuleParameterRuntimeValue";
    moduleId: string;
    name: string;
    defaultValue: string | undefined;
}

/**
 * The serialized version of NamedContractAtFuture.
 *
 * @beta
 */
export declare interface SerializedNamedContractAtFuture extends BaseSerializedFuture {
    type: FutureType.NAMED_ARTIFACT_CONTRACT_AT;
    contractName: string;
    address: string | FutureToken | SerializedModuleParameterRuntimeValue;
}

/**
 * The serialized version of NamedContractCallFuture.
 *
 * @beta
 */
export declare interface SerializedNamedContractCallFuture extends BaseSerializedFuture {
    type: FutureType.CONTRACT_CALL;
    functionName: string;
    contract: FutureToken;
    args: SerializedArgumentType[];
    value: SerializedBigInt | SerializedModuleParameterRuntimeValue | FutureToken;
    from: string | SerializedAccountRuntimeValue | undefined;
}

/**
 * The serialized version of the NamedContractDeploymentFuture.
 *
 * @beta
 */
export declare interface SerializedNamedContractDeploymentFuture extends BaseSerializedFuture {
    type: FutureType.NAMED_ARTIFACT_CONTRACT_DEPLOYMENT;
    contractName: string;
    constructorArgs: SerializedArgumentType[];
    libraries: SerializedLibraries;
    value: SerializedBigInt | SerializedModuleParameterRuntimeValue | FutureToken;
    from: string | SerializedAccountRuntimeValue | undefined;
}

/**
 * The serialized version of NamedEncodeFunctionCallFuture.
 *
 * @beta
 */
export declare interface SerializedNamedEncodeFunctionCallFuture extends BaseSerializedFuture {
    type: FutureType.ENCODE_FUNCTION_CALL;
    functionName: string;
    contract: FutureToken;
    args: SerializedArgumentType[];
}

/**
 * The serialized version of the NamedLibraryDeploymentFuture.
 *
 * @beta
 */
export declare interface SerializedNamedLibraryDeploymentFuture extends BaseSerializedFuture {
    type: FutureType.NAMED_ARTIFACT_LIBRARY_DEPLOYMENT;
    contractName: string;
    libraries: SerializedLibraries;
    from: string | SerializedAccountRuntimeValue | undefined;
}

/**
 * The serialized version of NamedStaticCallFuture.
 *
 * @beta
 */
export declare interface SerializedNamedStaticCallFuture extends BaseSerializedFuture {
    type: FutureType.STATIC_CALL;
    functionName: string;
    contract: FutureToken;
    args: SerializedArgumentType[];
    nameOrIndex: string | number;
    from: string | SerializedAccountRuntimeValue | undefined;
}

/**
 * The serialized version of ReadEventArgumentFuture.
 *
 * @beta
 */
export declare interface SerializedReadEventArgumentFuture extends BaseSerializedFuture {
    type: FutureType.READ_EVENT_ARGUMENT;
    futureToReadFrom: FutureToken;
    eventName: string;
    nameOrIndex: string | number;
    emitter: FutureToken;
    eventIndex: number;
}

/**
 * The srialized version of RuntimeValue.
 *
 * @beta
 */
export declare type SerializedRuntimeValue = SerializedAccountRuntimeValue | SerializedModuleParameterRuntimeValue;

/**
 * The serialized version of ReadEventArgumentFuture.
 *
 * @beta
 */
export declare interface SerializedSendDataFuture extends BaseSerializedFuture {
    type: FutureType.SEND_DATA;
    to: string | FutureToken | SerializedModuleParameterRuntimeValue | SerializedAccountRuntimeValue;
    value: SerializedBigInt | SerializedModuleParameterRuntimeValue;
    data: string | FutureToken | undefined;
    from: string | SerializedAccountRuntimeValue | undefined;
}

/**
 * An event indicating the current moduleId being validated.
 *
 * @beta
 */
export declare interface SetModuleIdEvent {
    type: ExecutionEventType.SET_MODULE_ID;
    moduleName: string;
}

/**
 * An event indicating the type of strategy being used.
 *
 * @beta
 */
export declare interface SetStrategyEvent {
    type: ExecutionEventType.SET_STRATEGY;
    strategy: string;
}

/**
 * A utility type for mapping enum values to function names
 *
 * @beta
 */
export declare type SnakeToCamelCase<S extends string> = S extends `${infer T}_${infer U}` ? `${Lowercase<T>}${Capitalize<SnakeToCamelCase<Lowercase<U>>>}` : S;

/**
 * Types that can be passed across the Solidity ABI boundary.
 *
 * @beta
 */
export declare type SolidityParameterType = BaseSolidityParameterType | SolidityParameterType[] | {
    [field: string]: SolidityParameterType;
};

/**
 * A map of source names to library names to their addresses.
 * Used to verify contracts with libraries that cannot be derived from the bytecode.
 * i.e. contracts that use libraries in their constructor
 *
 * @beta
 */
export declare interface SourceToLibraryToAddress {
    [sourceName: string]: {
        [libraryName: string]: string;
    };
}

/**
 * An event indicating that a static call has been successfully run
 * against the chain.
 *
 * @beta
 */
export declare interface StaticCallCompleteEvent {
    type: ExecutionEventType.STATIC_CALL_COMPLETE;
    futureId: string;
}

/**
 * An event indicating that a future that makes a static call
 * has completed execution.
 *
 * @beta
 */
export declare interface StaticCallExecutionStateCompleteEvent {
    type: ExecutionEventType.STATIC_CALL_EXECUTION_STATE_COMPLETE;
    futureId: string;
    result: ExecutionEventResult;
}

/**
 * An event indicating that a future that makes a static call
 * has started execution.
 *
 * @beta
 */
export declare interface StaticCallExecutionStateInitializeEvent {
    type: ExecutionEventType.STATIC_CALL_EXECUTION_STATE_INITIALIZE;
    futureId: string;
}

/**
 * A future representing the static calling of a contract function that does not modify state
 *
 * @beta
 */
export declare interface StaticCallFuture<ContractNameT extends string, FunctionNameT extends string> {
    type: FutureType.STATIC_CALL;
    id: string;
    module: IgnitionModule;
    dependencies: Set<Future>;
    contract: ContractFuture<ContractNameT>;
    functionName: FunctionNameT;
    nameOrIndex: string | number;
    args: ArgumentType[];
    from: string | AccountRuntimeValue | undefined;
}

/**
 * The options for a `staticCall` call.
 *
 * @beta
 */
export declare interface StaticCallOptions {
    /**
     * The future id.
     */
    id?: string;
    /**
     * The futures to execute before this one.
     */
    after?: Future[];
    /**
     * The account to send the transaction from.
     */
    from?: string | AccountRuntimeValue;
}

/**
 * Show the status of a deployment.
 *
 * @param deploymentDir - the directory of the deployment to get the status of
 * @param artifactResolver - the artifact resolver to use when loading artifacts
 * for a future
 *
 * @beta
 */
declare function status_2(deploymentDir: string, artifactResolver: Omit<ArtifactResolver, "getBuildInfo">): Promise<StatusResult>;
export { status_2 as status }

/**
 * The result of requesting the status of a deployment. It lists the futures
 * broken down by their status, and includes the deployed contracts.
 *
 * @beta
 */
export declare interface StatusResult extends Omit<ExecutionErrorDeploymentResult, "type"> {
    chainId: number;
    contracts: {
        [key: string]: GenericContractInfo;
    };
}

/**
 * The config options for the deployment strategies.
 *
 * @beta
 */
export declare interface StrategyConfig {
    basic: Record<PropertyKey, never>;
    create2: {
        salt: string;
    };
}

/**
 * A deployment result where all of the futures of the module have completed
 * successfully.
 *
 * The deployed contracts returned include the deployed contracts from previous
 * runs.
 *
 * @beta
 */
export declare interface SuccessfulDeploymentResult {
    type: DeploymentResultType.SUCCESSFUL_DEPLOYMENT;
    /**
     * A map with the contracts returned by the deployed module.
     *
     * The contracts can be the result of a deployment or a contractAt call,
     * in the current run and the previous runs
     */
    contracts: {
        [key: string]: DeployedContract;
    };
}

/**
 * An event indicating has been detected as confirmed on-chain.
 *
 * @beta
 */
export declare interface TransactionConfirmEvent {
    type: ExecutionEventType.TRANSACTION_CONFIRM;
    futureId: string;
    hash: string;
}

/**
 * An event indicating that a transaction has been sent to the network.
 *
 * @beta
 */
export declare interface TransactionSendEvent {
    type: ExecutionEventType.TRANSACTION_SEND;
    futureId: string;
    hash: string;
}

/**
 * A deployment result where one or more futures failed validation.
 *
 * @beta
 */
export declare interface ValidationErrorDeploymentResult {
    type: DeploymentResultType.VALIDATION_ERROR;
    /**
     * A map form future id to a list of all of its validation errors.
     */
    errors: {
        [futureId: string]: string[];
    };
}

/**
 * The information required to verify a contract on Etherscan.
 *
 * @beta
 */
export declare interface VerifyInfo {
    address: string;
    compilerVersion: string;
    sourceCode: string;
    name: string;
    args: string;
}

/**
 * The result of requesting the verification info for a deployment.
 * It returns the chainConfig followed by an array of VerifyInfo objects, one for each contract to be verified.
 *
 * @beta
 */
export declare type VerifyResult = [ChainConfig, VerifyInfo];

/**
 * Clear the state against a future within a deployment
 *
 * @param deploymentDir - the file directory of the deployment
 * @param futureId - the future to be cleared
 *
 * @beta
 */
export declare function wipe(deploymentDir: string, artifactResolver: ArtifactResolver, futureId: string): Promise<void>;

/**
 * An event indicating the user has clear the previous execution of a future.
 *
 * @beta
 */
export declare interface WipeApplyEvent {
    type: ExecutionEventType.WIPE_APPLY;
    futureId: string;
}

export { }
