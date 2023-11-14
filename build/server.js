"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = void 0;
var express_1 = __importDefault(require("express"));
var compression_1 = __importDefault(require("compression"));
var parser_1 = require("./parser");
function startServer(options) {
    if (options === void 0) { options = { port: 8080, smell: false }; }
    var app = (0, express_1.default)();
    app.use(express_1.default.text());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use((0, compression_1.default)({ level: 6 }));
    app.post("/", function (req, res) {
        var body = req.headers["content-type"] == "application/json"
            ? JSON.parse(req.body)
            : req.body;
        if (body) {
            if (Array.isArray(body)) {
                var output = body.map(function (b) { return (0, parser_1.parseShell)(b, { smell: options.smell }); });
                return res.json(output);
            }
            else if (typeof body === "string") {
                return res.json((0, parser_1.parseShell)(body, { smell: options.smell }));
            }
        }
        return res.status(400).json({ error: "invalid request" });
    });
    app.listen(options.port, function () {
        console.log("Example app listening on port ".concat(options.port, "!"));
    });
}
exports.startServer = startServer;
//# sourceMappingURL=server.js.map