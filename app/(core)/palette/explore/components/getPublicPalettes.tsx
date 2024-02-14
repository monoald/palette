"use client";

export type PaletteType = {
  id: string;
  colors: string;
  colorsArr: string[];
  length: number;
  savedCount: number;
  saved: boolean;
  upId: string;
};

export const getPublicPalettes = async (
  page: number,
  id: string
): Promise<PaletteType[]> => {
  const response: PaletteType[] = await fetch(
    `http://localhost:3000/api/v1/public-palettes?page=${page}&limit=6&id=${id}`
  ).then((res) => res.json());

  const palettes = response.map((palette) => {
    const colorsArr = palette.colors.split("-").map((clr) => "#" + clr);

    return { ...palette, colorsArr };
  });

  return palettes;
};
