import { makeColorPalette } from "colors-kit";
import { redirect } from "next/navigation";

export default function page() {
  const newPalette = makeColorPalette({
    format: "hex",
    paletteType: "random",
    quantity: 5,
  }) as string[];

  const newUrl = newPalette.reduce((a, b) => a + "-" + b).replaceAll("#", "");

  redirect(`craft/${newUrl}`);
}
