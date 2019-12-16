import { Request, Response, NextFunction } from 'express';

/** For a given Bearer Token of the form `Bearer <Token>, strips `<token>` removing `Bearer `.*/
export const stripBearerToken = (req: Request, res: Response, next: NextFunction): void => {
    try {
        req.token = req.header('Authorization')!.replace('Bearer ', '');
        next();
    } catch (e) {
        req.token = '';
    }
}