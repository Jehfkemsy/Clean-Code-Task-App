import * as Knex from 'knex';

import { User } from './../models/domain/user';
import { UserDalEntity } from './../models/entity/user';

import { IRepository } from './../../../common/repositories/repository';
import { BaseKnexRepository } from '../../../common/repositories/BaseKnexRepository';

import { IDomainPersistenceMapper } from './../../../common/mappers/domain-dal/mapper';

import { IUnitOfWork, IUnitOfWorkCapable } from './../../../common/unit-of-work/unit-of-work';
import { KnexUnitOfWork } from '../../../common/unit-of-work/UnitOfWork';
import { CommonErrors } from '../../../common/errors';

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
export default class UserRepository extends BaseKnexRepository implements IUserRepository {
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
        return this.handleErrors(async (): Promise<void> => {
            const dalUser = this.dataMapper.toPersistence(user);
            await this.dbContext<UserDalEntity>('users').insert(dalUser);
        });
    }

    async getAllUsers(): Promise<User[]> {
        return this.handleErrors(async (): Promise<User[]> => {
            const rawUsers = await this.dbContext<UserDalEntity>('users').select('*');
            return rawUsers.map(rawUser => this.dataMapper.toDomain(rawUser));
        });
    }

    async getUserById(id: string): Promise<User> {
        return this.handleErrors(async (): Promise<User> => {
            const rawUser = await this.dbContext<UserDalEntity>('users')
                .select()
                .where({ user_id: id })
                .first();

            if (!rawUser) {
                throw CommonErrors.NotFoundError.create('Could not find user');
            }

            return this.dataMapper.toDomain(rawUser);
        });
    }

    async findUserByEmail(email: string): Promise<User> {
        return this.handleErrors(async (): Promise<User> => {
            const user = await this.dbContext<UserDalEntity>('users').select().where({ email }).first();
            if (!user) throw CommonErrors.NotFoundError.create('Could not find user');
            return this.dataMapper.toDomain(user);
        });
    }

    async updateUser(user: User): Promise<void> {
        return this.handleErrors(async (): Promise<void> => {
            await this.dbContext<UserDalEntity>('users').select('*').where({ user_id: user.id }).update({
                ...this.dataMapper.toPersistence(user)
            });
        });
    }

    async removeUserById(id: string): Promise<void> {
        console.log('deleting', id)
        return this.handleErrors(async (): Promise<void> => {
            await this.dbContext<UserDalEntity>('users').where({ user_id: id }).del();
        });
    }

    async existsByUsername(username: string): Promise<boolean> {
        return this.handleErrors(async (): Promise<boolean> => {
            return !!await this.dbContext<UserDalEntity>('users').select().where({ username }).first();
        });
    }

    async existsByEmail(email: string): Promise<boolean> {
        return this.handleErrors(async (): Promise<boolean> => {
            return !!await this.dbContext<UserDalEntity>('users').select().where({ email }).first();
        });
    }

    async exists(t: User): Promise<boolean> {
        return this.handleErrors(async (): Promise<boolean> => {
            return !!await this.dbContext<UserDalEntity>('users')
                .select()
                .where({ ...this.dataMapper.toPersistence(t) })
                .first();
        });
    }

    async existsById(id: string): Promise<boolean> {
        return this.handleErrors(async (): Promise<boolean> => {
            return !!await this.dbContext<UserDalEntity>('users').select().where({ user_id: id }).first();
        });
    }

    public forUnitOfWork(unitOfWork: IUnitOfWork): this {
        return new UserRepository((unitOfWork as KnexUnitOfWork).trxContext, this.dataMapper) as this;
    }
}
