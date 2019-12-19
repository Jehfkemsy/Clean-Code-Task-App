"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const awilix = __importStar(require("awilix"));
const app_1 = __importDefault(require("./app"));
const connection_1 = __importDefault(require("./config/database/connection"));
// Dependency Injection
const compositionRoot_1 = require("./container/compositionRoot");
const container = compositionRoot_1.configureContainer();
const knexInstance = connection_1.default();
container.register({ knexInstance: awilix.asValue(knexInstance) });
const PORT = (process.env.PORT && parseInt(process.env.PORT)) || 3000;
app_1.default(container)
    .listen(PORT, () => console.log(`Server is up on port ${PORT}`));
