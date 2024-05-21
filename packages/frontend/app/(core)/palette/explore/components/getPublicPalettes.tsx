"use client";

export type PaletteType = {
  id: string;
  name: string;
  colorsArr: string[];
  length: number;
  savedCount: number;
  saved: boolean;
  upId: string;
};

const SERVER_URI = process.env.NEXT_PUBLIC_SERVER_URI;

export const getPublicPalettes = async (
  page: number,
  id: string
): Promise<PaletteType[]> => {
  const response: PaletteType[] = await fetch(
    `${SERVER_URI}/palettes?page=${page}&userId=${id ?? 0}`,
    {
      method: "GET",
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      },
    }
  ).then((res) => res.json());

  const palettes = response.map((palette) => {
    const colorsArr = palette.name.split("-").map((clr) => "#" + clr);

    return { ...palette, colorsArr };
  });

  return palettes;
};
