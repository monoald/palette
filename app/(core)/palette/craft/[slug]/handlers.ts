import {
  Format,
  makeColorPalette,
  Palette as PaletteType,
  Color as ColorType,
} from "colors-kit";
import { createColorObject } from "../../../../utils/createColorObject";
import { BasicCollection } from "@/app/(core)/me/action";

export function handleChangePalette(prevColors: Color[], type: PaletteType) {
  const newPalette = makeColorPalette({
    format: "hex",
    paletteType: type,
    quantity: 5,
  }) as string[];

  const newColors = [];

  for (const clrindex in prevColors) {
    if (prevColors[clrindex].isLocked) {
      const newColor = createColorObject(prevColors[clrindex].hex, "hex");
      newColor.isLocked = true;
      newColors.push(newColor);
    } else {
      newColors.push(createColorObject(newPalette[clrindex], "hex"));
    }
  }

  return newColors;
}

export function handleCreatePaletteFromUrl(
  url: string,
  colors: BasicCollection[] | undefined
) {
  const newPalette = url.split("-").map((clr) => "#" + clr);

  const newColors = newPalette.map((clr) => {
    const isSaved =
      colors?.findIndex((color) => color.name === clr.replace("#", "")) !== -1;

    return createColorObject(clr, "hex", {
      isSaved,
    });
  });

  return newColors;
}

export function handleUpdateColor(
  id: string,
  clr: ColorType,
  format: Format,
  palette: Color[]
): Color[] {
  const newPalette = [...palette];
  const index = newPalette.findIndex((clr) => clr.id === id);
  const colorToUpdate = newPalette[index];
  const newColorObject = createColorObject(clr, format, colorToUpdate);

  newPalette.splice(index, 1, newColorObject);

  return newPalette;
}

export function handleLockColor(colors: Color[], id: string) {
  const clrIndex = colors.findIndex((clr) => clr.id === id) as number;

  const newColors = [...colors];
  newColors[clrIndex] = {
    ...newColors[clrIndex],
    isLocked: !newColors[clrIndex].isLocked,
  };
  return newColors;
}

export function handleRemoveColor(colors: Color[], id: string) {
  const clrIndex = colors.findIndex((clr) => clr.id === id) as number;

  const newColors = [...colors];
  newColors.splice(clrIndex, 1);

  return newColors;
}

export function handleAddColor(
  color: string,
  index: number,
  palette: Color[]
): Color[] {
  const newPalette = [...palette];
  const newColorObject = createColorObject(color, "hex");

  newPalette.splice(index, 0, newColorObject);

  return newPalette;
}
