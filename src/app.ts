import express from 'express';
import { AwilixContainer } from 'awilix';

import { securityLoaders } from './loaders/security';
import { mergeArrays } from './utils/general/mergeArrays';


export default (container: AwilixContainer): express.Application => {
    const app = express();

    return app;
}