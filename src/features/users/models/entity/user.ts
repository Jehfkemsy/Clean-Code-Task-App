/**
 * Represents the persistence layer data shape of a user.
 */
export interface UserDalEntity {
    user_id: string;
    first_name: string;
    last_name: string;
    username: string;
    biography: string;
    email: string;
    password: string;
}