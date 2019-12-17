/**
 * Represents a payload for a triggered event reacting to a user that has signed up.
 */
export interface IUserSignedUpEventPayload {
    id: string;
    email: string;
    firstName: string;
};

/**
 * Represents a payload for a triggered event reacting to a user that has logged in.
 */
export interface IUserLoggedInEventPayload {
    id: string;
};

/**
 * Represents a payload for a triggered event reacting to a user that has failed to log in.
 */
export interface IUserFailedLoggingInPayload {
    email: string;
    failedAttempts: number;
};

/**
 * Represents a payload for a triggered event reacting to a user that has updated their account/profile.
 */
export interface IUserUpdatedEventPayload {
    id: string;
    passwordChanged: boolean;
};