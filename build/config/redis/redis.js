"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
const REDIS_URL = 'redis://127.0.0.1:6739';
const client = new ioredis_1.default(REDIS_URL);
const subscriber = new ioredis_1.default(REDIS_URL);
exports.opts = {
    createClient: (type) => {
        switch (type) {
            case 'client':
                return client;
            case 'subscriber':
                return subscriber;
            default:
                return new ioredis_1.default(REDIS_URL);
        }
    }
};
