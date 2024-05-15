const { SVGPathData } = require("svg-pathdata");

const { Matrix } = require("./svg/Matrix");
const strokeToFill = require("./svg/strokeToFill");
const svgShapesToPath = require("./svg/svgshapes2svgpath");

const { parseString } = require("xml2js");

async function toSvgFont(icons, name, fontSize = 300) {
  const glyphs = [];

  for (const i in icons) {
    glyphs.push(await getGlyph(icons[i], name, 300));
  }

  const svgFont = `
<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd" >
<svg xmlns="http://www.w3.org/2000/svg">
  <defs>
    <font id="${name}" horiz-adv-x="${fontSize}">
      <font-face font-family="${name}"
        units-per-em="${fontSize}" ascent="${fontSize}"
        descent="0" />
      <missing-glyph horiz-adv-x="0" />
      ${glyphs.join("\n      ")}
    </font>
  </defs>
</svg>
`;
  return svgFont;
}

async function normalizeSvg(svg, color) {
  if (
    svg.svg.includes("stroke") &&
    !(svg.svg.includes('stroke="none"') || svg.svg.includes("stroke='none'"))
  ) {
    svg.svg = await strokeToFill(svg.svg, svg.color, color);
  }
  return svg;
}

function getGlyph(svg, name, fontSize) {
  return new Promise((resolve, reject) => {
    parseString(svg.svg, async (err, result) => {
      if (err) {
        reject("Error parsing SVG:", err);
        return;
      }

      let glyph = {
        name: svg.name,
        unicode: svg.unicode,
        paths: [],
      };
      glyph = { ...glyph, ...reduceSvg(result.svg.$, name, glyph, "svg") };

      if (result.svg.clipPath !== undefined) {
        for (const i in result.svg.clipPath) {
          glyph = {
            ...glyph,
            ...reduceSvg(result.svg.clipPath[i].$, name, glyph, "clipPath"),
          };
        }
      }

      if (result.svg.rect !== undefined) {
        for (const i in result.svg.rect) {
          glyph = {
            ...glyph,
            ...reduceSvg(result.svg.rect[i].$, name, glyph, "rect"),
          };
        }
      }

      if (result.svg.line !== undefined) {
        for (const i in result.svg.line) {
          glyph = {
            ...glyph,
            ...reduceSvg(result.svg.line[i].$, name, glyph, "line"),
          };
        }
      }

      if (result.svg.polyline !== undefined) {
        for (const i in result.svg.polyline) {
          glyph = {
            ...glyph,
            ...reduceSvg(result.svg.polyline[i].$, name, glyph, "polyline"),
          };
        }
      }

      if (result.svg.polygon !== undefined) {
        for (const i in result.svg.polygon) {
          glyph = {
            ...glyph,
            ...reduceSvg(result.svg.polygon[i].$, name, glyph, "polygon"),
          };
        }
      }

      if (result.svg.circle !== undefined) {
        for (const i in result.svg.circle) {
          glyph = {
            ...glyph,
            ...reduceSvg(result.svg.circle[i].$, name, glyph, "circle"),
          };
        }
      }

      if (result.svg.ellipse !== undefined) {
        for (const i in result.svg.ellipse) {
          glyph = {
            ...glyph,
            ...reduceSvg(result.svg.ellipse[i].$, name, glyph, "ellipse"),
          };
        }
      }

      if (result.svg.path !== undefined) {
        for (const i in result.svg.path) {
          glyph = {
            ...glyph,
            ...reduceSvg(result.svg.path[i].$, name, glyph, "path"),
          };
        }
      }

      const svgFont = getSvgFont(glyph, fontSize);

      resolve(svgFont);
    });
  });
}

function reduceSvg(element, name, glyph, tagName) {
  const transformStack = [new Matrix()];

  const applyTransform = (d) => {
    return new SVGPathData(d).matrix(
      ...transformStack[transformStack.length - 1].toArray()
    );
  };

  let values;
  let color;
  if (tagName !== "svg") {
    color = element.fill ? element.fill : element.stroke;
  }
  if (tagName === "svg") {
    if ("viewBox" in element) {
      values = element.viewBox.split(/\s*,*\s|\s,*\s*|,/);

      const dX = parseFloat(values[0]);
      const dY = parseFloat(values[1]);
      const width = parseFloat(values[2]);
      const height = parseFloat(values[3]);

      glyph.width = "width" in element ? parseFloat(element.width) : width;
      glyph.height = "height" in element ? parseFloat(element.height) : height;

      transformStack[transformStack.length - 1]
        .translate(-dX, -dY)
        .scale(glyph.width / width, glyph.height / height);
    } else {
      if ("width" in element) {
        glyph.width = parseFloat(element.width);
      } else {
        console.log(
          `Glyph "${name}" has no width attribute, using current glyph horizontal bounds.`
        );
        glyph.defaultWidth = true;
      }
      if ("height" in element) {
        glyph.height = parseFloat(element.height);
      } else {
        console.log(
          `Glyph "${name}" has no height attribute, using current glyph vertical bounds.`
        );
        glyph.defaultHeight = true;
      }
    }
  } else if ("clipPath" === tagName) {
    console.log(
      `Found a clipPath element in the icon "${name}" the result may be different than expected.`
    );
  } else if ("rect" === tagName && "none" !== color) {
    glyph.paths.push(applyTransform(svgShapesToPath.rectToPath(element)));
  } else if ("line" === tagName && "none" !== color) {
    console.log(
      `Found a line element in the icon "${name}" the result could be different than expected.`
    );
    glyph.paths.push(applyTransform(svgShapesToPath.lineToPath(element)));
  } else if ("polyline" === tagName && "none" !== color) {
    console.log(
      `Found a polyline element in the icon "${name}" the result could be different than expected.`
    );
    glyph.paths.push(applyTransform(svgShapesToPath.polylineToPath(element)));
  } else if ("polygon" === tagName && "none" !== color) {
    glyph.paths.push(applyTransform(svgShapesToPath.polygonToPath(element)));
  } else if (["circle", "ellipse"].includes(tagName) && "none" !== color) {
    glyph.paths.push(applyTransform(svgShapesToPath.circleToPath(element)));
  } else if ("path" === tagName && element.d && "none" !== color) {
    glyph.paths.push(applyTransform(element.d));
  }

  return glyph;
}

function getSvgFont(glyph, fontSize) {
  const ratio = fontSize / glyph.height;
  glyph.width *= ratio;
  glyph.height *= ratio;

  const glyphPath = new SVGPathData("");
  const yOffset = glyph.height;

  const glyphPathTransform = new Matrix().transform(1, 0, 0, -1, 0, yOffset);
  if (1 !== ratio) {
    glyphPathTransform.scale(ratio, ratio);
  }

  glyph.paths.forEach((path) => {
    glyphPath.commands.push(
      ...path.toAbs().matrix(...glyphPathTransform.toArray()).commands
    );
  });

  const bounds = glyphPath.getBounds();

  glyphPath.translate(
    (glyph.width - (bounds.maxX - bounds.minX)) / 2 - bounds.minX
  );
  glyphPath.translate(
    0,
    (fontSize - (bounds.maxY - bounds.minY)) / 2 - bounds.minY
  );

  const d = glyphPath.round(10000000000000).encode();

  const svgFont = `<glyph
        glyph-name="${glyph.name}"
        unicode="&#x${glyph.unicode};"
        horiz-adv-x="${glyph.width}"
        d="${d}"
      />
  `;

  return svgFont;
}

module.exports = { toSvgFont, normalizeSvg };
