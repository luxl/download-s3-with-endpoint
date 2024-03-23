"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setOutputs = exports.getInputs = exports.getBooleanInput = exports.isNotBlank = exports.isBlank = void 0;
const core = __importStar(require("@actions/core"));
const constants_1 = require("./constants");
function isBlank(value) {
    return value === null || value === undefined || (value.length !== undefined && value.length === 0);
}
exports.isBlank = isBlank;
function isNotBlank(value) {
    return value !== null && value !== undefined && (value.length === undefined || value.length > 0);
}
exports.isNotBlank = isNotBlank;
function getBooleanInput(name, options) {
    const value = core.getInput(name, options);
    return isNotBlank(value) &&
        ['y', 'yes', 't', 'true', 'e', 'enable', 'enabled', 'on', 'ok', '1']
            .includes(value.trim().toLowerCase());
}
exports.getBooleanInput = getBooleanInput;
function getInputs() {
    var _a, _b, _c;
    const result = {};
    result.awsAccessKeyId = core.getInput(constants_1.Inputs.AwsAccessKeyId, { required: true });
    result.awsSecretAccessKey = core.getInput(constants_1.Inputs.AwsSecretAccessKey, { required: true });
    result.awsRegion = core.getInput(constants_1.Inputs.AwsRegion, { required: true });
    result.awsBucket = core.getInput(constants_1.Inputs.AwsBucket, { required: true });
    result.endpoint = (_a = core.getInput(constants_1.Inputs.Endpoint, { required: false })) !== null && _a !== void 0 ? _a : 'https://s3.amazonaws.com';
    result.source = (_b = core.getInput(constants_1.Inputs.Source, { required: false })) !== null && _b !== void 0 ? _b : '';
    result.target = (_c = core.getInput(constants_1.Inputs.Target, { required: false })) !== null && _c !== void 0 ? _c : '.';
    return result;
}
exports.getInputs = getInputs;
function setOutputs(response, log) {
    let message = '';
    for (const key in constants_1.Outputs) {
        const field = constants_1.Outputs[key];
        if (log)
            message += `\n  ${field}: ${JSON.stringify(response[field])}`;
        core.setOutput(field, response[field]);
    }
    if (log)
        core.info('Outputs:' + message);
}
exports.setOutputs = setOutputs;
