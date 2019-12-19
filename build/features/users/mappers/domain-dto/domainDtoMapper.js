"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mappers = {
    toUserResponseDTO(user) {
        return {
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                email: user.email,
                biography: user.biography
            }
        };
    }
};
