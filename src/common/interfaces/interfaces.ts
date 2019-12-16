import express from 'express';

/**
 * Base HTTP Data Structures
 */
export namespace HTTP {
    export interface IHttpContext {
        req: express.Request;
        res: express.Response;
    }
}