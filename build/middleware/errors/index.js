"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// Common, User, Auth Error Handlers.
const commonHandlers = __importStar(require("./common/handlers"));
const userHandlers = __importStar(require("./user/handlers"));
const authHandlers = __importStar(require("./auth/handlers"));
const handlerUnion = Object.assign(Object.assign(Object.assign({}, commonHandlers), userHandlers), authHandlers);
exports.errorHandlers = [];
Object.keys(handlerUnion).forEach(key => exports.errorHandlers.push(handlerUnion[key]));
__export(require("./other/errorHandlerProvider"));
__export(require("./other/catchAllHandler"));
