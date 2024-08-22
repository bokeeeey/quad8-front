import EventEmitter from 'events';

const eventEmitter = new EventEmitter();

export const emitCookieChange = () => {
  eventEmitter.emit('cookieChange');
};

export const onCookieChange = (listener: () => void) => {
  eventEmitter.on('cookieChange', listener);
};

export const offCookieChange = (listener: () => void) => {
  eventEmitter.off('cookieChange', listener);
};
