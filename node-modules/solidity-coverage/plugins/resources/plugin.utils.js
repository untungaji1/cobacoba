/**
 * A collection of utilities for common tasks plugins will need in the course
 * of composing a workflow using the solidity-coverage API
 */

const PluginUI = require('./plugin.ui');

const path = require('path');
const fs = require('fs-extra');
const shell = require('shelljs');

// ===
// UI
// ===

/**
 * Displays a list of skipped contracts
 * @param  {TruffleConfig}  config
 * @return {Object[]}       skipped array of objects generated by `assembleTargets` method
 */
function reportSkipped(config, skipped=[]){
  let started = false;
  const ui = new PluginUI(config.logger.log);

  for (let item of skipped){
    if (!started) {
      ui.report('instr-skip', []);
      started = true;
    }
    ui.report('instr-skipped', [item.relativePath]);
  }
}

// ========
// File I/O
// ========

/**
 * Loads source
 * @param  {String} _path absolute path
 * @return {String}       source file
 */
function loadSource(_path){
  return fs.readFileSync(_path).toString();
}

/**
 * Sets up temporary folders for instrumented contracts and their compilation artifacts
 * @param  {PlatformConfig} config
 * @param  {String} tempContractsDir
 * @param  {String} tempArtifactsDir
 */
function setupTempFolders(config, tempContractsDir, tempArtifactsDir){
  checkContext(config, tempContractsDir, tempArtifactsDir);

  shell.mkdir(tempContractsDir);
  shell.mkdir(tempArtifactsDir);
}

/**
 * Save a set of instrumented files to a temporary directory.
 * @param  {Object[]} targets   array of targets generated by `assembleTargets`
 * @param  {[type]} originalDir absolute path to original contracts directory
 * @param  {[type]} tempDir     absolute path to temp contracts directory
 */
function save(targets, originalDir, tempDir){
  let _path;
  for (target of targets) {

    _path = path.normalize(target.canonicalPath)
                .replace(originalDir, tempDir);

    fs.outputFileSync(_path, target.source);
  }
}

/**
 * Relativizes an absolute file path, given an absolute parent path
 * @param  {String} pathToFile
 * @param  {String} pathToParent
 * @return {String}              relative path
 */
function toRelativePath(pathToFile, pathToParent){
  return pathToFile.replace(`${pathToParent}${path.sep}`, '');
}

/**
 * Returns a pair of canonically named temporary directory paths for contracts
 * and artifacts. Instrumented assets can be written & compiled to these.
 * Then the unit tests can be run, consuming them as sources.
 * @param  {TruffleConfig} config
 * @return {Object}               temp paths
 */
function getTempLocations(config){
  const contractsRoot = path.parse(config.contractsDir).dir
  const cwd = config.workingDir;
  const contractsDirName = config.coverageContractsTemp || '.coverage_contracts';
  const artifactsDirName = config.temp || '.coverage_artifacts';

  return {
    tempContractsDir: path.join(contractsRoot, contractsDirName),
    tempArtifactsDir: path.join(cwd, artifactsDirName)
  }
}

/**
 * Checks for existence of contract sources, and sweeps away debris
 * left over from an uncontrolled crash.
 */
function checkContext(config, tempContractsDir, tempArtifactsDir){
  const ui = new PluginUI(config.logger.log);

  if (!shell.test('-e', config.contractsDir)){

    const msg = ui.generate('sources-fail', [config.contractsDir])
    throw new Error(msg);
  }

  if (shell.test('-e', tempContractsDir)){
    shell.rm('-Rf', tempContractsDir);
  }

  if (shell.test('-e', tempArtifactsDir)){
    shell.rm('-Rf', tempArtifactsDir);
  }
}


// =============================
// Instrumentation Set Assembly
// =============================

function assembleFiles(config, skipFiles=[]){
  let targets;
  let targetsPath;

  // The targets (contractsDir) could actually be a single named file (OR a folder)
  const isDirectory = fs.statSync(config.contractsDir).isDirectory();

  if (!isDirectory) {
    targets = [ path.normalize(config.contractsDir) ];
  } else {
    targetsPath = path.join(config.contractsDir, '**', '*.{sol,vy}');
    targets = shell.ls(targetsPath).map(path.normalize);
  }

  skipFiles = assembleSkipped(config, targets, skipFiles);

  return assembleTargets(config, targets, skipFiles)
}

