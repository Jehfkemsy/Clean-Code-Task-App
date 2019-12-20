import 'source-map-support/register';

import * as awilix from 'awilix';
import appFactory from './app';

import databaseConnectionFactory from './config/database/connection';

// Dependency Injection
import { configureContainer } from './container/compositionRoot';

const container = configureContainer();
const knexInstance = databaseConnectionFactory();

container.register({ knexInstance: awilix.asValue(knexInstance) });
const PORT: number = (process.env.PORT && parseInt(process.env.PORT)) || 3000;

appFactory(container)   
    .listen(PORT, () => console.log(`Server is up on port ${PORT}`));
