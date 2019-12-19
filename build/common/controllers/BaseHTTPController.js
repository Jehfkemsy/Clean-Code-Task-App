"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const HttpStatus = __importStar(require("http-status-codes"));
/**
 * Contains helper methods for HTTP Responses
 */
class BaseHTTPController {
    constructor(httpContext) {
        this.httpContext = httpContext;
    }
    //#region Success (2xx) Response Helpers
    /**
     * Responds with status code 200 and the provided JSON to the HTTP Client.
     * @param json JSON Response Payload.
     */
    ok(json) {
        return this.json(json, HttpStatus.OK);
    }
    /**
     * Responds with status code 200 and the provided DTO to the HTTP Client.
     * @param dto Response DTO
     */
    withDTO(dto) {
        return this.ok(dto);
    }
    /**
     * Responds with a status code 201 and the provided JSON to the HTTP Client.
     * @param json JSON Response Payload
     */
    createdOk(json) {
        return this.json(json, HttpStatus.OK);
    }
    //#endregion
    //#region Client Error (4xx) Response Helpers
    /**
     * Responds with a status code 400 and the provided error to the HTTP Client.
     * @param error The error message.
     */
    clientError(error) {
        return this.json(error, HttpStatus.BAD_REQUEST);
    }
    //#endregion
    //#region Failure Errors
    /**
     * Responds with a status code 500 and the provided JSON to the HTTP client.
     * @param error Error response payload
     */
    fail(error) {
        return this.json(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    //#endregion
    //#region Miscellaneous JSON Response Helpers
    /**
     * Responds with the provided JSON and status code to the HTTP Client.
     * @param json 		 JSON Response Payload
     * @param statusCode HTTP Response Status Code
     */
    json(json, statusCode = HttpStatus.OK) {
        return this.httpContext.res.status(statusCode).send(json);
    }
}
exports.BaseHTTPController = BaseHTTPController;
