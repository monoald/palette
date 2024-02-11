import { PaletteCollection } from "@/app/(core)/me/action";

export function isPaletteSaved(
  palettes: PaletteCollection[] | undefined,
  url: string
): boolean {
  if (palettes) {
    return (
      palettes.findIndex(
        (plt) =>
          plt.colors.split("-").sort().join("-") ===
          url.split("-").sort().join("-")
      ) !== -1
    );
  }
  return false;
}
