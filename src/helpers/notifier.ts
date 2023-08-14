type ListenerCallback<T> = (data: T) => void;

class ChangeNotifier {
  private static listeners: Record<string, Set<ListenerCallback<any>>> = {};
  private static notifierState: Record<string, any> = {};

  private static validateEventName(eventName: string): void {
    if (!eventName || typeof eventName !== 'string') {
      throw new Error('Invalid event name');
    }
  }

  static notify<T>(
    eventName: string,
    data: T,
    caller: string = 'audiox_notifier_default'
  ): void {
    this.validateEventName(eventName);

    const listenerCbs = ChangeNotifier.listeners[eventName];

    if (!listenerCbs) return;

    if (data !== null) {
      console.log(`NOTIFYING TO EVENT : ${eventName} - CALLER : ${caller}`);

      ChangeNotifier.notifierState[eventName] = {
        ...(ChangeNotifier.notifierState[eventName] || {}),
        ...data
      };

      listenerCbs.forEach((cb: ListenerCallback<any>) => {
        cb(ChangeNotifier.notifierState[eventName]);
      });
    }
  }

  static listen<T>(
    eventName: string,
    callback: ListenerCallback<T>,
    state = {}
  ): () => void {
    this.validateEventName(eventName);

    if (typeof callback !== 'function') {
      throw new Error('Callback must be a function');
    }

    if (!ChangeNotifier.listeners[eventName]) {
      ChangeNotifier.notifierState[eventName] = state;
      ChangeNotifier.listeners[eventName] = new Set([callback]);
    } else {
      ChangeNotifier.listeners[eventName].add(callback);
    }

    return (): void => {
      const eventListeners = ChangeNotifier.listeners[eventName];

      if (!eventListeners) {
        console.log(`EVENT NOT FOUND : ${eventName}`);
        return;
      }

      console.log(`REMOVING EVENT LISTENER FOR EVENT : ${eventName}`);

      eventListeners.delete(callback);

      if (eventListeners.size === 0) {
        delete ChangeNotifier.listeners[eventName];
      }
    };
  }

  static multiListen<T>(
    eventName: string,
    callbacks: ListenerCallback<T>[],
    state = {}
  ): () => void {
    this.validateEventName(eventName);

    if (!Array.isArray(callbacks) || callbacks.length === 0) {
      throw new Error('Callbacks must be a non-empty array of functions');
    }

    const unsubscribeFunctions = callbacks.map((callback) =>
      ChangeNotifier.listen(eventName, callback, state)
    );

    return (): void => {
      unsubscribeFunctions.forEach((unsubscribe) => unsubscribe());
    };
  }

  // Retrieve the latest state data for a specific event
  static getLatestState<T>(eventName: string): T | undefined {
    this.validateEventName(eventName);

    return ChangeNotifier.notifierState[eventName];
  }
}

export default ChangeNotifier;
