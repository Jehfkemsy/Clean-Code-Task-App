import { EventEmitter } from 'events';

import { IUserSignedUpEventPayload } from './../payloads/payloadInterfaces';

const eventEmitter = new EventEmitter();

eventEmitter.on('USER_SIGNED_UP', (payload: IUserSignedUpEventPayload) => {
    console.log('User signed up', payload);   
    
    // Add to queue.
});
