import { gradientToAnimation } from "./gradientToAnimation";
import { gradientToCss } from "./gradientToCss";
import { idToGradient } from "./idToGradient";
import { idToPalette } from "./idToPalette";

import { User } from "../features/auth/authSlice";
import { AnimationInfo, GradientAnimation } from "../features/gradientAnimations/gradientAnimationsSlice";

export function normalizeUserData(user: Partial<User>) {
  const newUserData = { ...user }
  if (newUserData.colors) {
    newUserData.colors.map(color => {
      color.name = `#${color.name}`
      color.saved = true
      return color
    })
  } else {
    newUserData.colors = []
  }

  if (newUserData.palettes) {
    newUserData.palettes.map(palette => {
      palette.colorsArr = idToPalette(palette.colors as string)
      palette.saved = true
      return palette
    })
  } else {
    newUserData.palettes = []
  }

  if (newUserData.gradients) {
    newUserData.gradients.map(gradient => {
      const newGradient = idToGradient(gradient)
      newGradient.saved = true
      return newGradient
    })
  } else {
    newUserData.gradients = []
  }

  if (newUserData['gradient-animations']) {
    newUserData['gradient-animations'].map(gradient => {
      const newGradientAnimation = idToGradient(gradient) as GradientAnimation
      newGradientAnimation.styles = gradientToCss(newGradientAnimation.gradient)
      newGradientAnimation.animation = gradientToAnimation(newGradientAnimation.gradient.animation as AnimationInfo)
      newGradientAnimation.saved = true
      
      return newGradientAnimation
    })
  } else {
    newUserData['gradient-animations'] = []
  }

  return newUserData
}