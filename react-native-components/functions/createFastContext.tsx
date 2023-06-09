import React, { useRef, createContext, useContext, useCallback, useSyncExternalStore } from "react";
import Emitter from "js-fast-emitter";
export default function createFastContext<Store>(initialState: Store) {
  const _listener = new Emitter();

  function useStoreData(): {
    get: () => Store;
    set: (value: Partial<Store>) => void;
    subscribe: (callback: () => void) => () => void;
  } {
    const store = useRef(initialState);

    const get = useCallback(() => store.current, []);

    const subscribers = useRef(new Set<() => void>());

    const set = useCallback((value: Partial<Store>) => {
      store.current = { ...store.current, ...value };
      subscribers.current.forEach((callback) => callback());
    }, []);

    const subscribe = useCallback((callback: () => void) => {
      subscribers.current.add(callback);
      return () => subscribers.current.delete(callback);
    }, []);

    return {
      get,
      set,
      subscribe,
    };
  }

  type UseStoreDataReturnType = ReturnType<typeof useStoreData>;

  const StoreContext = createContext<UseStoreDataReturnType | null>(null);

  function addListener(event: string, listener: (event?: any) => void) {
    return _listener.add(event, listener);
  }

  function emitListener(event: string, params?: any) {
    _listener.emit(event, params);
  }

  function Provider({ children }: { children: React.ReactNode }) {
    return <StoreContext.Provider value={useStoreData()}>{children}</StoreContext.Provider>;
  }

  function useStore<SelectorOutput>(
    selector: (store: Store) => SelectorOutput
  ): [SelectorOutput, (value: Partial<Store>) => void] {
    const store = useContext(StoreContext);
    if (!store) {
      throw new Error("Store not found");
    }

    const state = useSyncExternalStore(store.subscribe, () => selector(store.get()));

    return [state, store.set];
  }

  return {
    addListener,
    emitListener,
    Provider,
    useStore,
  };
}
