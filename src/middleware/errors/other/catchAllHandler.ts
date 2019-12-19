import { Request, Response, NextFunction } from 'express';

/**
 * Catch-all error handler. Bottom of stack.
 */
export const catchAllHandler = (
    err: Error,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction
): Response => {
    console.log(err);

    return res.status(500).send({ error: 'An unexpected error has occurred.' });
}