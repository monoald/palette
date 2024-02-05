"use server";

import Card from "../app/palette/explore/components/Card";

export type PaletteType = {
  id: string;
  colors: string;
  colorsArr: string[];
  users: string[];
  length: number;
  savedCount: number;
  saved: boolean;
  upId: string;
};

export const getPublicPalettes = async (
  page: number
): Promise<JSX.Element[]> => {
  const response: PaletteType[] = await fetch(
    `http://localhost:3000/api/v1/public-palettes?page=${page}`
  ).then((res) => res.json());

  const palettes = response.map((palette) => {
    const colorsArr = palette.colors.split("-").map((clr) => "#" + clr);

    return { ...palette, colorsArr, saved: false };
  });

  return palettes.map((palette, index) => (
    <Card palette={palette} key={palette.id} index={index} />
  ));
};
