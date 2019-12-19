"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Merges the provided arrays into one.
 * @param arrays Any given number of arrays of type T to merge.
 */
exports.mergeArrays = (...arrays) => {
    const union = [];
    arrays.forEach((array) => {
        array.forEach((tElem) => union.push(tElem));
    });
    return union;
};
