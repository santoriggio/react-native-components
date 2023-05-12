
type MergedObject = {
  [key: string]: any;
};

/**
 * Deep merges multiple objects into a single merged object.
 * @param objects - The objects to be merged.
 * @returns The merged object.
 */

function deepMerge(...objects: any[]): any {
  const merged: MergedObject = {};

  for (const obj of objects) {
    for (const key in obj) {
      if (typeof obj[key] != "undefined") {
        if (obj[key] instanceof Object && key in merged) {
          // If the property is an object in both sources, recursively merge them
          merged[key] = deepMerge(merged[key], obj[key]);
        } else if (Array.isArray(obj[key])) {
          // If the property is an array, merge the array elements
          merged[key] = mergeArrays(merged[key], obj[key]);
        } else {
          // Otherwise, assign the property directly
          merged[key] = obj[key];
        }
      }
    }
  }

  return merged;
}

/**
 * Merges multiple arrays into a single array, handling duplicate elements by performing deep merging.
 * @param arrays - The arrays to be merged.
 * @returns The merged array.
 */

function mergeArrays(...arrays: any[][]): any[] {
  const merged: any[] = [];

  for (const arr of arrays) {
    if (arr !== undefined) {
      merged.push(...arr);
    }
  }

  return merged;
}

export default deepMerge;
