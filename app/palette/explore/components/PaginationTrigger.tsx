"use client";
import { PaletteType, fetchPublicPalettes } from "@/app/action";
import { useIntersect } from "../../../hooks/useIntersect";
import { useState } from "react";
import Card from "./Card";

let page = 2;

export default function PaginationTrigger() {
  const [data, setData] = useState<JSX.Element[]>();
  const [keepLoading, setKeepLoading] = useState(true);
  const [ref] = useIntersect(async () => {
    const palettes = await fetchPublicPalettes(page);

    if (palettes.length === 0) setKeepLoading(false);

    const newData = data ? [...data, ...palettes] : palettes;

    setData(newData);
    page++;
  });
  return (
    <>
      <section className="pt-20">
        <ul className="grid grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))] gap-20">
          {data}
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
