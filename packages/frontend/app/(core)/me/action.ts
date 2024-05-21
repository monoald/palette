import { urlToGradient } from "./utils/urlToGradients";

export type BasicCollection = {
  id: string;
  name: string;
};

export type GradientCollection = BasicCollection & {
  style: string;
};

export type PaletteCollection = {
  id: string;
  upId: string;
  name: string;
  colorsArr: string[];
  length: number;
};

export type FontIconsCollection = BasicCollection & {
  thumbnail: string;
  color?: string;
};

export type Collections = {
  colors: BasicCollection[];
  gradients: GradientCollection[];
  fonticons: FontIconsCollection[];
  palettes: PaletteCollection[];
};

const SERVER_URI = process.env.NEXT_PUBLIC_SERVER_URI;

export const getUserCollections = async (
  token: string
): Promise<Collections> => {
  const response: Collections = await fetch(`${SERVER_URI}/users/collections`, {
    headers: {
      authorization: `bearer ${token}`,
    },
  }).then((res) => res.json());

  const gradients: GradientCollection[] = response.gradients?.map(
    (gradient) => {
      const style = urlToGradient(gradient.name);

      return { ...gradient, style };
    }
  );

  const palettes = response.palettes?.map((palette) => {
    const colorsArr = palette.name.split("-").map((clr) => "#" + clr);

    return { ...palette, colorsArr };
  });

  return { ...response, gradients, palettes };
};
