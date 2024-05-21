function generateCSS(name, color, icons) {
  let css = `@font-face {
  font-family: '${name}';
  src:
    url("${name}.eot") format("embedded-opentype"),
    url("${name}.woff") format("woff"),

  font-weight: normal;
  font-style: normal;
  font-display: block;
}

[class^="icon-"], [class*=" icon-"] {
  font-family: "${name}" !important;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale; ${color ? `\n  color: ${color};` : ""}
}`;

  icons.forEach((icon) => {
    let color = undefined;
    if (
      (icon.color && color && color !== icon.color) ||
      (icon.color && !color)
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
