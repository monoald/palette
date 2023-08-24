export function getStops(step: number): number[] {
  let newStop = 0

  const newStops: number[] = []

  while (newStop <= 100) {
    newStops.push(newStop)
    newStop += step
  }

  return newStops
}