#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = require("commander");
var dinghy_1 = require("@tdurieux/dinghy");
var docker_parfum_1 = require("@tdurieux/docker-parfum");
var docker_type_1 = require("@tdurieux/dinghy/build/docker-type");
function isEmpty(value) {
    if (value === null || value === undefined) {
        return true;
    }
    if (Array.isArray(value)) {
        return value.every(isEmpty);
    }
    else if (typeof value === "object") {
        return Object.values(value).every(isEmpty);
    }
    return false;
}
function replacer(key, value) {
    return isEmpty(value) ? undefined : value;
}
var program = new commander_1.Command();
program
    .description("Parse bash command and print the list of used command")
    .argument("<bash>", "command to parse")
    .action(function (bash) {
    bash = bash
        .replace(/\\n/gm, "\n")
        .replace(/\r\n/gm, "\n")
        .replace(/#([^\\\n]*)$/gm, "#$1\\")
        .replace(/\\([ \t]+)\n/gm, "$1\\\n")
        .replace(/^([ \t]*)\n/gm, "$1\\\n");
    var p = new docker_type_1.Position(0, 0);
    p.file = new dinghy_1.File(undefined, bash);
    var parser = new dinghy_1.ShellParser(bash, p);
    var ast = undefined;
    var errors = null;
    try {
        ast = parser.parse();
    }
    catch (error) {
        if (error.errors) {
            errors = error.errors;
        }
        if (error.ast) {
            ast = error.ast;
        }
    }
    if (!ast) {
        console.log(JSON.stringify({ errors: errors || [] }, replacer, 2));
        return;
    }
    docker_parfum_1.enricher.enrich(ast);
    var output = ast
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
    console.log(JSON.stringify({
        commands: output,
        errors: errors,
    }, replacer, 2));
});
program.parse();
//# sourceMappingURL=index.js.map