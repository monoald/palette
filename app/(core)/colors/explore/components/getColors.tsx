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
    `http://localhost:3000/api/v1/colors?page=${page}&limit=6&id=${id}`
  ).then((res) => res.json());

  return response;
};
