export interface IRepository<T> {
    exists(t: T): Promise<boolean>;
    existsById(id: string): Promise<boolean>;
}

/**
 * Work In Progress
 * @deprecated Work in Progress
 */
export class RepositoryManager {
    register<T>(repository: IRepository<T>): void {

    }
}