import { GradientColor } from "../pages/Gradient"

export const makeGradientCalculus = (container: GradientColor): string => {
  let basicGradient = ''
  container.colors.map((color, index) => {
    basicGradient += `, ${color.color} ${container.stops[index]}%`
  })

  return basicGradient
}