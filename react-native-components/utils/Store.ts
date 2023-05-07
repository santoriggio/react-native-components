import { MMKV } from "react-native-mmkv";

class Store<T extends {}> {
  mmkv_store: MMKV;

  constructor(id: string) {
    this.mmkv_store = new MMKV({
      id,
    });
  }

  set(key: keyof T, value: T[typeof key]) {
    this.mmkv_store.set(key.toString(), JSON.stringify(value));
  }

  get(key: keyof T) {
    return this.mmkv_store.getString(key.toString()) as T[typeof key];
  }

  getStore(): MMKV {
    return this.mmkv_store;
  }
}

export default Store;
