import { makeColorPalette } from "colors-kit";
import { redirect } from "next/navigation";

export default function page() {
  const newPalette = makeColorPalette({
    format: "hex",
    paletteType: "random",
    quantity: Math.floor(Math.random() * (5 - 2 + 1) + 2),
  }) as string[];

  const newUrl = newPalette.reduce((a, b) => a + "-" + b).replaceAll("#", "");

  // hostal

  redirect(`craft/${newUrl}`);
}
