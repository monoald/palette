function generateCSS(icons) {
  let css = `@font-face {
  font-family: '${icons.name}';
  src:
    url("${icons.name}.eot") format("embedded-opentype"),
    url("${icons.name}.woff") format("woff"),
    url("${icons.name}.woff2") format("woff2");

  font-weight: normal;
  font-style: normal;
  font-display: block;
}

[class^="icon-"], [class*=" icon-"] {
  font-family: "${icons.name}" !important;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale; ${
    icons.color ? `\n  color: ${icons.color};` : ""
  }
}`;

  icons.icons.forEach((icon) => {
    let color = undefined;
    if (
      (icon.color && icons.color && icons.color !== icon.color) ||
      (icon.color && !icons.color)
    ) {
      color = icon.color;
    }

    css = css.concat(`
.icon-${icon.name}:before {
  content: "\\${icon.unicode}"; ${color ? `\n  color: ${color};` : ""}
}
`);
  });

  return css;
}

module.exports = generateCSS;
