export const generate2dArray = <T> (length1: number, length2: number, value: T): T[][] => (
  Array.from(
    { length: length1 },
    () => Array.from(
      { length: length2 },
      () => value,
    ),
  )
);
