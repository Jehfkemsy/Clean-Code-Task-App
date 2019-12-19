"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const eventEmitter = new events_1.EventEmitter();
eventEmitter.on('USER_SIGNED_UP', (payload) => {
    console.log('User signed up', payload);
    // Add to queue.
});
