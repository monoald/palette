const svg2ttf = require("svg2ttf");
const ttf2woff = require("ttf2woff");
const ttf2eot = require("ttf2eot");
// const ttf2woff2 = require("ttf2woff2");
const JSZip = require("jszip");

const generateCSS = require("./generateCss");

async function generateFonts(name, color, icons, svgFont) {
  const css = generateCSS(name, color, icons);
  const ttf = svg2ttf(svgFont, {});
  const eot = ttf2eot(ttf);
  const woff = ttf2woff(ttf);
  // const woff2 = ttf2woff2(Buffer.from(ttf.buffer));

  const zip = new JSZip();

  zip.file(`${name}.svg`, svgFont);
  zip.file(`${name}.ttf`, Buffer.from(ttf.buffer));
  zip.file(`${name}.eot`, eot);
  zip.file(`${name}.woff`, Buffer.from(woff.buffer));
  // zip.file(`${name}.woff2`, woff2);
  zip.file("styles.css", css);

  let str = "";

  await zip
    .generateAsync({ type: "base64", streamFiles: true })
    .then((zipStr) => {
      str = zipStr;
    });

  return str;
}

module.exports = generateFonts;
