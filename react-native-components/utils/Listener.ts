type ListenerType = (store: any, newValue?: any) => void;

/*
 *
 * Listener 1.0
 *
 *
 */

type EmitterType<E extends string> = Record<E, { listener: ListenerType[] }>;

class Listener<E extends string, T> {
  private emitter: EmitterType<E> = {} as EmitterType<E>;

  private value: T;

  constructor(initialValue: T) {
    this.value = initialValue;
  }

  add(event: E, listener: ListenerType): { remove: () => void } {
    let index = -1;
    let toReturn: any = undefined;

    if (typeof this.emitter[event] != "undefined") {
      //exist

      const listeners = this.emitter[event].listener;

      for (let i = 0; i < listeners.length; i++) {
        if (typeof listeners[i] == "undefined" || typeof listeners[i] != "function") {
          index = i;
          break;
        }
      }

      if (index < 0) {
        index = this.emitter[event].listener.length;
        this.emitter[event] = {
          listener: [...this.emitter[event].listener, listener],
        };
      } else {
        let listeners = this.emitter[event].listener;
        listeners[index] = listener;

        this.emitter[event] = {
          listener: listeners,
        };
      }

      toReturn = {
        remove: () => this.remove(event, index),
      };
    } else {
      this.emitter[event] = {
        listener: [listener],
      };

      toReturn = { remove: () => this.remove(event, 0) };
    }

    return toReturn;
  }

  remove(event: E, index: number) {
    // console.log("Prima:", this.emitter);

    // console.log(this.emitter[event], index);

    delete this.emitter[event].listener[index];

    //console.log("Dopo:", this.emitter);
  }

  emit(event: E, params?: T) {
    if (typeof this.emitter[event] != "undefined") {
      this.emitter[event].listener.forEach((list) => {
        if (typeof list != "undefined" && typeof list == "function") {
          const newStore = {
            ...this.value,
            ...params,
          };

          this.value = newStore;

          list(newStore, params);
        }
      });
    }
  }

  get(event: E) {
    return this.value;
  }

  getAllListeners() {
    return this.emitter;
  }

  // getEmitter() {
  //   console.log(this.emitter);
  //   return;
  // }
}

export default Listener;
