"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    toPersistence: (user) => ({
        user_id: user.id,
        first_name: user.firstName,
        last_name: user.lastName,
        username: user.username,
        biography: user.biography,
        email: user.email,
        password: user.password
    }),
    toDomain: (raw) => ({
        id: raw.user_id,
        firstName: raw.first_name,
        lastName: raw.last_name,
        username: raw.username,
        biography: raw.biography,
        email: raw.email,
        password: raw.password
    })
});
