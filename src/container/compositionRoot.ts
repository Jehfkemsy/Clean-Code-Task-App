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

/**
 * Builds a Dependency Injection Container.
 */
export const configureContainer = (): AwilixContainer => {
    const container = createContainer({ injectionMode: InjectionMode.CLASSIC });

    // Awilix helper methods for Scoped Lifetime.
    const asClassScoped = <T extends Constructor<T>>(dep: T): BuildResolver<T> & DisposableResolver<T> => asClass(dep, { lifetime: Lifetime.SCOPED });
    const asFunctionScoped = <T extends FunctionReturning<T>>(dep: T): BuildResolver<T> & DisposableResolver<T> => asFunction(dep, { lifetime: Lifetime.SCOPED });

    // Register Controllers, Services, Repositories, and Adapters.
    container.loadModules([
        [
            './features/*/controllers/*.ts',
            {
                register: asClass,
                lifetime: Lifetime.SCOPED
            }
        ],
        [
            './features/*/services/*.ts',
            {
                register: asClass,
                lifetime: Lifetime.SCOPED
            }
        ],
        [
            './features/*/repositories/*.ts',
            {
                register: asClass,
                lifetime: Lifetime.SCOPED
            }
        ],
        [
            './features/*/adapters/*.ts',
            {
                register: asClass,
                lifetime: Lifetime.SCOPED
            }
        ]
    ], {
        cwd: __dirname,
        formatName: 'camelCase'
    });

    // Register third-party or `asValue` dependencies.
    return container.register({

    });
}