"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonReplacer = void 0;
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
function jsonReplacer(_, value) {
    return isEmpty(value) ? undefined : value;
}
exports.jsonReplacer = jsonReplacer;
//# sourceMappingURL=utils.js.map