import { Palette, makeColorPalette } from "colors-kit";
import { redirect } from "next/navigation";

export default function page() {
  const newPalette = makeColorPalette({
    format: "hex",
    paletteType: ["analogous", "complementary", "monochromatic", "shades"][
      Math.floor(Math.random() * (3 - 0 + 1) + 0)
    ] as Palette,
    quantity: Math.floor(Math.random() * (3 - 2 + 1) + 2),
  }) as string[];

  const type = ["horizontal", "vertical", "circle", "conic"][
    Math.floor(Math.random() * (3 - 0 + 1) + 0)
  ];
  let angle = Math.floor(Math.random() * (359 - 0 + 1) + 0);

  if (type === "circle" || type === "conic") {
    angle = 0;
  }

  let stops = "";
  const step = 100 / (newPalette.length - 1);
  for (const i in newPalette) {
    if (i !== "0") {
      stops += "-";
    }
    stops += +i * step;
  }

  let circlePosition = { x: 50, y: 50 };

  if (type === "circle") {
    circlePosition = {
      x: Math.floor(Math.random() * (200 - 0 + 1) + 0) - 50,
      y: Math.floor(Math.random() * (200 - 0 + 1) + 0) - 50,
    };
  }

  const paramsObject: { [key: string]: any } = {
    type,
  };

  if (!(angle === 90 || angle === 0)) {
    paramsObject["angle"] = angle;
  }

  if (circlePosition.x !== 50 && circlePosition.y !== 50) {
    paramsObject["circle-x"] = circlePosition.x;
    paramsObject["circle-y"] = circlePosition.y;
  }

  const newParams = new URLSearchParams(paramsObject).toString();
  const newGradient = newPalette
    .reduce((a, b) => a + "-" + b)
    .replaceAll("#", "");

  const newUrl = `${newGradient}?${newParams}`;

  redirect(`craft/${newUrl}`);
}
