"use client";

import React, {
  Dispatch,
  PointerEvent,
  SetStateAction,
  useRef,
  useState,
} from "react";

type Props = {
  palette: Palette;
  setPalette: Dispatch<SetStateAction<Palette | undefined>>;
};

export default function PalettePlayground({ palette, setPalette }: Props) {
  const placeholderRef = useRef<HTMLDivElement>(null);
  const [currentElement, setCurrentElement] = useState<null | HTMLElement>();
  const [offset, setOffset] = useState(0);

  const handlePointerDown = (e: PointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const target = e.target as HTMLElement;
    const bar = target.parentElement as HTMLElement;

    const width = bar.getBoundingClientRect().width;
    const left = bar.getBoundingClientRect().x;

    const index = palette.colors.findIndex(
      (color) => color?.id === bar.id
    ) as number;

    setPalette((prev) => {
      if (!prev) return prev;

      const newColors = [...prev.colors];
      newColors.splice(index, 0, null);

      return { colors: newColors };
    });

    bar.style.left = `${left}px`;
    bar.style.position = "absolute";
    bar.style.width = `${width}px`;
    bar.style.pointerEvents = "none";
    setCurrentElement(bar);
    setOffset(e.clientX - left);
  };

  const handlePointerUp = () => {
    if (currentElement) {
      setPalette((prev) => {
        if (!prev) return prev;

        const newColors = [...prev.colors];
        newColors.splice(placeholderIndex, 1, prev.colors[clrIndex]);
        newColors.splice(clrIndex, 1);

        return { colors: newColors };
      });

      currentElement.style.left = "0px";
      currentElement.style.position = "initial";
      currentElement.style.transition = "left 0.1s";
      currentElement.style.width = "100%";

      let clrIndex = -1;
      let placeholderIndex = -1;

      palette.colors.forEach((color, index) => {
        if (color === null) placeholderIndex = index;
        if (color?.id === currentElement.id) clrIndex = index;
      });

      setCurrentElement(null);

      setTimeout(() => {
        currentElement.style.position = "relative";
        currentElement.style.transition = "none";
        currentElement.style.pointerEvents = "all";
      }, 100);
    }
  };

  const handlePointerMove = (e: PointerEvent<HTMLButtonElement>) => {
    if (currentElement) {
      currentElement.style.left = `${e.clientX - offset}px`;
      let target = e.target as HTMLElement;

      if (target.tagName !== "ARTICLE")
        target = (target.closest("article") as HTMLElement) || target;

      if (target.id !== "placeholder" && target.tagName === "ARTICLE") {
        const currentX = e.clientX - offset;
        const rect = target.getBoundingClientRect();
        const middle = (rect.right - rect.left) / 2 + rect.left;

        let clrIndex = -1;
        let placeholderIndex = -1;

        palette.colors.forEach((color, index) => {
          if (color === null) placeholderIndex = index;

          if (color?.id === target.id) clrIndex = index;
        });

        const targetRect = target.getBoundingClientRect();
        const placeholderRect =
          placeholderRef.current?.getBoundingClientRect() as DOMRect;

        target.style.transition = "left 0.1s";

        if (currentX < middle) {
          const diff = placeholderRect.x - targetRect.x;
          target.style.left = `${diff}px`;

          setTimeout(() => {
            target.style.transition = "none";
            target.style.left = "0px";
            setPalette((prev) => {
              if (!prev) return prev;

              const newColors = [...prev.colors];
              newColors.splice(placeholderIndex, 1);
              newColors.splice(clrIndex, 0, null);
              return { colors: newColors };
            });
          }, 100);
        } else {
          target.style.left = `0px`;

          setTimeout(() => {
            target.style.transition = "none";
            setPalette((prev) => {
              if (!prev) return prev;
              const newColors = [...prev.colors];
              newColors.splice(placeholderIndex, 1);
              newColors.splice(clrIndex + 1, 0, null);
              return {
                colors: newColors,
              };
            });
          }, 100);
        }

        target.style.pointerEvents = "none";

        setTimeout(() => {
          target.style.pointerEvents = "all";
        }, 100);
      }
    }
  };

  const content = palette?.colors.map((color) => {
    if (color) {
      return (
        <article
          key={color.id}
          id={color.id}
          className="relative left-0 w-full h-full rounded-xl flex flex-col justify-center items-center gap-10"
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
      );
    }

    return (
      <div
        key="null"
        id="placeholder"
        className="w-full"
        ref={placeholderRef}
      ></div>
    );
  });

  return (
    <section
      className="relative w-full h-full flex gap-3"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {content}
    </section>
  );
}
