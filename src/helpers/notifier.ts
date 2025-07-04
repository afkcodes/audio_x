type ListenerCallback<T> = (data: T) => void;
type NotifierState = Record<string, unknown>;
type Listeners = Record<string, Set<ListenerCallback<unknown>>>;

// Use a module pattern instead of static class
const listeners: Listeners = {};
const notifierState: NotifierState = {};

const validateEventName = (eventName: string): void => {
  if (!eventName || typeof eventName !== 'string') {
    throw new Error('Invalid event name');
  }
};

const notify = <T>(eventName: string, data: T, caller = 'audiox_notifier_default'): void => {
  validateEventName(eventName);

  const listenerCbs = listeners[eventName];

  if (!listenerCbs) return;

  if (data !== null) {
    console.log(`NOTIFYING TO EVENT : ${eventName} - CALLER : ${caller}`);

    notifierState[eventName] = {
      ...(notifierState[eventName] || {}),
      ...data,
    };

    // Replace forEach with for...of
    for (const cb of listenerCbs) {
      cb(notifierState[eventName]);
    }
  }
};

// Listen to a single event
export const listen = <T>(
  eventName: string,
  callback: ListenerCallback<T>,
  state: T = {} as T,
): (() => void) => {
  validateEventName(eventName);

  if (typeof callback !== 'function') {
    throw new Error('Callback must be a function');
  }

  if (!listeners[eventName]) {
    notifierState[eventName] = state;
    listeners[eventName] = new Set<ListenerCallback<unknown>>();
  }
  // Type assertion is safe here because we control the callback registration
  (listeners[eventName] as Set<ListenerCallback<T>>).add(callback);

  return (): void => {
    const eventListeners = listeners[eventName] as Set<ListenerCallback<T>> | undefined;
    if (!eventListeners) {
      console.log(`EVENT NOT FOUND : ${eventName}`);
      return;
    }
    console.log(`REMOVING EVENT LISTENER FOR EVENT : ${eventName}`);
    eventListeners.delete(callback);
    if (eventListeners.size === 0) {
      delete listeners[eventName];
    }
  };
};

// Listen to multiple callbacks for an event
export const multiListen = <T>(
  eventName: string,
  callbacks: Array<ListenerCallback<T>>,
  state: T = {} as T,
): (() => void) => {
  validateEventName(eventName);
  if (!Array.isArray(callbacks) || callbacks.length === 0) {
    throw new Error('Callbacks must be a non-empty array of functions');
  }
  const unsubscribeFunctions = callbacks.map((callback) => listen(eventName, callback, state));
  return (): void => {
    for (const unsubscribe of unsubscribeFunctions) {
      unsubscribe();
    }
  };
};

// Retrieve the latest state data for a specific event
export const getLatestState = <T>(eventName: string): T | undefined => {
  validateEventName(eventName);
  return notifierState[eventName] as T | undefined;
};

export { notify };
