import * as HttpStatus from 'http-status-codes';

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
    protected ok(json?: any) {

	}
	
	/**
	 * Responds with status code 200 and the provided DTO to the HTTP Client.
	 * @param dto Response DTO
	 */
	protected withDTO<T>(dto: T) {

	}

	/**
	 * Responds with a status code 201 and the provided JSON to the HTTP Client.
	 * @param json JSON Response Payload
	 */
	protected createdOk(json?: any) {

	}

	//#endregion

	//#region Miscellaneous JSON Response Helpers
	
	/**
	 * Responds with the provided JSON and status code to the HTTP Client.
	 * @param json 		 JSON Response Payload
	 * @param statusCode HTTP Response Status Code
	 */
	protected json(json: any, statusCode = HttpStatus.OK) {
		return this.httpContext.res.status(statusCode).send(json);
	}
}