import { ulid } from 'ulid';

/**
 * User domain structure.
 */
export interface User {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    biography: string;
    email: string;
    password: string;
}

// For factory creation:

type IUserProps = Omit<User, 'id'>;

export const buildUser = (userProps: IUserProps, id?: string): User => {
    return {
        id: id ? id : ulid(),
        ...userProps
    };
}