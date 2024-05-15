"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseShell = void 0;
var dinghy_1 = require("@tdurieux/dinghy");
var docker_parfum_1 = require("@tdurieux/docker-parfum");
function parseShell(shell, options) {
    shell = shell.replace(/\\n/gm, "\n").replace(/\r\n/gm, "\n");
    var p = new dinghy_1.Position(0, 0);
    p.file = new dinghy_1.File(undefined, shell);
    var parser = new dinghy_1.ShellParser(shell, p);
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
        return { errors: errors || [] };
    }
    dinghy_1.enricher.enrich(ast);
    var commands = ast
        .getElements(dinghy_1.BashCommand)
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
    var output = {
        commands: commands,
        errors: errors,
    };
    if (options === null || options === void 0 ? void 0 : options.smell) {
        output.smells = new docker_parfum_1.Matcher(ast).matchAll();
    }
    return output;
}
exports.parseShell = parseShell;
//# sourceMappingURL=parser.js.map