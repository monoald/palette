export type Options = {
  name: string;
  options: string[];
};

export const options: { [key: string]: Options } = {
  "palette-type": {
    name: "palette-type",
    options: [
      "analogous",
      "complementary",
      "monochromatic",
      "mixed",
      "shades",
      "split-complementary",
      "square",
      "tetradic",
      "triadic",
      "random",
    ],
  },
  "color-blind": {
    name: "color-blind",
    options: [
      "achromatomaly",
      "achromatopsia",
      "deuteranomaly",
      "deuteranopia",
      "protanomaly",
      "protanopia",
      "tritanomaly",
      "tritanopia",
      "none",
    ],
  },
};
