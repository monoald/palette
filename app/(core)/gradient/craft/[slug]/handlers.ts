import { getMainContrastColor } from "@/app/utils/createColorObject";
import { makeRandomID } from "@/app/utils/makeRandomID";
import { replacePath, setParams } from "@/app/utils/urlState";
import {
  Color,
  Format,
  Palette,
  colorFormatConverter,
  hexToRgb,
  makeColorPalette,
} from "colors-kit";
import { ReadonlyURLSearchParams } from "next/navigation";

export function handleURLToGradient(
  slug: string,
  searchParams: ReadonlyURLSearchParams | URLSearchParams
): [Gradient, GradientStyle] {
  const stopsFromParams = searchParams.get("stops");
  const typeFromParams = searchParams.get("type");
  const angleFromParams = searchParams.get("angle");
  const circlePositionXFromParam = searchParams.get("circle-x");
  const circlePositionYFromParam = searchParams.get("circle-y");
  const animationFromParams = searchParams.get("animation");

  const clrsArr = slug.split("-");
  let type = "horizontal";
  let angle = 90;
  let circlePosition = { x: 50, y: 50 };
  let animation = "none";

  const step = 100 / (clrsArr.length - 1);
  let stops = clrsArr.map((el, i) => {
    return i * step;
  });

  // set Stops
  if (stopsFromParams) {
    stops = stopsFromParams.split("-").map((stop) => +stop);
  }

  // set Colors
  const clrs = clrsArr.map((clr, i) => ({
    id: makeRandomID(),
    hex: "#" + clr,
    stop: stops[i],
    formats: colorFormatConverter("#" + clr, {
      allFormats: true,
      currentFormat: "hex",
    }) as Formats,
    contrastColor: getMainContrastColor(hexToRgb("#" + clr)),
  }));

  // set Type
  if (typeFromParams) {
    type = typeFromParams;
  } else if (angleFromParams) {
    type = "horizontal";
  } else if (circlePositionXFromParam) {
    type = "circle";
  }

  // set Angle
  if (angleFromParams) {
    angle = +angleFromParams;
  } else if (typeFromParams === "horizontal") {
    angle = 90;
  } else if (typeFromParams === "vertical") {
    angle = 0;
  }

  // set Circle Position
  if (circlePositionXFromParam && circlePositionYFromParam) {
    circlePosition = {
      x: +circlePositionXFromParam,
      y: +circlePositionYFromParam,
    };
  }

  // set Stops
  if (stopsFromParams) {
    stops = stopsFromParams.split("-").map((stop) => +stop);
  }

  // set History
  const history = {
    data: [slug + "?" + searchParams.toString()],
    current: 0,
  };

  // set Animation
  if (animationFromParams) {
    animation = animationFromParams;
  }

  const gradient = {
    type,
    angle,
    clrs,
    circlePosition,
    history,
    animation,
  };

  const style = createStyle(gradient);

  return [gradient, style];
}

export function handleCraftGradient(
  history: CustomHistory
): [Gradient, GradientStyle] {
  const gradient = randomGradient(history);
  const style = createStyle(gradient);

  return [gradient, style];
}

export function handleUpdateProperty(
  property: string,
  value: any,
  gradient: Gradient
): [Gradient, GradientStyle] {
  const newGradient = { ...gradient };
  if (property === "type" && typeof value === "string") {
    newGradient.type = value;
    if (value === "horizontal") {
      newGradient.angle = 90;
    } else if (
      value === "vertical" ||
      value === "circle" ||
      value === "conic"
    ) {
      newGradient.angle = 0;
    }
  } else if (property === "angle" && typeof value === "number") {
    newGradient.angle = value;

    if (value === 0 || value === 360) {
      newGradient.type = "vertical";
    } else if (value === 90) {
      newGradient.type = "horizontal";
    }
  } else if (property === "position" && "x" in value) {
    newGradient.circlePosition = value;
  } else if (property === "stops" && "id" in value) {
    const newClrs = [...newGradient.clrs];

    const clrIndex = newClrs.findIndex((clr) => clr.id === value.id);

    newClrs[clrIndex].stop = value.stop;

    if (newClrs[clrIndex - 1] && value.stop < newClrs[clrIndex - 1].stop) {
      [newClrs[clrIndex], newClrs[clrIndex - 1]] = [
        newClrs[clrIndex - 1],
        newClrs[clrIndex],
      ];
    }

    if (newClrs[clrIndex + 1] && value.stop > newClrs[clrIndex + 1].stop) {
      [newClrs[clrIndex], newClrs[clrIndex + 1]] = [
        newClrs[clrIndex + 1],
        newClrs[clrIndex],
      ];
    }

    newGradient.clrs = newClrs;
  }

  const style = createStyle(newGradient);

  return [newGradient, style];
}

