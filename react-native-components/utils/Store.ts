import { MMKV } from "react-native-mmkv";

class Store<T extends {}> {
  mmkv_store: MMKV;

  constructor(id: string) {
    this.mmkv_store = new MMKV({
      id,
    });
  }

  set(key: keyof T, value: T[typeof key]) {
    if (typeof value == "undefined") {
      this.remove(key);
    } else {
      this.mmkv_store.set(key.toString(), JSON.stringify(value));
    }
  }

  get(key: keyof T) {
    if (typeof key != "undefined") {
      const toReturn = this.mmkv_store.getString(key.toString()) as T[typeof key];

      if (typeof toReturn != "undefined") return JSON.parse(toReturn);
    }
  }

  remove(key: keyof T) {
    if (typeof key != "undefined") {
      this.mmkv_store.delete(key.toString());
    }
  }

  getStore(): MMKV {
    return this.mmkv_store;
  }

  clear() {
    this.mmkv_store.clearAll();
  }
}

export default Store;
