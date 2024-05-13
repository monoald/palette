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

const SERVER_URI = process.env.NEXT_PUBLIC_SERVER_URI;

export const getPublicGradients = async (
  page: number,
  id: string
): Promise<GradientType[]> => {
  const response: GradientType[] = await fetch(
    `${SERVER_URI}/gradients?page=${page}&userId=${id}`
  ).then((res) => res.json());

  const gradients: GradientType[] = response.map((gradient) => {
    const style = urlToGradient(gradient.name);

    return { ...gradient, style };
  });

  return gradients;
};
