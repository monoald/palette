"use client";

import { PointerEvent, ReactNode, useRef, useState } from "react";

type Props = {
  onUpdate: (currentId: string, lastSwapedId: string, side: string) => void;
  children: ReactNode;
};

export default function PalettePlayground({ onUpdate, children }: Props) {
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

      if (window.innerWidth >= 768) {
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
        // draggable.style.position = "absolute";
        // draggable.style.pointerEvents = "none";
        // draggable.style.zIndex = "100000";

        // // Move placeholder to current element position
        // const placeholder = placeholderRef.current as HTMLElement;
        // draggable.before(placeholder);
        // placeholder.style.display = "block";
      } else {
        setDistance(
          (first.nextSibling as HTMLElement).offsetTop - first.offsetTop
        );
        setCurrentElement(draggable);
        setOffset(e.clientY - draggable.offsetTop);

        // Attributes for draggin
        draggable.style.top = `${
          e.clientY - (e.clientY - draggable.offsetTop)
        }px`;
        draggable.style.height = `${draggable.clientHeight}px`;
        // draggable.style.position = "absolute";
        // draggable.style.pointerEvents = "none";
        // draggable.style.zIndex = "100000";

        // // Move placeholder to current element position
        // const placeholder = placeholderRef.current as HTMLElement;
        // draggable.before(placeholder);
        // placeholder.style.display = "block";
      }
      draggable.style.position = "absolute";
      draggable.style.pointerEvents = "none";
      draggable.style.zIndex = "100000";

      // Move placeholder to current element position
      const placeholder = placeholderRef.current as HTMLElement;
      draggable.before(placeholder);
      placeholder.style.display = "block";
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

    if (window.innerWidth >= 768) {
      element.style.transform = `translate(${gap}px, 0px)`;
    } else {
      element.style.transform = `translate(0px, ${gap}px)`;
    }

    setTimeout(() => {
      element.style.transition = "transform 0.1s";
      element.style.transform = "translate(0px, 0px)";
    }, 10);

    // Set Attributes
    element.setAttribute("swap", "true");
    element.setAttribute("last-swaped", side);

    setTimeout(() => {
      element.style.removeProperty("transition");
      element.style.removeProperty("transform");
      element.removeAttribute("swap");
    }, 100);
  };

  const handlePointerMove = (e: PointerEvent<HTMLElement>) => {
    if (currentElement) {
      const container = containerRef.current as HTMLElement;
      const draggable = container.querySelectorAll(
        "[data-draggable]"
      ) as NodeListOf<HTMLElement>;

      if (window.innerWidth >= 768) {
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
      } else {
        for (let i = 0; i < draggable.length; i++) {
          if (
            draggable[i].id === currentElement.id ||
            draggable[i].id === "placeholder" ||
            draggable[i].getAttribute("swap") === "true"
          )
            continue;

          const childMiddle =
            draggable[i].clientHeight / 2 + draggable[i].offsetTop;

          // Left collision
          if (
            currentElement.offsetTop > draggable[i].offsetTop &&
            currentElement.offsetTop < childMiddle
          ) {
            animateSwap(draggable[i], container, "left");
          }
          // Right collision
          else if (
            currentElement.offsetTop + currentElement.clientHeight >
              childMiddle &&
            currentElement.offsetTop + currentElement.clientHeight <
              draggable[i].offsetTop + draggable[i].clientHeight
          ) {
            animateSwap(draggable[i], container, "right");
          }
        }

        currentElement.style.top = `${e.clientY - offset}px`;
      }
    }
  };

  const handlePointerUp = () => {
    const container = containerRef.current as HTMLElement;
    const lastSwaped = container.querySelector("[last-swaped]") as HTMLElement;
    if (window.innerWidth >= 768) {
      if (currentElement && lastSwaped) {
        const side = lastSwaped.getAttribute("last-swaped") as string;
        const placeholder = placeholderRef.current as HTMLElement;
        currentElement.style.transition = "left 0.2s";
        currentElement.style.left = `${placeholder.offsetLeft}px`;
        setTimeout(() => {
          onUpdate(currentElement.id, lastSwaped.id, side);
          currentElement.style.removeProperty("transition");
          currentElement.style.removeProperty("position");
          currentElement.style.removeProperty("left");
          currentElement.style.removeProperty("width");
          currentElement.style.removeProperty("pointer-events");
          currentElement.style.removeProperty("z-index");
          placeholder.before(currentElement);
          placeholder.style.removeProperty("display");

          lastSwaped.removeAttribute("last-swaped");
          setCurrentElement(null);
        }, 200);
      } else if (currentElement) {
        const placeholder = placeholderRef.current as HTMLElement;
        currentElement.style.transition = "left 0.2s";
        currentElement.style.left = `${placeholder.offsetLeft}px`;

        setTimeout(() => {
          setCurrentElement(null);
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
    } else {
      if (currentElement && lastSwaped) {
        const side = lastSwaped.getAttribute("last-swaped") as string;
        const placeholder = placeholderRef.current as HTMLElement;
        currentElement.style.transition = "top 0.2s";
        currentElement.style.top = `${placeholder.offsetTop}px`;
        setTimeout(() => {
          onUpdate(currentElement.id, lastSwaped.id, side);
          currentElement.style.removeProperty("transition");
          currentElement.style.removeProperty("position");
          currentElement.style.removeProperty("top");
          currentElement.style.removeProperty("height");
          currentElement.style.removeProperty("pointer-events");
          currentElement.style.removeProperty("z-index");
          placeholder.before(currentElement);
          placeholder.style.removeProperty("display");

          lastSwaped.removeAttribute("last-swaped");
          setCurrentElement(null);
        }, 200);
      } else if (currentElement) {
        const placeholder = placeholderRef.current as HTMLElement;
        currentElement.style.transition = "top 0.2s";
        currentElement.style.top = `${placeholder.offsetTop}px`;

        setTimeout(() => {
          setCurrentElement(null);
          currentElement.style.removeProperty("transition");
          currentElement.style.removeProperty("position");
          currentElement.style.removeProperty("top");
          currentElement.style.removeProperty("height");
          currentElement.style.removeProperty("pointer-events");
          currentElement.style.removeProperty("z-index");
          placeholder.before(currentElement);
          placeholder.style.removeProperty("display");
        }, 200);
      }
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
        className="w-full h-full hidden"
        ref={placeholderRef}
      ></div>
    </section>
  );
}
