function changeIconColor(icon, color) {
  return icon
    .replaceAll(/fill="(?!none")[^"]*"/g, `fill="${color}"`)
    .replaceAll(/stroke="(?!none")[^"]*"/g, `stroke="${color}"`);
}

module.exports = changeIconColor;
