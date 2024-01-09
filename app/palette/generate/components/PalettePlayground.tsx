"use client";

import React, { PointerEvent, useRef, useState } from "react";

type Props = {
  palette: Palette;
};

export default function PalettePlayground({ palette }: Props) {
  const placeholderRef = useRef<HTMLDivElement>(null);
  const [currentElement, setCurrentElement] = useState<null | HTMLElement>();
  const [offset, setOffset] = useState(0);

  const handlePointerDown = (e: PointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const target = e.target as HTMLElement;
    const bar = target.parentElement as HTMLElement;

    const width = bar.getBoundingClientRect().width;
    const left = bar.getBoundingClientRect().x;

    const placeholder = placeholderRef.current as HTMLElement;
    placeholder.classList.toggle("hidden");
    bar.parentElement?.insertBefore(placeholder, bar);

    bar.style.left = `${left}px`;
    bar.style.position = "absolute";
    bar.style.width = `${width}px`;
    bar.style.pointerEvents = "none";
    setCurrentElement(bar);
    setOffset(e.clientX - left);
  };

  const handlePointerUp = () => {
    if (currentElement) {
      const placeholder = placeholderRef.current as HTMLElement;

      currentElement.style.pointerEvents = "all";
      currentElement.style.position = "initial";
      currentElement.style.width = "100%";
      placeholder.classList.toggle("hidden");
      currentElement.parentElement?.insertBefore(currentElement, placeholder);
      setCurrentElement(null);
    }
  };

  const handlePointerMove = (e: PointerEvent<HTMLButtonElement>) => {
    if (currentElement) {
      currentElement.style.left = `${e.clientX - offset}px`;

      let target = e.target as HTMLElement;
      if (target.id !== "placeholder") {
        if (target.tagName !== "ARTICLE")
          target = (target.closest("article") as HTMLElement) || target;

        if (target.tagName === "ARTICLE") {
          const currentX = e.clientX;
          const rect = target.getBoundingClientRect();
          const middle = (rect.right - rect.left) / 2 + rect.left;
          const container = target.parentElement as HTMLElement;
          if (currentX < middle) {
            container.insertBefore(
              placeholderRef.current as HTMLElement,
              target
            );
          } else {
            container.insertBefore(
              placeholderRef.current as HTMLElement,
              target.nextSibling
            );
          }
        }
      }
    }
  };

  return (
    <section
      className="relative w-full h-full flex gap-3"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <div
        id="placeholder"
        className="w-full hidden"
        ref={placeholderRef}
      ></div>
      {palette.colors.map((color) => (
        <article
          key={color.id}
          id={color.id}
          className="w-full h-full rounded-xl flex flex-col justify-center items-center gap-10"
          style={{ background: color.hex }}
        >
          <p>{color.hex}</p>
          <button
            className="bg-slate-900 py-2 px-4"
            onPointerDown={handlePointerDown}
          >
            DRAG
          </button>
        </article>
      ))}
    </section>
  );
}
