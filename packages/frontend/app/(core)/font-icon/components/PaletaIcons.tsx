"use client";

import { ChangeEvent, useState } from "react";
import { useIntersect } from "../../hooks/useIntersect";
import { svgs } from "../data/svg";
import Image from "next/image";
import { Icon } from "../craft/page";

type Props = {
  handleAddIcon: (svg: Icon) => void;
};

export default function PaletaIcons({ handleAddIcon }: Props) {
  const [itemsToShow, setItemsToShow] = useState(21);
  const [searchFilter, setSearchFilter] = useState("");

  const searchIconChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchFilter(e.target.value);
  };

  const [ref] = useIntersect(async () => {
    setItemsToShow(itemsToShow + 14);
  });

  return (
    <section className="w-full h-auto flex flex-col items-center gap-10">
      <h2 className="text-xl">Paleta Icons</h2>

      <div>
        <input
          className="px-4 text-center"
          type="text"
          value={searchFilter}
          placeholder="search icon..."
          onChange={searchIconChange}
        />
      </div>

      <div className="w-full h-auto grid grid-cols-[repeat(auto-fill,_minmax(140px,_1fr))] gap-8">
        {(searchFilter === ""
          ? svgs.slice(0, itemsToShow)
          : svgs.filter((svg) => svg.name.includes(searchFilter))
        ).map((icon) => (
          <article
            key={icon.id}
            className="p-5 border border-primary-border rounded-2xl flex flex-col items-center gap-3"
          >
            <Image
              className="icon__svg"
              width={36}
              height={36}
              src={`data:image/svg+xml;base64,${btoa(
                unescape(encodeURIComponent(icon.svg))
              )}`}
              alt={`icon ${icon.name}`}
            />

            <div className="relative w-full py-1 px-2 overflow-hidden text-center after:absolute after:top-0 after:right-0 after:w-10 after:h-full after:block after:bg-[linear-gradient(90deg,rgba(0,0,0,0),#03050c)]">
              <p className="whitespace-nowrap overflow-hidden">{icon.name}</p>
            </div>

            <button
              className="w-full py-1 border border-primary-border rounded-2xl flex items-center justify-center gap-2"
              onClick={() => handleAddIcon(icon)}
            >
              Add <span className="icon-plus" />
            </button>
          </article>
        ))}
        <div ref={ref} className="w-full h-5"></div>
      </div>
    </section>
  );
}
