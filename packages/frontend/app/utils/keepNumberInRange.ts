export function keepNumberInRange(min: number, max: number, number: number) {
  let value = number;

  if (min === 0 && value < 0) {
    value *= -1;
  } else if (value < min) {
    value = min;
  }

  if (value > max) {
    value = max;
  }

  return value;
}
