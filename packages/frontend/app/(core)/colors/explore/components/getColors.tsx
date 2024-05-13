"use client";

export type ColorType = {
  id: string;
  name: string;
  savedCount: number;
  saved: boolean;
};

const SERVER_URI = process.env.NEXT_PUBLIC_SERVER_URI;

export const getColors = async (
  page: number,
  id: string
): Promise<ColorType[]> => {
  const response: ColorType[] = await fetch(
    `${SERVER_URI}/colors?page=${page}&userId=${id}`
  ).then((res) => res.json());

  return response;
};
