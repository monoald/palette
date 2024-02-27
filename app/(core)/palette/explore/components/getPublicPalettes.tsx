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
    `https://extinct-houndstooth-fly.cyclic.cloud/api/v1/public-palettes?page=${page}&limit=6&id=${id}`,
    {
      method: "GET",
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      },
    }
  ).then((res) => res.json());

  const palettes = response.map((palette) => {
    const colorsArr = palette.colors.split("-").map((clr) => "#" + clr);

    return { ...palette, colorsArr };
  });

  return palettes;
};
