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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws = __importStar(require("aws-sdk"));
const core = __importStar(require("@actions/core"));
const io_helper_1 = require("./io-helper");
const fs = __importStar(require("fs"));
const stream_1 = require("stream");
const path_1 = __importDefault(require("path"));
function checkKey(key, prefix) {
    if (key != null) {
        if (prefix == null || prefix.length === 0)
            return true;
        if (prefix.endsWith('/'))
            return true;
        if (prefix === key)
            return true;
        if (key.startsWith(prefix + '/'))
            return true;
    }
    return false;
}
function createFolder(file) {
    const paths = file.split('/');
    const p = [];
    for (let i = 0, len = paths.length - 1; i < len; i++) {
        p.push(paths[i]);
        const v = p.join('/');
        if (v.length > 0 && !fs.existsSync(v)) {
            core.debug(`Creating directory ${v}`);
            fs.mkdirSync(v);
        }
    }
}
function saveFile(file, body) {
    core.debug(`Downloading file ${file}`);
    createFolder(file);
    if (typeof body === 'string' || body instanceof Uint8Array || body instanceof Buffer) {
        fs.writeFileSync(file, body);
        core.info(`Downloaded file ${file}`);
        return true;
    }
    else if (body instanceof Blob) {
        fs.createWriteStream(file).write(body);
        core.info(`Downloaded file ${file}`);
        return true;
    }
    else if (body instanceof stream_1.Readable) {
        fs.createWriteStream(file).write(body);
        core.info(`Downloaded file ${file}`);
        return true;
    }
    else {
        return false;
    }
}
(function run() {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const inputs = (0, io_helper_1.getInputs)();
            const endpoint = new aws.Endpoint(inputs.endpoint);
            aws.config.update({
                credentials: {
                    accessKeyId: inputs.awsAccessKeyId,
                    secretAccessKey: inputs.awsSecretAccessKey,
                },
                region: inputs.awsRegion,
            });
            const s3 = new aws.S3({ signatureVersion: 'v4', endpoint: endpoint });
            const outputs = {
                succeeded: 0,
                failed: 0
            };
            let startAfter = undefined;
            let objects;
            do {
                objects = yield s3.listObjectsV2({
                    Bucket: inputs.awsBucket,
                    Prefix: inputs.source,
                    StartAfter: startAfter
                }).promise();
                const contents = (_a = objects.Contents) !== null && _a !== void 0 ? _a : [];
                for (const content of contents) {
                    if (checkKey(content === null || content === void 0 ? void 0 : content.Key, inputs.source)) {
                        if (content.Key.endsWith('/')) {
                            core.warning(`Can't download file "${content.Key}"`);
                            outputs.failed++;
                        }
                        else {
                            const object = yield s3.getObject({
                                Bucket: inputs.awsBucket,
                                Key: content.Key
                            }).promise();
                            const file = path_1.default.join(inputs.target.endsWith('/') ? inputs.target : inputs.target + '/', content.Key.substring(inputs.source.length));
                            const saved = saveFile(file, object.Body);
                            if (saved) {
                                outputs.succeeded++;
                            }
                            else {
                                outputs.failed++;
                            }
                        }
                    }
                }
                if (objects.MaxKeys != null &&
                    objects.MaxKeys === objects.KeyCount &&
                    objects.KeyCount === contents.length &&
                    contents.length > 0) {
                    startAfter = (_c = (_b = objects.Contents) === null || _b === void 0 ? void 0 : _b.at(-1)) === null || _c === void 0 ? void 0 : _c.Key;
                }
            } while (startAfter != null);
            core.info(`Downloaded files from ${inputs.source} to ${inputs.target}.`);
            (0, io_helper_1.setOutputs)(outputs);
        }
        catch (err) {
            core.setFailed(err.message);
        }
    });
})();
