import Knex from 'knex';

import { IUnitOfWork, IUnitOfWorkFactory } from './unit-of-work';

/**
 * Represents a consistent business transaction with Knex in which all parts must 
 * succeed lest the entire operation be aborted.
 */
export interface IKnexUnitOfWork extends IUnitOfWork {
    trxContext: Knex.Transaction;
}

export class KnexUnitOfWork implements IKnexUnitOfWork {
    public constructor (public readonly trxContext: Knex.Transaction) {}

    public async commit(): Promise<void> {
        await this.trxContext.commit();
    }

    public async rollback(): Promise<void> {
        await this.trxContext.rollback();
    }
}

export class KnexUnitOfWorkFactory implements IUnitOfWorkFactory {
    public constructor (private readonly knexInstance: Knex) {}

    public async create (): Promise<IKnexUnitOfWork> {
        const trxContext = await this.knexInstance.transaction();
        return new KnexUnitOfWork(trxContext);
    }
}