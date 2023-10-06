import { GradientInfo, GradientStyles } from '../features/gradient/gradientsSlice'
import { GradientType } from '../pages/Gradient'
import { makeGradientCalculus } from './makeGradientCalculus'

export const gradientToCss = (gradient: GradientType | GradientInfo): GradientStyles => {
  const css = []
  const gridCss = ['linear-gradient(90deg','']

  let newAngle
  if (gradient.type) {
    if (gradient.type === 'vertical') newAngle = 180
    if (gradient.type === 'horizontal') newAngle = 90
    if (gradient.type === 'grid') newAngle = 90
  }
  if (!gradient.type) newAngle = gradient.angle
  const newGradient = gradient.type === 'circle' ? 'radial-gradient(circle' : `linear-gradient(${newAngle}deg`

  css[0] = newGradient

  if (gradient.firstRow) {
    css[1] = makeGradientCalculus(gradient.firstRow)

    if (gradient.type === 'grid' && gradient.secondRow) {
      gridCss[1] = makeGradientCalculus(gradient.secondRow)
    }
  }

  const base = css.join('') + ')'
  const grid = gridCss[1] === '' ? undefined : gridCss.join('') + ')'

  return { base, grid }
}