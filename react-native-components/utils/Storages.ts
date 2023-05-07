import Store from "./Store";

import { CacheType, StorageType } from "../../config.default";

export const Storage = new Store<StorageType>("default");

export const Cache = new Store<CacheType>("cache");