function assembleTargets(config, targets=[], skipFiles=[]){
  const skipped = [];
  const filtered = [];
  const cd = config.contractsDir;

  for (let target of targets){
    if (skipFiles.includes(target) || path.extname(target) === '.vy'){

      skipped.push({
        canonicalPath: target,
        relativePath: toRelativePath(target, cd),
        source: loadSource(target)
      })

    } else {

      filtered.push({
        canonicalPath: target,
        relativePath: toRelativePath(target, cd),
        source: loadSource(target)
      })
    }
  }

  return {
    skipped: skipped,
    targets: filtered
  }
}

/**
 * Parses the skipFiles option (which also accepts folders)
 */
function assembleSkipped(config, targets, skipFiles=[]){
  // Make paths absolute
  skipFiles = skipFiles.map(contract => path.join(config.contractsDir, contract));

  // Enumerate files in skipped folders
  const skipFolders = skipFiles.filter(item => {
    return path.extname(item) !== '.sol' || path.extname(item) !== '.vy'
  });

  for (let folder of skipFolders){
    for (let target of targets ) {
      if (target.indexOf(folder) === 0)
        skipFiles.push(target);
     }
  };

  return skipFiles;
}

function loadSolcoverJS(config={}){
  let solcoverjs;
  let coverageConfig;
  let log = config.logger ? config.logger.log : console.log;
  let ui = new PluginUI(log);

  // Handle --solcoverjs flag
  (config.solcoverjs)
    ? solcoverjs = path.join(config.workingDir, config.solcoverjs)
    : solcoverjs = path.join(config.workingDir, '.solcover.js');

  // Catch solcoverjs syntax errors
  if (shell.test('-e', solcoverjs)){

    try {
      coverageConfig = require(solcoverjs);
    } catch(error){
      error.message = ui.generate('solcoverjs-fail') + error.message;
      throw new Error(error)
    }

  // Config is optional
  } else {
    coverageConfig = {};
  }

  // viaIR and solc versions are eval'd in `nomiclab.utils.normalizeConfig`
  coverageConfig.viaIR = config.viaIR;
  coverageConfig.usingSolcV4 = config.usingSolcV4;

  coverageConfig.log = log;
  coverageConfig.cwd = config.workingDir;
  coverageConfig.originalContractsDir = config.contractsDir;

  // Solidity-Coverage writes to Truffle config
  config.mocha = config.mocha || {};

  if (coverageConfig.mocha && typeof coverageConfig.mocha === 'object'){
    config.mocha = Object.assign(
      config.mocha,
      coverageConfig.mocha
    );
  }

  // Per fvictorio recommendation in #691
  if (config.mocha.parallel) {
    const message = ui.generate('mocha-parallel-fail');
    throw new Error(message);
  }

  return coverageConfig;
}

// ==========================
// Setup RPC Calls
// ==========================
async function getAccountsHardhat(provider){
  return provider.send("eth_accounts", [])
}

async function getNodeInfoHardhat(provider){
  return provider.send("web3_clientVersion", [])
}

// ==========================
// Finishing / Cleanup
// ==========================

/**
 * Silently removes temporary folders and calls api.finish to shut server down
 * @param  {TruffleConfig}     config
 * @param  {SolidityCoverage}  api
 * @return {Promise}
 */
async function finish(config, api){
  const {
    tempContractsDir,
    tempArtifactsDir
  } = getTempLocations(config);

  shell.config.silent = true;
  shell.rm('-Rf', tempContractsDir);
  shell.rm('-Rf', tempArtifactsDir);
  shell.config.silent = false;

  if (api) await api.finish();
}

module.exports = {
  assembleFiles,
  assembleSkipped,
  assembleTargets,
  checkContext,
  finish,
  getTempLocations,
  loadSource,
  loadSolcoverJS,
  reportSkipped,
  save,
  toRelativePath,
  setupTempFolders,
  getAccountsHardhat,
  getNodeInfoHardhat,
}