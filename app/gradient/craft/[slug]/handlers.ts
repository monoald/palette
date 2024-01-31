import { getMainContrastColor } from "@/app/utils/createColorObject";
import { makeRandomID } from "@/app/utils/makeRandomID";
import { setParams } from "@/app/utils/urlState";
import { Color, Format, colorFormatConverter, hexToRgb } from "colors-kit";
import { ReadonlyURLSearchParams } from "next/navigation";

export function handleCreateGradientOnFirstRender(
  slug: string,
  searchParams: ReadonlyURLSearchParams
): Gradient {
  const stopsFromParams = searchParams.get("stops");
  const typeFromParams = searchParams.get("type");
  const angleFromParams = searchParams.get("angle");
  const circlePositionXFromParam = searchParams.get("circle-x");
  const circlePositionYFromParam = searchParams.get("circle-y");

  const clrsArr = slug.split("-");
  let type = "horizontal";
  let angle = 90;
  let circlePosition = { x: 50, y: 50 };

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

  return {
    type,
    angle,
    clrs,
    circlePosition,
  };
}

export function handleCreateStyles(
  searchParams: ReadonlyURLSearchParams,
  gradient: Gradient
): {
  type: string;
  colors: string;
  end: string;
} {
  let typeGradient = `linear-gradient(${gradient.angle}deg, `;
  const type = searchParams.get("type");

  if (type === "circle" || searchParams.get("circle-x")) {
    typeGradient = `radial-gradient(circle at ${gradient.circlePosition.x}% ${gradient.circlePosition.y}%, `;
  } else if (type === "conic") {
    typeGradient = "conic-gradient(";
  }

  let clrs = "";

  for (const i in gradient.clrs) {
    clrs += `${gradient.clrs[i].hex} ${gradient.clrs[i].stop}%`;
    if (+i + 1 !== gradient.clrs.length) {
      clrs += ", ";
    }
  }

  return { type: typeGradient, colors: clrs, end: ")" };
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

export function handleUpdateType(type: string): string {
  setParams([
    { name: "type", value: type },
    { name: "angle", value: null },
    { name: "circle-x", value: null },
    { name: "circle-y", value: null },
  ]);

  if (type === "horizontal") {
    return "linear-gradient(90deg, ";
  } else if (type === "vertical") {
    return "linear-gradient(0deg, ";
  } else if (type === "circle") {
    return "radial-gradient(circle, ";
  }

  return "conic-gradient(";
}

export function handleUpdateAngle(angle: number): string {
  return `linear-gradient(${angle}deg, `;
}

export function handleUpdateCirclePosition(position: {
  x: number;
  y: number;
}): string {
  return `radial-gradient(circle at ${position.x}% ${position.y}%, `;
}

export function handleUpdateStop(
  clrs: GradientColor[],
  id: string,
  stop: number
): GradientColor[] {
  const newClrs = [...clrs];

  const clrIndex = newClrs.findIndex((clr) => clr.id === id);

  newClrs[clrIndex].stop = stop;

  if (newClrs[clrIndex - 1] && stop < newClrs[clrIndex - 1].stop) {
    [newClrs[clrIndex], newClrs[clrIndex - 1]] = [
      newClrs[clrIndex - 1],
      newClrs[clrIndex],
    ];
  }

  if (newClrs[clrIndex + 1] && stop > newClrs[clrIndex + 1].stop) {
    [newClrs[clrIndex], newClrs[clrIndex + 1]] = [
      newClrs[clrIndex + 1],
      newClrs[clrIndex],
    ];
  }

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
