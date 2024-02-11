import { urlToGradient } from "./utils/urlToGradients";

export type BasicCollection = {
  id: string;
  name: string;
};

type GradientCollection = BasicCollection & {
  style: string;
};

type PaletteCollection = {
  id: string;
  colors: string;
  colorsArr: string[];
  length: number;
};

type IconsCollection = BasicCollection & { thumbnail: string };

export type Collections = {
  colors: BasicCollection[];
  gradients: GradientCollection[];
  icons: IconsCollection[];
  palettes: PaletteCollection[];
};

export const getUserCollections = async (
  token: string
): Promise<Collections> => {
  const response: Collections = await fetch(
    `http://localhost:3000/api/v1/users/collections`,
    {
      headers: {
        authorization: `bearer ${token}`,
      },
    }
  ).then((res) => res.json());

  const gradients: GradientCollection[] = response.gradients.map((gradient) => {
    const style = urlToGradient(gradient.name);

    return { ...gradient, style };
  });

  const palettes = response.palettes.map((palette) => {
    const colorsArr = palette.colors.split("-").map((clr) => "#" + clr);

    return { ...palette, colorsArr };
  });

  return { ...response, gradients, palettes };
};
