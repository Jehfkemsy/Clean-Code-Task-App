/**
 * Merges the provided arrays into one.
 * @param arrays Any given number of arrays of type T to merge.
 */
export const mergeArrays = <T>(...arrays: T[][]): Array<T> => {
    const union: T[] = [];

    arrays.forEach((array: T[]) => {
        array.forEach((tElem: T) => union.push(tElem));
    });

    return union;
};