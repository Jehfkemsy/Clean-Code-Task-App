/**
 * Represents a consistent business transaction in which all parts must 
 * succeed lest the entire operation be aborted.
 */
export interface IUnitOfWork {
    /**
     * Commits a given business transaction.
     */
    commit(): Promise<void>;

    /**
     * Rollsback a given business transaction.
     */
    rollback(): Promise<void>;
}

/**
 * Interface providing methods for building a Unit of Work.
 */
export interface IUnitOfWorkFactory {
    /**
     * Creates a new Unit of Work
     */
    create(): Promise<IUnitOfWork>;
}

/**
 * Represents a repository that may re-instantiate itself bound to a Unit of Work.
 */
export interface IUnitOfWorkCapable {
    /**
     * Provides a new instance of a repository bound to a Unit of Work.
     * @param unitOfWork The transaction context.
     */
    forUnitOfWork(unitOfWork: IUnitOfWork): this;
}