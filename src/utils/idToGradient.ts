import { Gradient, GradientColor, GradientInfo } from '../features/gradient/gradientsSlice'
import { AnimationInfo, GradientAnimation } from '../features/gradientAnimations/gradientAnimationsSlice'
import { createUUID } from './createUUID'

export const idToGradient = (gradient: Partial<Gradient> | Partial<GradientAnimation>): Gradient => {
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
      id: createUUID(),
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
        id: createUUID(),
        color: `#${obj[0]}`
      })
      newSecondRow.stops.push(+obj[1])
    })

    newGradient.gradient.secondRow = newSecondRow
  }

  const newAnimationDuration = urlParams.get('ad')
  const newAnimationTiming = urlParams.get('ati')
  const newAnimationType = urlParams.get('aty')

  if (newAnimationDuration && newAnimationTiming && newAnimationType) {
    let backgroundSize = '100% 100%'
    let number = newGradient.gradient.firstRow.colors.length
    if (newGradient.gradient.secondRow) {
      number = newGradient.gradient.firstRow.colors.length > newGradient.gradient.secondRow.colors.length
        ? newGradient.gradient.firstRow.colors.length : newGradient.gradient.secondRow.colors.length
    }

    backgroundSize = `${number * 100 * 2}% ${number * 100 * 2}%`

    if (type === 'grid' || newAnimationType === 'spin') {
      backgroundSize = '100% 100%'
    }

    const newAnimations: AnimationInfo = {
      duration: +newAnimationDuration,
      timing: newAnimationTiming,
      type: newAnimationType,
      size: backgroundSize
    }

    newGradient.gradient.animation = newAnimations
  }

  return newGradient
}