import { makeRandomID } from "@/app/utils/makeRandomID";
import { setParams } from "@/app/utils/urlState";
import { colorFormatConverter } from "colors-kit";
import { ReadonlyURLSearchParams } from "next/navigation";

export function handleCreateGradientOnFirstRender(
  slug: string,
  searchParams: ReadonlyURLSearchParams
): Gradient {
  const typeFromParams = searchParams.get("type");
  const angleFromParams = searchParams.get("angle");
  const circlePositionXFromParam = searchParams.get("circle-x");
  const circlePositionYFromParam = searchParams.get("circle-y");

  let type = "horizontal";
  let angle = 90;
  let circlePosition = { x: 50, y: 50 };

  // set Colors
  const clrs = slug.split("-").map((clr) => ({
    id: makeRandomID(),
    hex: "#" + clr,
    stop: 0,
    formats: colorFormatConverter("#" + clr, {
      allFormats: true,
      currentFormat: "hex",
    }) as Formats,
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
  const colors = gradient.clrs.map((clr) => clr.hex).join(", ");
  let typeGradient = `linear-gradient(${gradient.angle}deg, `;
  const type = searchParams.get("type");

  if (type === "circle" || searchParams.get("circle-x")) {
    typeGradient = `radial-gradient(circle at ${gradient.circlePosition.x}% ${gradient.circlePosition.y}%, `;
  } else if (type === "conic") {
    typeGradient = "conic-gradient(";
  }

  return { type: typeGradient, colors: colors, end: ")" };
}

export function handleUpdateGradientType(type: string): string {
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

export function handleUpdateGradientAngle(angle: number): string {
  return `linear-gradient(${angle}deg, `;
}

export function handleUpdateGradientCirclePosition(position: {
  x: number;
  y: number;
}): string {
  return `radial-gradient(circle at ${position.x}% ${position.y}%, `;
}
