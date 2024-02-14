"use client";

import { urlToGradient } from "@/app/(core)/me/utils/urlToGradients";

export type GradientType = {
  id: string;
  name: string;
  savedCount: number;
  style: string;
  saved: boolean;
  upId: string;
};

export const getPublicGradients = async (
  page: number,
  id: string
): Promise<GradientType[]> => {
  const response: GradientType[] = await fetch(
    `http://localhost:3000/api/v1/public-gradients?page=${page}&limit=6&id=${id}`
  ).then((res) => res.json());

  const gradients: GradientType[] = response.map((gradient) => {
    const style = urlToGradient(gradient.name);

    return { ...gradient, style };
  });

  return gradients;
};
