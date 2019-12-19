"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ulid_1 = require("ulid");
exports.buildUser = (userProps, id) => {
    return Object.assign({ id: id ? id : ulid_1.ulid() }, userProps);
};
