import { EventEmitter } from 'events';

import { IUserSignedUpEvent } from './../payloads/payloadInterfaces';

const eventEmitter = new EventEmitter();

eventEmitter.on('USER_SIGNED_UP', (payload: IUserSignedUpEvent) => {
    console.log('User signed up', payload);     
});
