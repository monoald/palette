import { IconCollection } from "../features/icons/iconsSlice";

export function checkIconModified(original: IconCollection, current: IconCollection): boolean {
  if (original.name !== current.name) return true
  if (original.color !== current.color) return true
  if (original.icons.length !== current.icons.length) return true

  for (let i = 0; i < original.icons.length; i++) {
    const icon = original.icons[i];
    if (icon.name !== current.icons[i].name) return true
    if (icon.color !== current.icons[i].color) return true
    if (icon.unicode !== current.icons[i].unicode) return true
    if (icon.content !== current.icons[i].content) return true
  }

  return false
}