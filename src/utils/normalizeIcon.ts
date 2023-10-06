import { IconCollection } from '../features/icons/iconsSlice';

export function normalizeIcon(icon: IconCollection): IconCollection {
  const icons = [...icon.icons].map(ico => {
    
    let color = ico.color
    if (ico.color === '#') color = undefined
    return {
      name: ico.name,
      content: ico.content,
      unicode: ico.unicode,
      color: color
    }
  })

  const name = icon.name.toLowerCase().trim().replaceAll(' ', '-')

  const color = icon.color === '#' ? undefined : icon.color

  return { name, color, icons, thumbnail: '' }
}