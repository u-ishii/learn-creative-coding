export const unique = <T, > (values: T[], calcHash: (v: T) => unknown): ReadonlyArray<T> => {
  const scannedHashes = new Set<unknown>();
  const uniqueValues: T[] = [];
  values.forEach((value) => {
    const hash = calcHash(value);
    if (!scannedHashes.has(hash)) {
      scannedHashes.add(hash);
      uniqueValues.push(value);
    }
  });
  return uniqueValues;
};
