export function urlToGradient(url: string): string {
  const [colorsString, queryParams] = url.split("?");
  const searchParams = new URLSearchParams(queryParams);

  const colors = colorsString.split("-").map((clr) => "#" + clr);
  const type = searchParams.get("type");
  let angle = searchParams.get("angle");
  const circlePositionX = searchParams.get("circle-x");
  const circlePositionY = searchParams.get("circle-y");
  const stops = (searchParams.get("stops") as string)?.split("-");

  if (type === "horizontal") {
    angle = "90";
  } else if (type === "vertical") {
    angle = "0";
  }
  let typeGradient = `linear-gradient(${angle}deg, `;

  if (type === "circle" || (circlePositionX && circlePositionY)) {
    typeGradient = `radial-gradient(circle at ${circlePositionX || 50}% ${
      circlePositionY || 50
    }%, `;
  } else if (type === "conic") {
    typeGradient = "conic-gradient(";
  }

  let clrs = "";

  for (const i in colors) {
    clrs += colors[i];
    if (stops) {
      clrs += " " + stops[i] + "%";
    }
    if (+i + 1 !== colors.length) {
      clrs += ", ";
    }
  }

  return typeGradient + clrs + ")";
}
