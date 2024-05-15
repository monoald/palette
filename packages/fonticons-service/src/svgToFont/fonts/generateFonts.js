const svg2ttf = require("svg2ttf");
const ttf2woff = require("ttf2woff");
const ttf2eot = require("ttf2eot");
const ttf2woff2 = require("ttf2woff2");
const JSZip = require("jszip");

const generateCSS = require("./generateCss");

async function generateFonts(icons, svgFont) {
  const css = generateCSS(icons);
  const ttf = svg2ttf(svgFont, {});
  const eot = ttf2eot(ttf);
  const woff = ttf2woff(ttf);
  const woff2 = ttf2woff2(Buffer.from(ttf.buffer));

  const zip = new JSZip();

  zip.file(`${icons.name}.svg`, svgFont);
  zip.file(`${icons.name}.ttf`, Buffer.from(ttf.buffer));
  zip.file(`${icons.name}.eot`, eot);
  zip.file(`${icons.name}.woff`, Buffer.from(woff.buffer));
  zip.file(`${icons.name}.woff2`, woff2);
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
