"use server";

import Card from "./Card";

export type ColorType = {
  id: string;
  name: string;
  savedCount: number;
  saved: boolean;
};

export const getColors = async (page: number): Promise<JSX.Element[]> => {
  const response: ColorType[] = await fetch(
    `http://localhost:3000/api/v1/colors?page=${page}&limit=6`
  ).then((res) => res.json());

  return response.map((color, index) => (
    <Card color={color} key={color.id} index={index} />
  ));
};
