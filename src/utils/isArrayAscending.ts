export function isArrayAscending(array: number[]): number {
  for (let i = 1; i < array.length; i++) {
    if (array[i] < array[i - 1]) {
      return i;
    }
  }
  return -1;
}
