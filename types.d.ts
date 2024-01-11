interface Formats {
  cmyk: Cmyk;
  hsv: Hsv;
  hsl: Hsl;
  lab: Lab;
  rgb: Rgb;
  xyz: Xyz;
  hex?: string;
}

type Color = {
  hex: string;
  isLocked: boolean;
  contrastColor: string;
  id: string;
  formats: Formats;
  // colorBlind: ColorBlindSimulator;
};

type Palette = {
  colors: Array<Color>;
};
