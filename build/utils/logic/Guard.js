"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Guard {
    static againstNullOrUndefined(argument, argumentName) {
        if (argument !== null && argument !== undefined)
            return { isSuccess: true };
        return { isSuccess: false, failedOn: argumentName };
    }
    static againstNullOrUndefinedCollection(args) {
        for (const { argument, argumentName } of args) {
            if (!this.againstNullOrUndefined(argument))
                return { isSuccess: false, failedOn: argumentName };
        }
        return { isSuccess: true, failedOn: '' };
    }
}
exports.Guard = Guard;
