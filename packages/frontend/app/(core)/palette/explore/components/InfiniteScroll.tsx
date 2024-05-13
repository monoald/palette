"use client";

import { useIntersect } from "../../../hooks/useIntersect";
import { useState } from "react";
import { PaletteType, getPublicPalettes } from "./getPublicPalettes";
import { useUserStore } from "@/store";
import useStateHandler from "@/app/(core)/hooks/useStateHandler";
import Card from "./Card";

export default function InfiniteScroll() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<PaletteType[]>();
  const [keepLoading, setKeepLoading] = useState(true);
  const userId = useUserStore((state) => state.user?.id);

  const [ref] = useIntersect(async () => {
    const palettes = await getPublicPalettes(page, userId as string);

    if (palettes.length === 0) setKeepLoading(false);

    const newData = data ? [...data, ...palettes] : palettes;

    setData(newData);
    setPage(page + 1);
  });

  const savePaletteHandler = (e: Event) => {
    const event = e as CustomEvent;
    setData((prev) => {
      if (prev) {
        const newData = [...prev];
        const pltIndex = newData.findIndex(
          (plt) => plt.name === event.detail.colors
        );
        const plt = { ...newData[pltIndex] };
        plt.saved = true;

        newData.splice(pltIndex, 1, plt);
        return newData;
      }
    });
  };

  const unsavePaletteHandler = (e: Event) => {
    const event = e as CustomEvent;
    setData((prev) => {
      if (prev) {
        const newData = [...prev];
        const pltIndex = newData.findIndex(
          (plt) => plt.name === event.detail.colors
        );
        const plt = { ...newData[pltIndex] };
        plt.saved = false;

        newData.splice(pltIndex, 1, plt);
        return newData;
      }
    });
  };

  useStateHandler(
    [savePaletteHandler, unsavePaletteHandler],
    ["custom:savePalette", "custom:unsavePalette"]
  );

  return (
    <>
      <section>
        <ul className="grid grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))] gap-20">
          {data &&
            data.map((palette, index) => (
              <Card palette={palette} key={palette.id} index={index} />
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
