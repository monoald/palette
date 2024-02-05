"use server";

import Card from "./Card";

export type GradientType = {
  id: string;
  name: string;
  savedCount: number;
  style: string;
  saved: boolean;
  upId: string;
};

export const getPublicGradients = async (
  page: number
): Promise<JSX.Element[]> => {
  const response: GradientType[] = await fetch(
    `http://localhost:3000/api/v1/public-gradients?page=${page}&limit=6`
  ).then((res) => res.json());

  const gradients: GradientType[] = response.map((gradient) => {
    const colorsArr = gradient.name.split("-").map((clr) => "#" + clr);
    let style = "linear-gradient(90deg, ";

    for (const i in colorsArr) {
      if (i !== "0") {
        style += ", ";
      }
      style += colorsArr[i];
    }

    style += ")";

    return { ...gradient, saved: false, style };
  });

  return gradients.map((gradient, index) => (
    <Card gradient={gradient} key={gradient.id} index={index} />
  ));
};
