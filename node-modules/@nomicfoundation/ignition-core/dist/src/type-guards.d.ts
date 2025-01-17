import { Artifact } from "./types/artifact";
import { AccountRuntimeValue, AddressResolvableFuture, CallableContractFuture, ContractAtFuture, ContractDeploymentFuture, ContractFuture, DeploymentFuture, EncodeFunctionCallFuture, FunctionCallFuture, Future, FutureType, LibraryDeploymentFuture, ModuleParameterRuntimeValue, NamedArtifactContractAtFuture, NamedArtifactContractDeploymentFuture, NamedArtifactLibraryDeploymentFuture, ReadEventArgumentFuture, RuntimeValue, RuntimeValueType, StaticCallFuture } from "./types/module";
/**
 * Returns true if potential is of type Artifact.
 *
 * @beta
 */
export declare function isArtifactType(potential: unknown): potential is Artifact;
/**
 * Returns true if potential is of type FutureType.
 *
 * @beta
 */
export declare function isFutureType(potential: unknown): potential is FutureType;
/**
 * Returns true if potential is of type Future.
 *
 * @beta
 */
export declare function isFuture(potential: unknown): potential is Future;
/**
 * Returns true if future is of type ContractFuture<string>.
 *
 * @beta
 */
export declare function isContractFuture(future: Future): future is ContractFuture<string>;
/**
 * Returns true if future is of type CallableContractFuture<string>.
 *
 * @beta
 */
export declare function isCallableContractFuture(future: Future): future is CallableContractFuture<string>;
/**
 * Returns true if future is of type AddressResolvable.
 *
 * @beta
 */
export declare function isAddressResolvableFuture(future: Future): future is AddressResolvableFuture;
/**
 * Returns true if future is of type FunctionCallFuture\<string, string\>.
 *
 * @beta
 */
export declare function isFunctionCallFuture(future: Future): future is FunctionCallFuture<string, string>;
/**
 * Returns true if future is of type NamedStaticCallFuture.
 *
 * @beta
 */
export declare function isNamedStaticCallFuture(future: Future): future is StaticCallFuture<string, string>;
/**
 * Returns true if future is of type EncodeFunctionCallFuture\<string, string\>.
 *
 * @beta
 */
export declare function isEncodeFunctionCallFuture(potential: unknown): potential is EncodeFunctionCallFuture<string, string>;
/**
 * Returns true if future is of type ReadEventArgumentFuture.
 *
 * @beta
 */
export declare function isReadEventArgumentFuture(future: Future): future is ReadEventArgumentFuture;
/**
 * Returns true if future is of type NamedContractDeploymentFuture.
 *
 * @beta
 */
export declare function isNamedContractDeploymentFuture(future: Future): future is NamedArtifactContractDeploymentFuture<string>;
/**
 * Returns true if future is of type ArtifactContractDeploymentFuture.
 *
 * @beta
 */
export declare function isArtifactContractDeploymentFuture(future: Future): future is ContractDeploymentFuture;
/**
 * Returns true if future is of type NamedLibraryDeploymentFuture.
 *
 * @beta
 */
export declare function isNamedLibraryDeploymentFuture(future: Future): future is NamedArtifactLibraryDeploymentFuture<string>;
/**
 * Returns true if future is of type ArtifactLibraryDeploymentFuture.
 *
 * @beta
 */
export declare function isArtifactLibraryDeploymentFuture(future: Future): future is LibraryDeploymentFuture;
/**
 * Returns true if future is of type NamedContractAtFuture.
 *
 * @beta
 */
export declare function isNamedContractAtFuture(future: Future): future is NamedArtifactContractAtFuture<string>;
/**
 * Returns true if future is of type ArtifactContractAtFuture.
 *
 * @beta
 */
export declare function isArtifactContractAtFuture(future: Future): future is ContractAtFuture;
/**
 * Returns true if the type is of type DeploymentFuture<string>.
 *
 * @beta
 */
export declare function isDeploymentType(potential: unknown): potential is DeploymentFuture<string>["type"];
/**
 * Returns true if future is of type DeploymentFuture<string>.
 *
 * @beta
 */
export declare function isDeploymentFuture(future: Future): future is DeploymentFuture<string>;
/**
 * Returns true if the future requires submitting a transaction on-chain
 *
 * @beta
 */
export declare function isFutureThatSubmitsOnchainTransaction(f: Future): f is Exclude<Exclude<Exclude<Exclude<Future, StaticCallFuture<string, string>>, ReadEventArgumentFuture>, NamedArtifactContractAtFuture<string>>, ContractAtFuture>;
/**
 * Returns true if potential is of type RuntimeValueType.
 *
 * @beta
 */
export declare function isRuntimeValueType(potential: unknown): potential is RuntimeValueType;
/**
 * Returns true if potential is of type RuntimeValue.
 *
 * @beta
 */
export declare function isRuntimeValue(potential: unknown): potential is RuntimeValue;
/**
 * Return true if potential is an account runtime value.
 *
 * @beta
 */
export declare function isAccountRuntimeValue(potential: unknown): potential is AccountRuntimeValue;
/**
 * Returns true if potential is of type ModuleParameterRuntimeValue<any>.
 *
 * @beta
 */
export declare function isModuleParameterRuntimeValue(potential: unknown): potential is ModuleParameterRuntimeValue<any>;
//# sourceMappingURL=type-guards.d.ts.map