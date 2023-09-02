import { Gradient, GradientColor, GradientInfo } from "../features/gradient/gradientsSlice"

export const idToGradient = (gradient: Partial<Gradient>): Gradient => {
  const newGradient = { ...gradient } as Gradient
  const urlParams = new URLSearchParams(gradient.name)

  const type = urlParams.get('t')
  const angle = urlParams.get('a')
  const firstRow: GradientColor = {
    colors: [],
    stops: []
  }

  urlParams.get('r1')?.split('_').forEach(color => {
    const obj = color.split('-')

    firstRow.colors.push({
      id: Math.floor(Math.random() * (1000 - 1 + 1)) + 1,
      color: `#${obj[0]}`
    })
    firstRow.stops.push(+obj[1])
  })

  newGradient.gradient = {} as GradientInfo

    newGradient.gradient.firstRow = firstRow

  if (type !== null) {
    newGradient.gradient.type = type
  }
  if (angle !== null) {
    newGradient.gradient.angle = +angle
  }

  if (urlParams.get('r2') && type === 'grid') {
    const newSecondRow: GradientColor = {
      colors: [],
      stops: []
    }

    urlParams.get('r2')?.split('_').forEach(color => {
      const obj = color.split('-')

      newSecondRow.colors.push({
        id: Math.floor(Math.random() * (1000 - 1 + 1)) + 1,
        color: `#${obj[0]}`
      })
      newSecondRow.stops.push(+obj[1])
    })

    newGradient.gradient.secondRow = newSecondRow
  }

  return newGradient
}