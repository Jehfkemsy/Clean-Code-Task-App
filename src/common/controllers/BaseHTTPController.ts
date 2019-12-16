/* eslint-disable @typescript-eslint/no-explicit-any */

import * as HttpStatus from 'http-status-codes';
import { Response } from 'express';

import { HTTP } from './../interfaces/interfaces';

/**
 * Contains helper methods for HTTP Responses
 */
export class BaseHTTPController {
	public constructor (private readonly httpContext: HTTP.IHttpContext) {}

	//#region Success (2xx) Response Helpers

	/**
	 * Responds with status code 200 and the provided JSON to the HTTP Client.
	 * @param json JSON Response Payload.
	 */
	protected ok(json?: any): Response {
		return this.json(json, HttpStatus.OK);
	}

	/**
	 * Responds with status code 200 and the provided DTO to the HTTP Client.
	 * @param dto Response DTO
	 */
	protected withDTO<T>(dto: T): Response {
		return this.ok(dto);
	}

	/**
	 * Responds with a status code 201 and the provided JSON to the HTTP Client.
	 * @param json JSON Response Payload
	 */
	protected createdOk(json?: any): Response {
		return this.json(json, HttpStatus.OK);
	}

	//#endregion

	//#region Client Error (4xx) Response Helpers

	/**
	 * Responds with a status code 400 and the provided error to the HTTP Client.
	 * @param error The error message.
	 */
	protected clientError(error: any): Response {
		return this.json(error, HttpStatus.BAD_REQUEST);
	}

	//#endregion

	//#region Failure Errors

	/**
	 * Responds with a status code 500 and the provided JSON to the HTTP client.
	 * @param error Error response payload
	 */
	protected fail(error?: any): Response {
		return this.json(error, HttpStatus.INTERNAL_SERVER_ERROR);
	}

	//#endregion

	//#region Miscellaneous JSON Response Helpers

	/**
	 * Responds with the provided JSON and status code to the HTTP Client.
	 * @param json 		 JSON Response Payload
	 * @param statusCode HTTP Response Status Code
	 */
	protected json(json: any, statusCode = HttpStatus.OK): Response {
		return this.httpContext.res.status(statusCode).send(json);
	}
}