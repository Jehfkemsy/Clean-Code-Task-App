import {
    asValue,
    asFunction,
    asClass, 
    Lifetime, 
    createContainer,
    InjectionMode, 
    AwilixContainer,
    Constructor,
    BuildResolver,
    FunctionReturning,
    DisposableResolver, 
} from 'awilix';

// Third-Party Deps
import bcrypt from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';

// Custom Deps
import { KnexUnitOfWorkFactory } from './../common/unit-of-work/UnitOfWork';

/**
 * Builds a Dependency Injection Container.
 */
export const configureContainer = (): AwilixContainer => {
    const container = createContainer({ injectionMode: InjectionMode.CLASSIC });

    // Awilix helper methods for Scoped Lifetime.
    // const asClassScoped = <T extends Constructor<T>>(dep: T): BuildResolver<T> & DisposableResolver<T> => asClass(dep, { lifetime: Lifetime.SCOPED });
    // const asFunctionScoped = <T extends FunctionReturning<T>>(dep: T): BuildResolver<T> & DisposableResolver<T> => asFunction(dep, { lifetime: Lifetime.SCOPED });

    // Register Services, Repositories, Mappers, and Adapters.
    container.loadModules([
        [
            './../../build/features/*/services/*.js',
            {
                register: asClass,
                lifetime: Lifetime.SCOPED
            }
        ],
        [
            './../../build/features/*/repositories/*.js',
            {
                register: asClass,
                lifetime: Lifetime.SCOPED
            }
        ],
        [
            './../../build/features/*/mappers/*/*.js',
            {
                register: asFunction,
                lifetime: Lifetime.SCOPED
            }
        ],
        [
            './../../build/features/*/adapters/*.js',
            {
                register: asClass,
                lifetime: Lifetime.SCOPED
            }
        ]
    ], {
        cwd: __dirname,
        formatName: 'camelCase'
    });

    // Register custom dependencies.
    container.register({
        knexUnitOfWorkFactory: asClass(KnexUnitOfWorkFactory, { lifetime: Lifetime.SCOPED })
    })

    // Register third-party or `asValue` dependencies.
    return container.register({
        bcrypt: asValue(bcrypt),
        jwt: asValue(jsonwebtoken)
    });
}