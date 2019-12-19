import Knex from 'knex';

/**
 * Provides a database instance and connection pool.
 */
export default (): Knex => {
    return Knex({
        client: 'mysql',
        version: '8.0',
        connection: {
            host: '127.0.0.1',
            user: 'root',
            password: 'password', 
            database: 'testing_knex'
        }
    });
}