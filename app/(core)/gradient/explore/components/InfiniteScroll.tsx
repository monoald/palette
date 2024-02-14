"use client";

import { useIntersect } from "../../../hooks/useIntersect";
import { useState } from "react";
import { GradientType, getPublicGradients } from "./getPublicGradients";
import Card from "./Card";
import useStateHandler from "@/app/(core)/hooks/useStateHandler";
import { useUserStore } from "@/store";

export default function InfiniteScroll() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<GradientType[]>();
  const [keepLoading, setKeepLoading] = useState(true);
  const userId = useUserStore((state) => state.user?.id);

  const [ref] = useIntersect(async () => {
    const palettes = await getPublicGradients(page, userId as string);

    if (palettes.length === 0) setKeepLoading(false);

    const newData = data ? [...data, ...palettes] : palettes;

    setData(newData);
    setPage(page + 1);
  });

  const saveGradientHandler = (e: Event) => {
    const event = e as CustomEvent;
    setData((prev) => {
      if (prev) {
        const newData = [...prev];
        const gradIndex = newData.findIndex(
          (grad) => grad.name === event.detail.name
        );
        const grad = { ...newData[gradIndex] };
        grad.saved = true;

        newData.splice(gradIndex, 1, grad);
        return newData;
      }
    });
  };

  const unsaveGradientHandler = (e: Event) => {
    const event = e as CustomEvent;
    setData((prev) => {
      if (prev) {
        const newData = [...prev];
        const gradIndex = newData.findIndex(
          (grad) => grad.name === event.detail.name
        );
        const grad = { ...newData[gradIndex] };
        grad.saved = false;

        newData.splice(gradIndex, 1, grad);
        return newData;
      }
    });
  };

  useStateHandler(
    [saveGradientHandler, unsaveGradientHandler],
    ["custom:saveGradient", "custom:unsaveGradient"]
  );
  return (
    <>
      <section>
        <ul className="grid grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))] gap-20">
          {data &&
            data.map((gradient, index) => (
              <Card gradient={gradient} key={gradient.id} index={index} />
            ))}
        </ul>
      </section>
      {keepLoading && (
        <section ref={ref}>
          <div className="flex items-center">
            <span className="mx-auto" id="loader"></span>
          </div>
        </section>
      )}
    </>
  );
}
