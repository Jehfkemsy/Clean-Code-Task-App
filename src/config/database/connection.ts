import Knex from 'knex';

/**
 * Provides a database instance and connection pool.
 */
export default (): Knex => {
    return Knex({
        client: 'pg',
        version: '11',
        connection: {
            host: '127.0.0.1',
            port: 5433,
            user: 'postgres',
            password: 'root', 
            database: 'testing_knex'
        }
    });
}

// TODO: Move to environment variables later!