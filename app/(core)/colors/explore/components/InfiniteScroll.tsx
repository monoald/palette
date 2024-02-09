"use client";

import { useIntersect } from "../../../hooks/useIntersect";
import { useState } from "react";
import { getColors } from "./getColors";

let page = 2;

export default function InfiniteScroll() {
  const [data, setData] = useState<JSX.Element[]>();
  const [keepLoading, setKeepLoading] = useState(true);
  const [ref] = useIntersect(async () => {
    const colors = await getColors(page);

    if (colors.length === 0) setKeepLoading(false);

    const newData = data ? [...data, ...colors] : colors;

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