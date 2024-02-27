"use client";

export type ColorType = {
  id: string;
  name: string;
  savedCount: number;
  saved: boolean;
};

export const getColors = async (
  page: number,
  id: string
): Promise<ColorType[]> => {
  const response: ColorType[] = await fetch(
    `https://extinct-houndstooth-fly.cyclic.cloud/api/v1/colors?page=${page}&limit=6&id=${id}`,
    {
      method: "GET",
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      },
    }
  ).then((res) => res.json());

  return response;
};
