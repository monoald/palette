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
  const [lastSwap, setLastSwap] = useState<{ index: number; side: string }>();
  const [offset, setOffset] = useState(0);
  const containerRef = useRef<HTMLElement>(null);

  const moveRightElements = (element: HTMLElement) => {
    let rightElement = element.nextSibling as HTMLElement;
    while (rightElement) {
      if (rightElement.id === currentElement?.id)
        rightElement = rightElement.nextSibling as HTMLElement;

      rightElement.style.transform = `translate(100%, 0px)`;
      rightElement = rightElement.nextSibling as HTMLElement;
    }
  };

  const resetElements = () => {
    const container = containerRef.current as HTMLElement;
    let element = container.firstChild as HTMLElement;
    while (element) {
      if (element.id === currentElement?.id)
        element = element.nextSibling as HTMLElement;

      element.style.removeProperty("transform");
      element.style.removeProperty("transition");
      element.style.removeProperty("pointer-events");
      element.removeAttribute("data-swap");
      element = element.nextSibling as HTMLElement;
    }
  };

  const handlePointerDown = (e: PointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const target = e.target as HTMLElement;
    const bar = target.parentElement as HTMLElement;

    const width = bar.getBoundingClientRect().width;
    const left = bar.getBoundingClientRect().x;

    bar.style.transform = `translate(${e.clientX - (e.clientX - left)}px, 0px)`;
    bar.style.position = "absolute";
    bar.style.width = `${width}px`;
    bar.style.pointerEvents = "none";
    bar.style.zIndex = "100000";

    moveRightElements(bar);
    setCurrentElement(bar);
    setOffset(e.clientX - left);

    const index = palette.colors.findIndex((clr) => clr?.id === bar.id);
    setLastSwap({ index, side: "left" });
  };

  const handlePointerUp = () => {
    if (currentElement) {
      let clrIndex = palette.colors.findIndex(
        (clr) => clr?.id === currentElement.id
      );

      setPalette((prev) => {
        if (!prev) return prev;
        const newColors = [...prev.colors] as Array<Color | null>;

        const currentColor = newColors[clrIndex];
        newColors[clrIndex] = null;

        if (lastSwap?.side === "left")
          newColors.splice(lastSwap?.index as number, 0, currentColor);
        if (lastSwap?.side === "right")
          newColors.splice((lastSwap?.index + 1) as number, 0, currentColor);

        return {
          colors: newColors.filter((clr) => clr !== null) as Array<Color>,
        };
      });

      currentElement.style.removeProperty("pointer-events");
      currentElement.style.removeProperty("z-index");
      currentElement.style.removeProperty("transform");
      currentElement.style.removeProperty("width");
      currentElement.style.removeProperty("position");
      setCurrentElement(null);
      resetElements();
    }
  };

  const handlePointerMove = (e: PointerEvent<HTMLButtonElement>) => {
    if (currentElement) {
      const currentRect = currentElement.getBoundingClientRect();
      const container = containerRef.current as HTMLElement;
      const children = container.childNodes as NodeListOf<HTMLElement>;

      for (let i = 0; i < children.length; i++) {
        if (
          children[i].id === currentElement.id ||
          children[i].id === "placeholder" ||
          children[i].getAttribute("data-swap") === "true"
        )
          continue;

        const childRect = children[i].getBoundingClientRect();
        const childMiddle = childRect.width / 2 + childRect.left;

        children[i].style.transition = "transform 0.2s";
        children[i].style.pointerEvents = "none";
        // Left collision
        if (currentRect.x > childRect.x && currentRect.x < childMiddle) {
          children[i].style.transform = "translate(100%, 0px)";
          children[i].setAttribute("data-swap", "true");
          setTimeout(() => {
            children[i].setAttribute("data-swap", "false");
          }, 200);

          setLastSwap({ index: i, side: "left" });
        }
        // Right collision
        else if (
          currentRect.right > childMiddle &&
          currentRect.right < childRect.right
        ) {
          children[i].style.removeProperty("transform");
          children[i].setAttribute("data-swap", "true");
          setTimeout(() => {
            children[i].setAttribute("data-swap", "false");
          }, 200);

          setLastSwap({ index: i, side: "right" });
        }
      }

      currentElement.style.transform = `translate(${
        e.clientX - offset
      }px, 0px)`;
    }
  };

  const content = palette.colors.map((color) => (
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
  ));

  return (
    <section
      className="relative w-full h-full flex gap-3"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      ref={containerRef}
    >
      {content}
      {currentElement && (
        <div
          key="null"
          id="placeholder"
          className="w-full"
          ref={placeholderRef}
        ></div>
      )}
    </section>
  );
}
