import helmet from 'helmet';

import { RequestHandler } from 'express-serve-static-core';

export const securityLoaders = [
    (): RequestHandler => helmet()
];