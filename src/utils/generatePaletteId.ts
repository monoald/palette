import CryptoJS from 'crypto-js'

export function generatePaletteId(palette: string): string {
  const sortedPalette = palette.split('-').sort().join('-')
  const hash = CryptoJS.SHA256(sortedPalette)
  const hexId = hash.toString(CryptoJS.enc.Hex)

  return hexId
}