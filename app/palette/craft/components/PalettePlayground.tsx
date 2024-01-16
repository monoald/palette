"use client";

import React, { PointerEvent, useEffect, useRef, useState } from "react";

type Props = {
  arr: any[];
  onUpdate: (updatedArr: any[]) => void;
  children: React.ReactNode;
};

export default function PalettePlayground({ arr, onUpdate, children }: Props) {
  const [list, setList] = useState<Array<any>>([]);

  useEffect(() => {
    setList([...arr]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const placeholderRef = useRef<HTMLDivElement>(null);
  const [currentElement, setCurrentElement] = useState<null | HTMLElement>();
  const [offset, setOffset] = useState(0);
  const [distance, setDistance] = useState(0);
  const containerRef = useRef<HTMLElement>(null);

  const handlePointerDown = (e: PointerEvent<HTMLButtonElement>) => {
    const target = e.target as HTMLElement;

    if (target.getAttribute("data-drag-trigger")) {
      const container = containerRef.current as HTMLElement;
      const first = container.firstChild as HTMLElement;
      const draggable = target.closest("*[data-draggable]") as HTMLElement;
      const index = list.findIndex((element) => element.id === draggable.id);

      setDistance(
        (first.nextSibling as HTMLElement).offsetLeft - first.offsetLeft
      );
      setCurrentElement(draggable);
      setOffset(e.clientX - draggable.offsetLeft);

      // Attributes for draggin
      draggable.style.left = `${
        e.clientX - (e.clientX - draggable.offsetLeft)
      }px`;
      draggable.style.width = `${draggable.clientWidth}px`;
      draggable.style.position = "absolute";
      draggable.style.pointerEvents = "none";
      draggable.style.zIndex = "100000";

      // Move placeholder to current element position
      const placeholder = placeholderRef.current as HTMLElement;
      draggable.before(placeholder);
      placeholder.style.display = "block";

      setList((prev) => {
        const newList = [...prev];
        const current = newList.splice(index, 1)[0];
        newList.push(current);

        return newList;
      });
    }
  };

  const animateSwap = (
    element: HTMLElement,
    container: HTMLElement,
    side: string
  ) => {
    const gap = side === "left" ? -distance : distance;
    // Remove prev last swapped
    const lastSwaped = container.querySelectorAll("[last-swaped]");
    if (lastSwaped) {
      for (let i = 0; i < lastSwaped.length; i++) {
        lastSwaped[i].removeAttribute("last-swaped");
      }
    }

    const placeholder = placeholderRef.current as HTMLElement;

    side === "left" ? element.before(placeholder) : element.after(placeholder);

    element.style.transform = `translate(${gap}px, 0px)`;

    setTimeout(() => {
      element.style.transition = "transform 0.2s";
      element.style.transform = "translate(0px, 0px)";
    }, 10);

    // Set Attributes
    element.setAttribute("swap", "true");
    element.setAttribute("last-swaped", side);

    setTimeout(() => {
      element.style.removeProperty("transition");
      element.style.removeProperty("transform");
      element.removeAttribute("swap");
    }, 200);
  };

  const handlePointerMove = (e: PointerEvent<HTMLElement>) => {
    if (currentElement) {
      const container = containerRef.current as HTMLElement;
      const draggable = container.querySelectorAll(
        "[data-draggable]"
      ) as NodeListOf<HTMLElement>;

      for (let i = 0; i < draggable.length; i++) {
        if (
          draggable[i].id === currentElement.id ||
          draggable[i].id === "placeholder" ||
          draggable[i].getAttribute("swap") === "true"
        )
          continue;

        const childMiddle =
          draggable[i].clientWidth / 2 + draggable[i].offsetLeft;

        // Left collision
        if (
          currentElement.offsetLeft > draggable[i].offsetLeft &&
          currentElement.offsetLeft < childMiddle
        ) {
          animateSwap(draggable[i], container, "left");
        }
        // Right collision
        else if (
          currentElement.offsetLeft + currentElement.clientWidth >
            childMiddle &&
          currentElement.offsetLeft + currentElement.clientWidth <
            draggable[i].offsetLeft + draggable[i].clientWidth
        ) {
          animateSwap(draggable[i], container, "right");
        }
      }

      currentElement.style.left = `${e.clientX - offset}px`;
    }
  };

  const handlePointerUp = (e: PointerEvent<HTMLElement>) => {
    const container = containerRef.current as HTMLElement;
    const lastSwaped = container.querySelector("[last-swaped]") as HTMLElement;

    if (currentElement && lastSwaped) {
      const placeholder = placeholderRef.current as HTMLElement;
      currentElement.style.transition = "left 0.2s";
      currentElement.style.left = `${placeholder.offsetLeft}px`;
      setTimeout(() => {
        currentElement.style.removeProperty("transition");
        currentElement.style.removeProperty("position");
        currentElement.style.removeProperty("left");
        currentElement.style.removeProperty("width");
        currentElement.style.removeProperty("pointer-events");
        currentElement.style.removeProperty("z-index");
        placeholder.before(currentElement);
        placeholder.style.removeProperty("display");

        setCurrentElement(null);
        setList((prev) => {
          const newList = [...prev];
          let currentIndex = 0;
          let lastSwapedIndex = 0;

          for (const i in newList) {
            if (newList[i].id === currentElement.id) currentIndex = +i;
            if (newList[i].id === lastSwaped.id) lastSwapedIndex = +i;
          }

          const element = newList.splice(newList.length - 1, 1)[0];
          if (lastSwaped.getAttribute("last-swaped") === "left") {
            newList.splice(lastSwapedIndex, 0, element);
          } else {
            newList.splice(lastSwapedIndex + 1, 0, element);
          }

          onUpdate(newList);

          return newList;
        });
      }, 200);
    } else if (currentElement) {
      const placeholder = placeholderRef.current as HTMLElement;
      currentElement.style.transition = "left 0.2s";
      currentElement.style.left = `${placeholder.offsetLeft}px`;

      setTimeout(() => {
        currentElement.style.removeProperty("transition");
        currentElement.style.removeProperty("position");
        currentElement.style.removeProperty("left");
        currentElement.style.removeProperty("width");
        currentElement.style.removeProperty("pointer-events");
        currentElement.style.removeProperty("z-index");
        placeholder.before(currentElement);
        placeholder.style.removeProperty("display");
      }, 200);
    }
  };

  return (
    <section
      className="relative w-full h-full flex flex-col justify-center items-center gap-3 md:flex-row"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      ref={containerRef}
    >
      {children}
      <div
        key="null"
        id="placeholder"
        className="w-full hidden"
        ref={placeholderRef}
      ></div>
    </section>
  );
}
