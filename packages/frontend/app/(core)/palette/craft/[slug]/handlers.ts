import {
  Format,
  makeColorPalette,
  Palette as PaletteType,
  Color as ColorType,
  colorFormatConverter,
  toColorBlind,
} from "colors-kit";
import { createBaseColorObject } from "../../../../utils/createBaseColorObject";
import { BasicCollection } from "@/app/(core)/me/action";
import { createColorObject } from "@/app/utils/createColorObject";

export function handleChangePalette(prevColors: Color[], type: PaletteType) {
  const newPalette = makeColorPalette({
    format: "hex",
    paletteType: type,
    quantity: prevColors.length < 4 ? 5 : prevColors.length,
  }) as string[];

  const newColors = [];

  for (const clrindex in prevColors) {
    if (prevColors[clrindex].isLocked) {
      const newColor = createBaseColorObject(prevColors[clrindex].hex);
      newColor.isLocked = true;
      newColors.push(newColor);
    } else {
      newColors.push(createBaseColorObject(newPalette[clrindex]));
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
    const isSaved = colors
      ? colors.findIndex((color) => color.name === clr.replace("#", "")) !== -1
      : false;

    return createBaseColorObject(clr, {
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
  const newColorObject = createBaseColorObject(color);

  newPalette.splice(index, 0, newColorObject);

  return newPalette;
}

export function handleGetFormats(color: Color) {
  const { cmyk, hsl, hsv, lab, rgb, xyz } = colorFormatConverter(color.hex, {
    allFormats: true,
    currentFormat: "hex",
  }) as Formats;

  return {
    ...color,
    formats: {
      cmyk,
      hsv,
      hsl,
      lab,
      rgb,
      xyz,
    },
  };
}

export function handleGetColorBlind(
  colors: Color[],
  type: keyof ColorBlindSimulator
) {
  if (colors[0].colorBlind && colors[0].colorBlind[type]) {
    return colors;
  }

  const newColors = [...colors];
  for (const clr in newColors) {
    newColors[clr] = {
      ...newColors[clr],
      colorBlind: {
        ...newColors[clr].colorBlind,
        [type]: toColorBlind(newColors[clr].hex as string, type),
      },
    };
  }
  return newColors;
}
