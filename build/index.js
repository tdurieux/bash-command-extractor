#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = require("commander");
var server_1 = require("./server");
var parser_1 = require("./parser");
var utils_1 = require("./utils");
var program = new commander_1.Command();
program
    .description("Parse bash command and print the list of used command")
    .option("--server")
    .option("--smell")
    .option("-p, --port <port>", "port to listen to", "8080")
    .argument("[shell]", "command to parse")
    .action(function (bash, options) {
    if (options.server) {
        (0, server_1.startServer)({ port: parseInt(options.port), smell: options.smell });
    }
    else {
        console.log(JSON.stringify((0, parser_1.parseShell)(bash, { smell: options.smell }), utils_1.jsonReplacer, 2));
    }
});
program.parse();
//# sourceMappingURL=index.js.map