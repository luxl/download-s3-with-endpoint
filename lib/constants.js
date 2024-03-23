"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Outputs = exports.Inputs = void 0;
var Inputs;
(function (Inputs) {
    Inputs["AwsAccessKeyId"] = "aws_access_key_id";
    Inputs["AwsSecretAccessKey"] = "aws_secret_access_key";
    Inputs["AwsRegion"] = "aws_region";
    Inputs["AwsBucket"] = "aws_bucket";
    Inputs["Source"] = "source";
    Inputs["Target"] = "target";
    Inputs["Endpoint"] = "endpoint";
})(Inputs || (exports.Inputs = Inputs = {}));
var Outputs;
(function (Outputs) {
    Outputs["Succeeded"] = "succeeded";
    Outputs["Failed"] = "failed";
})(Outputs || (exports.Outputs = Outputs = {}));
