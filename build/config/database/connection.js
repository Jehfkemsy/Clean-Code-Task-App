"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const knex_1 = __importDefault(require("knex"));
/**
 * Provides a database instance and connection pool.
 */
exports.default = () => {
    return knex_1.default({
        client: 'mysql',
        version: '8.0',
        connection: {
            host: '127.0.0.1',
            user: 'root',
            password: 'password',
            database: 'testing_knex'
        }
    });
};
