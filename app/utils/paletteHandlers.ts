import { makeColorPalette } from "colors-kit";
import { createColorObject } from "./createColorObject";

export function handleCreateNewPalette(prevColors: Color[]) {
  const newPalette = makeColorPalette({
    format: "hex",
    paletteType: "random",
    quantity: 5,
  }) as string[];

  const newColors = [];

  for (const clrindex in prevColors) {
    if (prevColors[clrindex].isLocked) {
      newColors.push(prevColors[clrindex]);
    } else {
      newColors.push(createColorObject(newPalette[clrindex], "hex"));
    }
  }

  return newColors;
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
