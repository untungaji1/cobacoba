#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const is_node_version_to_warn_on_1 = require("./is-node-version-to-warn-on");
if ((0, is_node_version_to_warn_on_1.isNodeVersionToWarnOn)(process.version)) {
    console.warn(chalk_1.default.yellow.bold(`WARNING:`), `You are currently using Node.js ${process.version}, which is not supported by Hardhat. This can lead to unexpected behavior. See https://hardhat.org/nodejs-versions`);
    console.log();
    console.log();
}
require("./cli");
//# sourceMappingURL=bootstrap.js.map