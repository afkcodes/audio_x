import { isValidArray, isValidFunction, isValidObject } from './common';

const listeners: any = {};
export const notifierState: any = {};

class ChangeNotifier {
  /**
   * this method notifies all the listener attached with the data received.
   *
   * @param eventName - Name of the event that the notifier has to notify.
   * @param data - the data with which the notify method has been called, will notify all the listeners with this data.
   * @param caller - caller is basically an identifier to know who has made the call to notify.
   * @returns void
   */

  static notify(
    eventName: string,
    data: any,
    caller: string = 'audiox_notifier_default'
  ) {
    const listenerCbs = listeners[eventName];

    if (!listenerCbs) return;

    if (isValidFunction(listenerCbs as Function) && data !== null) {
      console.log(`NOTIFYING TO EVENT : ${eventName} - CALLER : ${caller}`);

      /**
       * checks if the data is object then updates the local
       * state with the object destructure, if not then assign
       * the value
       */

      if (isValidObject(data)) {
        notifierState[eventName] = { ...notifierState[eventName], ...data };
      } else {
        notifierState[eventName] = data;
      }
      listenerCbs(notifierState[eventName]);
    }

    if (isValidArray(Array.from(listenerCbs) as Function[]) && data !== null) {
      if (isValidObject(data)) {
        notifierState[eventName] = { ...notifierState[eventName], ...data };
      } else {
        notifierState[eventName] = data;
      }
      listenerCbs.forEach((cb: Function) => {
        cb(notifierState[eventName]);
      });
    }
  }

  /**
   * this method registers a listeners to an event name which it will listen to,
   * works in conjunction with notify method.
   *
   * @param eventName - name of the event for which it will listen to changes
   * @param callback - any callback that needs to be called once the event is fired
   * @param state - default state for each event to which it listens to
   * @returns - a method that unsubscribe the events and basically deletes it
   */

  static listen(eventName: string, callback: Function, state = {}) {
    if (!listeners[eventName] && isValidFunction(callback)) {
      if (!notifierState[eventName]) {
        notifierState[eventName] = state;
      }
      listeners[eventName] = new Set().add(callback);
    } else {
      let callbackArr: any = [...listeners[eventName]];
      listeners[eventName].forEach(() => {
        callbackArr.push(callback);
      });
      listeners[eventName] = new Set(callbackArr);
    }

    /**
     * below we are returning the a function that would allow us to remove the listener,
     * which takes two parameters
     *
     * @param caller - identifier name who has made the call to unsubscribe.
     * @param resetState - a boolean flag which allow if the state needs to be destroyed when the listener is removed.
     */

    return (caller: string, resetState: boolean) => {
      if (listeners[eventName]) {
        console.log(
          `REMOVING EVENT LISTENER FOR EVENT : ${eventName} - CALLER : ${caller}`
        );
        delete listeners[eventName];
        if (resetState && notifierState[eventName]) {
          console.log(
            `RESETTING STATE FOR EVENT : ${eventName} - CALLER : ${caller}`
          );
          delete notifierState[eventName];
        }
      } else {
        console.log(`EVENT NOT FOUND : ${eventName}`);
      }
    };
  }
}

export default ChangeNotifier;
