import { AnimationInfo } from '../features/gradientAnimations/gradientAnimationsSlice'

export const gradientToAnimation = (animationInfo: AnimationInfo): string => {
  const animation = `${animationInfo.type} ${animationInfo.duration}s ${animationInfo.timing} infinite`

  return animation
}