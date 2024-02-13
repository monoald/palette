"use client";

import { useIntersect } from "../../../hooks/useIntersect";
import { useState } from "react";
import { ColorType, getColors } from "./getColors";
import { useUserStore } from "@/store";
import Card from "./Card";
import useStateHandler from "@/app/(core)/hooks/useStateHandler";

let page = 1;

export default function InfiniteScroll() {
  const [data, setData] = useState<ColorType[]>();
  const [keepLoading, setKeepLoading] = useState(true);
  const userId = useUserStore((state) => state.user?.id);

  const [ref] = useIntersect(async () => {
    const colors = await getColors(page, userId as string);

    if (colors.length === 0) setKeepLoading(false);

    const newData = data ? [...data, ...colors] : colors;

    setData(newData);
    page++;
  });

  const saveColorHandler = (e: Event) => {
    const event = e as CustomEvent;
    setData((prev) => {
      if (prev) {
        const newData = [...prev];
        const clrIndex = newData.findIndex(
          (clr) => clr.name === event.detail.name
        );
        const clr = { ...newData[clrIndex] };
        clr.saved = true;

        newData.splice(clrIndex, 1, clr);
        return newData;
      }
    });
  };

  const unsaveColorHandler = (e: Event) => {
    const event = e as CustomEvent;
    setData((prev) => {
      if (prev) {
        const newData = [...prev];
        const clrIndex = newData.findIndex(
          (clr) => clr.name === event.detail.name
        );
        const clr = { ...newData[clrIndex] };
        clr.saved = false;

        newData.splice(clrIndex, 1, clr);
        return newData;
      }
    });
  };

  useStateHandler(
    [saveColorHandler, unsaveColorHandler],
    ["custom:saveColor", "custom:unsaveColor"]
  );

  return (
    <>
      <section>
        <ul className="grid grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))] gap-20">
          {data &&
            data.map((color, index) => (
              <Card color={color} key={color.id} index={index} />
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
