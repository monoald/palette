const parser = new DOMParser();

function setAttributes(
  paths: HTMLCollectionOf<SVGPathElement | SVGClipPathElement | SVGSVGElement>,
  color: string
) {
  const colorSvg = color === "#" ? "#ffffff" : color;

  for (let i = 0; i < paths.length; i++) {
    const attributes = paths[i].attributes as NamedNodeMap & {
      fill: { value: string };
      stroke: { value: string };
    };

    if (attributes.fill && attributes.fill.value !== "none") {
      attributes.fill.value = colorSvg;
    }

    if (attributes.stroke && attributes.stroke.value !== "none") {
      attributes.stroke.value = colorSvg;
    }
  }
}

export function changeSvgColor(icon: string, color: string): string {
  const svgDoc = parser.parseFromString(icon, "image/svg+xml");
  const svgs = svgDoc.getElementsByTagName("svg");
  setAttributes(svgs, color);

  const paths = svgDoc.getElementsByTagName("path");
  setAttributes(paths, color);

  const clipPaths = svgDoc.getElementsByTagName("clipPath");
  setAttributes(clipPaths, color);

  const rects = svgDoc.getElementsByTagName("rect");
  setAttributes(rects, color);

  const lines = svgDoc.getElementsByTagName("line");
  setAttributes(lines, color);

  const polylines = svgDoc.getElementsByTagName("polyline");
  setAttributes(polylines, color);

  const polygons = svgDoc.getElementsByTagName("polygon");
  setAttributes(polygons, color);

  const circles = svgDoc.getElementsByTagName("circle");
  setAttributes(circles, color);

  const ellipses = svgDoc.getElementsByTagName("ellipse");
  setAttributes(ellipses, color);

  return svgDoc.children[0].outerHTML;
}
