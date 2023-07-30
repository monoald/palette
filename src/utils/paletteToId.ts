import { Color } from "../pages/PaletteGenerator"

export function paletteToId(colors: Color[]): string {
  const url = colors.map(color => {
    return color.color.slice(1)
  }).join('-')
  
  return url.toLowerCase()
}