"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const awilix_1 = require("awilix");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UnitOfWork_1 = require("./../common/unit-of-work/UnitOfWork");
/**
 * Builds a Dependency Injection Container.
 */
exports.configureContainer = () => {
    const container = awilix_1.createContainer({ injectionMode: awilix_1.InjectionMode.CLASSIC });
    // Awilix helper methods for Scoped Lifetime.
    const asClassScoped = (dep) => awilix_1.asClass(dep, { lifetime: awilix_1.Lifetime.SCOPED });
    const asFunctionScoped = (dep) => awilix_1.asFunction(dep, { lifetime: awilix_1.Lifetime.SCOPED });
    // Register Services, Repositories, Mappers, and Adapters.
    container.loadModules([
        [
            './../../build/features/*/services/*.js',
            {
                register: awilix_1.asClass,
                lifetime: awilix_1.Lifetime.SCOPED
            }
        ],
        [
            './../../build/features/*/repositories/*.js',
            {
                register: awilix_1.asClass,
                lifetime: awilix_1.Lifetime.SCOPED
            }
        ],
        [
            './../../build/features/*/mappers/*/*.js',
            {
                register: awilix_1.asFunction,
                lifetime: awilix_1.Lifetime.SCOPED
            }
        ],
        [
            './../../build/features/*/adapters/*.js',
            {
                register: awilix_1.asClass,
                lifetime: awilix_1.Lifetime.SCOPED
            }
        ]
    ], {
        cwd: __dirname,
        formatName: 'camelCase'
    });
    container.register({
        knexUnitOfWorkFactory: awilix_1.asClass(UnitOfWork_1.KnexUnitOfWorkFactory, { lifetime: awilix_1.Lifetime.SCOPED })
    });
    // Register third-party or `asValue` dependencies.
    return container.register({
        bcrypt: awilix_1.asValue(bcryptjs_1.default),
        jwt: awilix_1.asValue(jsonwebtoken_1.default)
    });
};
