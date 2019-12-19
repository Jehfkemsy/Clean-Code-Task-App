import * as Knex from 'knex';

import { User } from './../models/domain/user';
import { UserDalEntity } from './../models/entity/user';

import { IRepository } from './../../../common/repositories/repository';
import { BaseKnexRepository } from '../../../common/repositories/BaseKnexRepository';

import { IDomainPersistenceMapper } from './../../../common/mappers/domain-dal/mapper';

import { IUnitOfWork, IUnitOfWorkCapable } from './../../../common/unit-of-work/unit-of-work';
import { KnexUnitOfWork } from '../../../common/unit-of-work/UnitOfWork';

/**
 * Interface providing methods for use with persistence-related operations.
 */
export interface IUserRepository extends IRepository<User>, IUnitOfWorkCapable {
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

    // Test in-memory collection.
    private users: UserDalEntity[] = [

    ];

    public constructor (
        knexInstance: Knex | Knex.Transaction,
        userDomainPersistenceMapper: IDomainPersistenceMapper<User, UserDalEntity>
    ) {
        super();
        this.dbContext = knexInstance;
        this.dataMapper = userDomainPersistenceMapper;
    }

    async insertUser(user: User): Promise<void> {
        return this.handleErrors(async (): Promise<void> => {
            const dalUser = this.dataMapper.toPersistence(user);
            await this.users.push(dalUser);
        });
    }

    async getAllUsers(): Promise<User[]> {
        return this.handleErrors(async (): Promise<User[]> => {
            const rawUsers = await this.users;
            return rawUsers.map(rawUser => this.dataMapper.toDomain(rawUser));
        });
    }

    async getUserById(id: string): Promise<User> {
        return this.handleErrors(async (): Promise<User> => {
            const rawUser = await this.users.filter(user => user.user_id === id)[0];
            return this.dataMapper.toDomain(rawUser);
        });
    }

    async findUserByEmail(email: string): Promise<User> {
        return this.handleErrors(async (): Promise<User> => {
            const rawUser = await this.users.filter(user => user.email === email)[0];
            if (!rawUser) throw new Error();
            return this.dataMapper.toDomain(rawUser);
        });
    }

    async updateUser(user: User): Promise<void> {
        return this.handleErrors(async (): Promise<void> => {
            const oldRawUserIndex = await this.users.findIndex(rawUser => rawUser.user_id === user.id);
            this.users[oldRawUserIndex] = this.dataMapper.toPersistence(user);
        });
    }

    async removeUserById(id: string): Promise<void> {
        return this.handleErrors(async (): Promise<void> => {
            this.users = await this.users.filter(user => user.user_id !== id);
        });
    }

    async existsByUsername(username: string): Promise<boolean> {
        return this.handleErrors(async (): Promise<boolean> => {
            return this.users.includes(this.users.filter(user => user.username === username)[0]);
        });
    }

    async existsByEmail(email: string): Promise<boolean> {
        return this.handleErrors(async (): Promise<boolean> => {
            return this.users.includes(this.users.filter(user => user.email === email)[0]);
        });
    }

    async exists(t: User): Promise<boolean> {
        return this.handleErrors(async (): Promise<boolean> => {
            return this.users.includes(this.dataMapper.toPersistence(t));
        });
    }

    async existsById(id: string): Promise<boolean> {
        return this.handleErrors(async (): Promise<boolean> => {
            return this.users.includes(this.users.filter(user => user.user_id === id)[0]);
        });
    }

    public forUnitOfWork(unitOfWork: IUnitOfWork): this {
        return new UserRepository((unitOfWork as KnexUnitOfWork).trxContext, this.dataMapper) as this;
    }
}
