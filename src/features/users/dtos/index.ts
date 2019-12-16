export interface IUserDTO {
    firstName: string;
    lastName: string;
    username: string;
    biography: string;
    email: string;
    password: string;
}

//#region Creational DTOs
/**
 * Represents a user shape for creation.
 */
export interface CreateUserDTO extends IUserDTO {};
//#endregion

//#region Authorization DTOs
/**
 * Represents the required credentials to log in a user.
 */
export interface UserCredentialsDTO {
    email: string;
    password: string;
}
//#endregion

//#region Response DTOs
// Intentionally not using `IUserDTO` in case both interfaces become disjoint or diverge in the future.
/**
 * Represents a user shape for response.
 */
export interface UserResponseDTO {
    user: {
        id: string;
        firstName: string;
        lastName: string;
        username: string;
        biography: string;
        email: string;
    }
}

/**
 * Represents a collection of users for response.
 */
export interface UserCollectionResponseDTO {
    users: UserResponseDTO['user'][]
}

/**
 * Represents a token for a logged in user.
 */
export interface LoggedInUserResponseDTO {
    token: string;
}
//#endregion

//#region Update DTOs
// Intentionally not using `IUserDTO` in case both interfaces become disjoint or diverge in the future.
/**
 * Represents a user shape for updating.
 */
export interface UpdateUserDTO {
    firstName?: string;
    lastName?: string;
    username?: string;
    biography?: string;
    email?: string;
}
//#endregion