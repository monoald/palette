type Formats = {
  cmyk: Cmyk;
  hsv: Hsv;
  hsl: Hsl;
  lab: Lab;
  rgb: Rgb;
  xyz: Xyz;
  hex?: string;
};

type ColorBlindSimulator = {
  achromatomaly: string;
  achromatopsia: string;
  deuteranomaly: string;
  deuteranopia: string;
  protanomaly: string;
  protanopia: string;
  tritanomaly: string;
  tritanopia: string;
};

type PaletteHistory = {
  data: string[];
  current: number;
};

type Color = {
  hex: string;
  isLocked: boolean;
  contrastColor: string;
  id: string;
  formats: Formats;
  colorBlind?: ColorBlindSimulator;
};

type Palette = {
  history: PaletteHistory;
  colors: Array<Color>;
};

declare namespace JSX {
  interface IntrinsicElements {
    button: ExtendedButton;
  }
}

interface ExtendedButton
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes,
    HTMLButtonElement
  > {
  tooltip?: string;
  "tooltip-content"?: string;
  "tooltip-position"?: "left" | "right" | "top" | "bottom";
}
