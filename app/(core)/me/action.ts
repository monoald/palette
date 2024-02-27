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
  colors: string;
  colorsArr: string[];
  length: number;
};

export type IconsCollection = BasicCollection & { thumbnail: string };

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
    `https://extinct-houndstooth-fly.cyclic.cloud/api/v1/users/collections`,
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
