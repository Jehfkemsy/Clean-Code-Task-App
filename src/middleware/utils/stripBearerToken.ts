import { Request, Response, NextFunction } from 'express';

/** For a given Bearer Token of the form `Bearer <Token>, strips `<token>` removing `Bearer `.*/
export const stripBearerToken = (req: Request, res: Response, next: NextFunction): void => {
    console.log('stripping')

    const bearerToken: string | undefined = req.header('Authorization');

    if (bearerToken) {
        req.token = bearerToken.replace('Bearer ', '');
        return next();
    } else {
        req.token = '';
        return next();
    }
}