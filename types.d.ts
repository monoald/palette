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

type CustomHistory = {
  data: string[];
  current: number;
};

type Color = {
  hex: string;
  isLocked: boolean;
  isSaved: boolean;
  contrastColor: string;
  id: string;
  formats: Formats;
  colorBlind: ColorBlindSimulator;
};

type Palette = {
  history: CustomHistory;
  colors: Array<Color>;
  currentColor?: string;
  isSaved: boolean;
};

type GradientColor = {
  id: string;
  hex: string;
  stop: number;
  formats: Formats;
  contrastColor: string;
};

type GradientStyle = {
  type: string;
  clrs: string;
  end: string;
};

type Gradient = {
  type: string;
  angle: number;
  clrs: GradientColor[];
  circlePosition: { x: number; y: number };
  currentColor?: string;
  history: CustomHistory;
  animation: string;
};

declare namespace JSX {
  interface IntrinsicElements {
    button: ExtendedButton;
    div: ExtendedDiv;
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

interface ExtendedDiv
  extends React.DetailedHTMLProps<React.DivHTMLAttributes, HTMLDivElement> {
  tooltip?: string;
  "tooltip-content"?: string;
  "tooltip-position"?: "left" | "right" | "top" | "bottom";
}
