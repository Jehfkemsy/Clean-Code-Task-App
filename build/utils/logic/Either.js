"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Left {
    constructor(value) {
        this.value = value;
    }
    isLeft() {
        return true;
    }
    isRight() {
        return false;
    }
    applyOnRight(_) {
        return this;
    }
}
exports.Left = Left;
class Right {
    constructor(value) {
        this.value = value;
    }
    isLeft() {
        return false;
    }
    isRight() {
        return true;
    }
    applyOnRight(func) {
        return new Right(func(this.value));
    }
}
exports.Right = Right;
exports.left = (l) => new Left(l);
exports.right = (a) => new Right(a);
