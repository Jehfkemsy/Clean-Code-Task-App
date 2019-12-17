import * as Knex from 'knex';

import { User } from './../models/domain/user';
import { UserDalEntity } from './../models/entity/user';

import { IRepository } from './../../../common/repositories/repository';
import { BaseKnexRepository } from '../../../common/repositories/BaseKnexRepository';

import { IDomainPersistenceMapper } from './../../../common/mappers/domain-dal/mapper';

/**
 * Interface providing methods for use with persistence-related operations.
 */
export interface IUserRepository extends IRepository<User> {
    insertUser(user: User): Promise<void>;
    getAllUsers(): Promise<User[]>;
    getUserById(id: string): Promise<User>;
    findUserByEmail(email: string): Promise<User>;
    updateUser(user: User): Promise<void>;
    removeUserById(id: string): Promise<void>;
    existsByUsername(username: string): Promise<boolean>;
    existsByEmail(email: string): Promise<boolean>;
}

/**
 * Contains helper methods for interfacing with a given persistence technology.
 */
export class UserRepository extends BaseKnexRepository implements IUserRepository {
    private readonly dbContext: Knex | Knex.Transaction;
    private readonly dataMapper: IDomainPersistenceMapper<User, UserDalEntity>;

    public constructor (
        knexInstance: Knex | Knex.Transaction,
        userDomainPersistenceMapper: IDomainPersistenceMapper<User, UserDalEntity>
    ) {
        super();
        this.dbContext = knexInstance;
        this.dataMapper = userDomainPersistenceMapper;
    }

    async insertUser(user: User): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async getAllUsers(): Promise<User[]> {
        throw new Error("Method not implemented.");
    }

    async getUserById(id: string): Promise<User> {
        throw new Error("Method not implemented.");
    }

    async findUserByEmail(email: string): Promise<User> {
        throw new Error("Method not implemented.");
    }

    async updateUser(user: User): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async removeUserById(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async existsByUsername(username: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    async existsByEmail(email: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    async exists(t: User): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    async existsById(id: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
}