export async function uniquePaletteId(palette: string) {
  const encoder = new TextEncoder();

  const sortedPalette = palette.split('-').sort().join('-');
  const hash = await crypto.subtle.digest("SHA-256", encoder.encode(sortedPalette))
  const hashArray = Array.from(new Uint8Array(hash))
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return hashHex;
}
