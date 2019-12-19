"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseKnexRepository_1 = require("../../../common/repositories/BaseKnexRepository");
/**
 * Contains helper methods for interfacing with a given persistence technology.
 */
class UserRepository extends BaseKnexRepository_1.BaseKnexRepository {
    constructor(
    //knexInstance: Knex | Knex.Transaction,
    userDomainPersistenceMapper) {
        super();
        // Test in-memory collection.
        this.users = [];
        //this.dbContext = knexInstance;
        this.dataMapper = userDomainPersistenceMapper;
    }
    insertUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.handleErrors(() => __awaiter(this, void 0, void 0, function* () {
                const dalUser = this.dataMapper.toPersistence(user);
                yield this.users.push(dalUser);
            }));
        });
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.handleErrors(() => __awaiter(this, void 0, void 0, function* () {
                const rawUsers = yield this.users;
                return rawUsers.map(rawUser => this.dataMapper.toDomain(rawUser));
            }));
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.handleErrors(() => __awaiter(this, void 0, void 0, function* () {
                const rawUser = yield this.users.filter(user => user.user_id === id)[0];
                return this.dataMapper.toDomain(rawUser);
            }));
        });
    }
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.handleErrors(() => __awaiter(this, void 0, void 0, function* () {
                const rawUser = yield this.users.filter(user => user.email === email)[0];
                if (!rawUser)
                    throw new Error();
                return this.dataMapper.toDomain(rawUser);
            }));
        });
    }
    updateUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.handleErrors(() => __awaiter(this, void 0, void 0, function* () {
                const oldRawUserIndex = yield this.users.findIndex(rawUser => rawUser.user_id === user.id);
                this.users[oldRawUserIndex] = this.dataMapper.toPersistence(user);
            }));
        });
    }
    removeUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.handleErrors(() => __awaiter(this, void 0, void 0, function* () {
                this.users = yield this.users.filter(user => user.user_id !== id);
            }));
        });
    }
    existsByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.handleErrors(() => __awaiter(this, void 0, void 0, function* () {
                return this.users.includes(this.users.filter(user => user.username === username)[0]);
            }));
        });
    }
    existsByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.handleErrors(() => __awaiter(this, void 0, void 0, function* () {
                return this.users.includes(this.users.filter(user => user.email === email)[0]);
            }));
        });
    }
    exists(t) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.handleErrors(() => __awaiter(this, void 0, void 0, function* () {
                return this.users.includes(this.dataMapper.toPersistence(t));
            }));
        });
    }
    existsById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.handleErrors(() => __awaiter(this, void 0, void 0, function* () {
                return this.users.includes(this.users.filter(user => user.user_id === id)[0]);
            }));
        });
    }
    forUnitOfWork(unitOfWork) {
        return new UserRepository(/*(unitOfWork as KnexUnitOfWork).trxContext,*/ this.dataMapper);
    }
}
exports.default = UserRepository;
