type CheckType = "isBoolean" | "isString" | "isArray" | "isObject";

function keyExist<T>(key: any, check?: CheckType): T | undefined {
  if (typeof key == "undefined" || key == null) return undefined;

  if (typeof key == "object" && Object.keys(key).length == 0) return undefined;

  return key;
}

export default keyExist;
