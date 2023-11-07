#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = require("commander");
var dinghy_1 = require("@tdurieux/dinghy");
var docker_parfum_1 = require("@tdurieux/docker-parfum");
var docker_type_1 = require("@tdurieux/dinghy/build/docker-type");
var program = new commander_1.Command();
program
    .description("Parse bash command and print the list of used command")
    .argument("<bash>", "command to parse")
    .action(function (bash) {
    return __awaiter(this, void 0, void 0, function () {
        var p, parser, root, output;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    bash = bash
                        .replace(/\\n/gm, "\n")
                        .replace(/\r\n/gm, "\n")
                        .replace(/#([^\\\n]*)$/gm, "#$1\\")
                        .replace(/\\([ \t]+)\n/gm, "$1\\\n")
                        .replace(/^([ \t]*)\n/gm, "$1\\\n");
                    p = new docker_type_1.Position(0, 0);
                    p.file = new dinghy_1.File(undefined, bash);
                    parser = new dinghy_1.ShellParser(bash, p);
                    return [4, parser.parse(0)];
                case 1:
                    root = _a.sent();
                    if (root) {
                        docker_parfum_1.enricher.enrich(root);
                        output = root
                            .getElements(dinghy_1.nodeType.BashCommand)
                            .filter(function (c) { return c.command; })
                            .map(function (c) {
                            var _a;
                            return {
                                annotations: c.annotations,
                                command: (_a = c.command) === null || _a === void 0 ? void 0 : _a.toString(),
                                categories: c.categories || [],
                                args: c.args.map(function (a) { return ({
                                    annotations: a.annotations,
                                    content: a.toString(),
                                }); }),
                            };
                        });
                        console.log(JSON.stringify(output, null, 2));
                    }
                    if (parser.errors.length > 0) {
                        return [2, console.log(JSON.stringify({ errors: parser.errors }, null, 2))];
                    }
                    return [2];
            }
        });
    });
});
program.parse();
//# sourceMappingURL=index.js.map