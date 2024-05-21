const changeIconColor = require("../../_utils/changeSvgColor");
const Svg = require("./svg");

async function strokeToFill(svg, color, generalColor) {
  let clr = "#ffffff";
  if (color) clr = color;
  if (!color && generalColor) clr = generalColor;

  const blackSvg = changeIconColor(svg, "#000000");

  const newSvg = new Svg(blackSvg);
  let fixed = await newSvg.process();

  fixed = changeIconColor(fixed, clr);

  return fixed;
}

module.exports = strokeToFill;