export function handleUpdateHistory(
  gradient: Gradient,
  replacePalette = false
): CustomHistory {
  const step = 100 / (gradient.clrs.length - 1);
  let evenStops = "";
  let currentStops = "";
  for (const i in gradient.clrs) {
    if (i !== "0") {
      evenStops += "-";
      currentStops += "-";
    }
    evenStops += +i * step;
    currentStops += gradient.clrs[i].stop;
  }

  const searchParams = updateParams(
    gradient.angle,
    gradient.type,
    gradient.circlePosition,
    gradient.animation,
    evenStops === currentStops ? undefined : currentStops
  );

  let prevSlug =
    gradient.history.data[gradient.history.data.length - 1].split("?")[0];

  if (replacePalette) {
    prevSlug = gradient.clrs
      .map((clr) => clr.hex.replace("#", ""))
      .join("-") as string;
    replacePath(prevSlug);
  }

  window.history.replaceState({}, "", searchParams);

  return {
    data: [...gradient.history.data, prevSlug + searchParams],
    current: gradient.history.data.length,
  };
}

export function handleUpdateColor(
  id: string,
  clr: Color,
  format: Format,
  clrs: GradientColor[]
): GradientColor[] {
  const newClrs = [...clrs];
  const newClrIndex = newClrs.findIndex((clr) => clr.id === id);
  const newClr = { ...newClrs[newClrIndex] };

  const { hex, cmyk, hsl, hsv, rgb, lab, xyz } = colorFormatConverter(clr, {
    allFormats: true,
    currentFormat: format,
  }) as Formats;

  newClr.hex = hex as string;
  newClr.formats = { cmyk, hsl, hsv, rgb, lab, xyz };

  newClrs.splice(newClrIndex, 1, newClr);

  return newClrs;
}

export function handleRemoveColor(id: string, clrs: GradientColor[]) {
  const newClrs = [...clrs];
  const index = newClrs.findIndex((clr) => clr.id === id);
  newClrs.splice(index, 1);

  return newClrs;
}

export function handleAddColor(clrs: GradientColor[]): GradientColor[] {
  const newClrs = clrs.map((clr) => {
    if (clr.stop >= 10) {
      clr.stop -= 10;
    }
    return clr;
  });

  newClrs.push({
    id: makeRandomID(),
    hex: "#ffffff",
    stop: 100,
    formats: colorFormatConverter("#ffffff", {
      allFormats: true,
      currentFormat: "hex",
    }) as Formats,
    contrastColor: getMainContrastColor(hexToRgb("#ffffff")),
  });

  return newClrs;
}

export function handleUpdateColorStyle(clrs: GradientColor[]): string {
  let clrsStyle = "";

  for (const i in clrs) {
    clrsStyle += `${clrs[i].hex} ${clrs[i].stop}%`;
    if (+i + 1 !== clrs.length) {
      clrsStyle += ", ";
    }
  }

  return clrsStyle;
}

function createStyle(gradient: Gradient): GradientStyle {
  let typeGradient = `linear-gradient(${gradient.angle}deg, `;

  if (gradient.type === "circle") {
    typeGradient = `radial-gradient(circle at ${gradient.circlePosition.x}% ${gradient.circlePosition.y}%, `;
  } else if (gradient.type === "conic") {
    typeGradient = "conic-gradient(";
  }

  let clrs = "";

  for (const i in gradient.clrs) {
    clrs += `${gradient.clrs[i].hex} ${gradient.clrs[i].stop}%`;
    if (+i + 1 !== gradient.clrs.length) {
      clrs += ", ";
    }
  }

  return { type: typeGradient, clrs: clrs, end: ")" };
}

function randomGradient(history: CustomHistory): Gradient {
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

  const clrs = newPalette.map((clr, i) => ({
    id: makeRandomID(),
    hex: clr,
    stop: 0,
    formats: colorFormatConverter(clr, {
      allFormats: true,
      currentFormat: "hex",
    }) as Formats,
    contrastColor: getMainContrastColor(hexToRgb(clr)),
  }));

  const step = 100 / (clrs.length - 1);
  for (const i in clrs) {
    clrs[i].stop = +i * step;
  }

  let circlePosition = { x: 50, y: 50 };

  if (type === "circle") {
    circlePosition = {
      x: Math.floor(Math.random() * (200 - 0 + 1) + 0) - 50,
      y: Math.floor(Math.random() * (200 - 0 + 1) + 0) - 50,
    };
  }

  const newUrl = newPalette.reduce((a, b) => a + "-" + b).replaceAll("#", "");
  replacePath(newUrl);
  const searchParams = updateParams(angle, type, circlePosition, "none");

  const newHistory = {
    data: [...history.data, newUrl + searchParams],
    current: history.data.length,
  };

  return {
    type,
    angle,
    clrs,
    circlePosition,
    history: newHistory,
    animation: "none",
  };
}

function updateParams(
  angle: number,
  type: string,
  circlePosition: { x: number; y: number },
  animation: string,
  stops?: string
): string {
  const searchParams = setParams([
    {
      name: "type",
      value:
        (angle !== 90 && angle !== 0) ||
        (type === "circle" && circlePosition.x !== 50)
          ? null
          : type,
    },
    {
      name: "stops",
      value: stops ? stops : null,
    },
    {
      name: "angle",
      value: angle === 90 || angle === 0 ? null : angle,
    },
    {
      name: "circle-x",
      value:
        (circlePosition.x === 50 && circlePosition.y === 50) ||
        type !== "circle"
          ? null
          : circlePosition.x,
    },
    {
      name: "circle-y",
      value:
        (circlePosition.x === 50 && circlePosition.y === 50) ||
        type !== "circle"
          ? null
          : circlePosition.y,
    },
    { name: "animation", value: animation === "none" ? null : animation },
  ]);

  return searchParams;
}
