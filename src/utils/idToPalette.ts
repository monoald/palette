export function idToPalette(url: string): string[] {
  const colors = url.split('-')

  const hexadecimalColors = colors.map(color => {
    return `#${color}`
  })

  return hexadecimalColors
}