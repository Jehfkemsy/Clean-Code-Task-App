/**
 * Represents a payload for a triggered event reacting to a user that has signed up.
 */
export interface IUserSignedUpEvent {
    id: string;
    email: string;
    firstName: string;
};

/**
 * Represents a payload for a triggered event reacting to a user that has logged in.
 */
export interface IUserLoggedInEvent {
    id: string;
}

/**
 * Represents a payload for a triggered event reacting to a user that has updated their account/profile.
 */
export interface IUserUpdatedEvent {
    id: string;
    passwordChanged: boolean;
}