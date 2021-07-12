import { v4 as uuidv4 } from "uuid";

import { Listener } from "./type";

export default class MessageTransmitter {
    private listeners: Array<Listener>;

    constructor() {
        this.listeners = [];
    }

    register = (messageKey: string, handleMessage: Function) => {
        const listenerId = uuidv4();
        this.listeners.push({ messageKey, listenerId, handleMessage });

        return listenerId;
    };

    unsubscribe = (listenerId: string) => {
        const listenerIndex = this.listeners.findIndex((listener) => listener.listenerId === listenerId);

        this.listeners.splice(listenerIndex, 1);
    };

    clearAllListener = () => (this.listeners = []);

    broadcast = (message: any) => {
        for (const listener of this.listeners) {
            message[listener.messageKey] && listener.handleMessage(message);
        }
    };
}
