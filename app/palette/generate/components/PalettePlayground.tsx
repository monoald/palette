"use client";

import React, {
  Dispatch,
  PointerEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";

type Props = {
  palette: Palette;
  setPalette: Dispatch<SetStateAction<Palette | undefined>>;
};

export default function PalettePlayground({ palette, setPalette }: Props) {
  const [list, setList] = useState<Array<any>>([]);

  useEffect(() => {
    setList([...palette.colors]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const placeholderRef = useRef<HTMLDivElement>(null);
  const [currentElement, setCurrentElement] = useState<null | HTMLElement>();
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [offset, setOffset] = useState(0);
  const [distance, setDistance] = useState(0);
  const containerRef = useRef<HTMLElement>(null);

  // const moveRightElements = (element: HTMLElement) => {
  //   let rightElement = element.nextSibling as HTMLElement;
  //   const elementRect = element.getBoundingClientRect();
  //   const rightRect = rightElement.getBoundingClientRect();
  //   const gap = rightRect.left - elementRect.left;
  //   while (rightElement) {
  //     if (rightElement.id === currentElement?.id)
  //       rightElement = rightElement.nextSibling as HTMLElement;

  //     rightElement.style.transform = `translate(${gap}px, 0px)`;
  //     rightElement = rightElement.nextSibling as HTMLElement;
  //   }
  // };

  // const resetElements = () => {
  //   const container = containerRef.current as HTMLElement;
  //   let element = container.firstChild as HTMLElement;
  //   while (element) {
  //     if (element.id === currentElement?.id)
  //       element = element.nextSibling as HTMLElement;

  //     element.style.removeProperty("transform");
  //     element.style.removeProperty("transition");
  //     element.style.removeProperty("pointer-events");
  //     element.removeAttribute("swap");
  //     element = element.nextSibling as HTMLElement;
  //   }
  // };

  // const handlePointerDown = (e: PointerEvent<HTMLButtonElement>) => {
  //   e.preventDefault();
  //   const target = e.target as HTMLElement;
  //   const bar = target.parentElement as HTMLElement;

  //   const width = bar.clientWidth;
  //   const left = bar.offsetLeft;

  //   moveRightElements(bar);
  //   bar.style.transform = `translate(${e.clientX - (e.clientX - left)}px, 0px)`;
  //   bar.style.position = "absolute";
  //   bar.style.width = `${width}px`;
  //   bar.style.pointerEvents = "none";
  //   bar.style.zIndex = "100000";

  //   setCurrentElement(bar);
  //   setOffset(e.clientX - left);

  //   const index = palette.colors.findIndex((clr) => clr?.id === bar.id);
  //   setLastSwap(index);
  // };

  // const handlePointerUp = () => {
  //   if (currentElement) {
  //     let clrIndex = palette.colors.findIndex(
  //       (clr) => clr?.id === currentElement.id
  //     );

  //     // currentElement.style.transition = "1s";

  //     setPalette((prev) => {
  //       if (!prev) return prev;
  //       const newColors = [...prev.colors] as Array<Color | null>;

  //       const currentColor = newColors[clrIndex];
  //       newColors[clrIndex] = null;
  //       newColors.splice(lastSwap, 0, currentColor);

  //       return {
  //         colors: newColors.filter((clr) => clr !== null) as Array<Color>,
  //       };
  //     });

  //     currentElement.style.removeProperty("pointer-events");
  //     currentElement.style.removeProperty("z-index");
  //     currentElement.style.removeProperty("transform");
  //     currentElement.style.removeProperty("width");
  //     currentElement.style.removeProperty("position");
  //     resetElements();
  //     setCurrentElement(null);
  //   }
  // };

  // const handlePointerMove = (e: PointerEvent<HTMLButtonElement>) => {
  //   if (currentElement) {
  //     const currentRect = currentElement.getBoundingClientRect();
  //     const container = containerRef.current as HTMLElement;
  //     const children = container.childNodes as NodeListOf<HTMLElement>;

  //     for (let i = 0; i < children.length; i++) {
  //       if (
  //         children[i].id === currentElement.id ||
  //         children[i].id === "placeholder" ||
  //         children[i].getAttribute("swap") === "true"
  //       )
  //         continue;

  //       const childRect = children[i].getBoundingClientRect();
  //       const childMiddle = childRect.width / 2 + childRect.left;

  //       children[i].style.transition = "transform 0.2s";
  //       children[i].style.pointerEvents = "none";
  //       // Left collision
  //       if (currentRect.x > childRect.x && currentRect.x < childMiddle) {
  //         children[i].style.transform = "translate(100%, 0px)";
  //         children[i].setAttribute("swap", "true");
  //         setTimeout(() => {
  //           children[i].setAttribute("swap", "false");
  //         }, 200);

  //         setLastSwap(i);
  //       }
  //       // Right collision
  //       else if (
  //         currentRect.right > childMiddle &&
  //         currentRect.right < childRect.right
  //       ) {
  //         children[i].style.removeProperty("transform");
  //         children[i].setAttribute("swap", "true");
  //         setTimeout(() => {
  //           children[i].setAttribute("swap", "false");
  //         }, 200);

  //         setLastSwap(i + 1);
  //       }
  //     }

  //     currentElement.style.transform = `translate(${
  //       e.clientX - offset
  //     }px, 0px)`;
  //   }
  // };

  // const content = palette.colors.map((color) => (
  //   <article
  //     key={color.id}
  //     id={color.id}
  //     className="w-full h-full rounded-xl flex flex-col justify-center items-center gap-10"
  //     style={{ background: color.hex }}
  //   >
  //     <p>{color.hex}</p>
  //     <button
  //       className="bg-slate-900 py-2 px-4"
  //       onPointerDown={handlePointerDown}
  //     >
  //       DRAG
  //     </button>
  //   </article>
  // ));

  // return (
  //   <section
  //     className="relative w-full h-full flex gap-3"
  //     onPointerMove={handlePointerMove}
  //     onPointerUp={handlePointerUp}
  //     ref={containerRef}
  //   >
  //     {content}
  //     {currentElement && (
  //       <div
  //         key="null"
  //         id="placeholder"
  //         className="w-full"
  //         ref={placeholderRef}
  //       ></div>
  //     )}
  //   </section>
  // );

  const handlePointerDown = (e: PointerEvent<HTMLButtonElement>) => {
    const target = e.target as HTMLElement;
    const draggable = target.closest("*[data-draggable]") as HTMLElement;
    const index = list.findIndex((element) => element.id === draggable.id);

    const first = (containerRef.current as HTMLElement)
      .firstChild as HTMLElement;
    setDistance(
      (first.nextSibling as HTMLElement).offsetLeft - first.offsetLeft
    );

    setCurrentElement(draggable);
    setOffset(e.clientX - draggable.offsetLeft);
    // setList((prev) => {
    //   const newList = [...prev];
    //   newList.splice(index, 0, null);
    //   const current = newList.splice(index + 1, 1);
    //   newList.splice(newList.length, 0, current[0]);
    //   return newList;
    // });

    draggable.style.left = `${
      e.clientX - (e.clientX - draggable.offsetLeft)
    }px`;
    draggable.style.width = `${draggable.clientWidth}px`;
    draggable.style.position = "absolute";
    draggable.style.pointerEvents = "none";
    draggable.style.zIndex = "100000";

    const placeholder = placeholderRef.current as HTMLElement;
    draggable.before(placeholder);
    placeholder.style.display = "block";
  };

  const handlePointerMove = (e: PointerEvent<HTMLElement>) => {
    if (currentElement) {
      const currentRect = currentElement.getBoundingClientRect();
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

        const childRect = draggable[i].getBoundingClientRect();
        const childMiddle = childRect.width / 2 + childRect.left;

        // Left collision
        if (
          currentRect.left > childRect.left &&
          currentRect.left < childMiddle
        ) {
          // if (draggable[i].style.transform) {
          //   draggable[i].style.transform = "translate(0px, 0px)";
          // } else {
          //   draggable[i].style.transition = "transform 0.2s";
          //   draggable[i].style.transform = `translate(${distance}px, 0px)`;
          // }

          draggable[i].style.transition = "transform 0.2s";
          draggable[i].style.transform = `translate(${distance}px, 0px)`;

          // Remove prev last swapped
          const lastSwaped = container.querySelectorAll("[last-swaped]");
          if (lastSwaped) {
            for (let i = 0; i < lastSwaped.length; i++) {
              lastSwaped[i].removeAttribute("last-swaped");
            }
          }

          // Set Attributes
          draggable[i].setAttribute("swap", "true");
          // draggable[i].setAttribute("last-swaped", "left");
          draggable[i].setAttribute("swaped", "true");

          setTimeout(() => {
            draggable[i].style.removeProperty("transition");
            draggable[i].style.removeProperty("transform");

            // Move placeholder
            const placeholder = placeholderRef.current as HTMLElement;
            draggable[i].before(placeholder);
            // if (draggable[i].style.transform === "translate(0px, 0px)") {
            //   draggable[i].style.removeProperty("transform");
            // }
            draggable[i].removeAttribute("swap");
          }, 200);
        }
        // Right collision
        else if (
          currentRect.right > childMiddle &&
          currentRect.right < childRect.right
        ) {
          // if (draggable[i].style.transform) {
          //   draggable[i].style.transform = "translate(0px, 0px)";
          // } else {
          draggable[i].style.transition = "transform 0.2s";
          draggable[i].style.transform = `translate(${-distance}px, 0px)`;
          // }
          // Remove prev last swapped
          const lastSwaped = container.querySelectorAll("[last-swaped]");
          if (lastSwaped) {
            for (let i = 0; i < lastSwaped.length; i++) {
              lastSwaped[i].removeAttribute("last-swaped");
            }
          }

          // Set Attributes
          draggable[i].setAttribute("swap", "true");
          // draggable[i].setAttribute("last-swaped", "right");
          draggable[i].setAttribute("swaped", "true");

          setTimeout(() => {
            // if (draggable[i].style.transform === "translate(0px, 0px)") {
            draggable[i].style.removeProperty("transition");
            draggable[i].style.removeProperty("transform");
            // }

            // Move placeholder
            const placeholder = placeholderRef.current as HTMLElement;
            draggable[i].after(placeholder);

            draggable[i].removeAttribute("swap");
          }, 200);
        }
      }

      currentElement.style.left = `${e.clientX - offset}px`;
    }
  };

  // console.log(list);

  const handlePointerUp = (e: PointerEvent<HTMLElement>) => {
    if (currentElement) {
      const placeholder = placeholderRef.current as HTMLElement;
      currentElement.style.transition = "left 0.2s";
      currentElement.style.left = `${placeholder.offsetLeft}px`;

      setTimeout(() => {
        currentElement.style.removeProperty("transition");
        currentElement.style.removeProperty("position");
        currentElement.style.removeProperty("width");
        placeholder.before(currentElement);
        placeholder.style.removeProperty("display");
        setCurrentElement(null);
      }, 200);
    }
  };

  const content = list.map((element) => {
    if (element) {
      return (
        <article
          key={element.id}
          id={element.id}
          className="w-full h-full rounded-xl flex flex-col justify-center items-center gap-10"
          style={{ background: element.hex }}
          data-draggable
        >
          <p>{element.hex}</p>
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
      <>
        {/* {currentElement && ( */}
        <div
          key="null"
          id="placeholder"
          className="w-full"
          ref={placeholderRef}
        ></div>
        {/* )} */}
      </>
    );
  });

  return (
    <section
      className="relative w-full h-full flex gap-3"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      ref={containerRef}
    >
      {content}
      {/* {currentElement && (
      )} */}
      <div
        key="null"
        id="placeholder"
        className="w-full hidden"
        ref={placeholderRef}
      ></div>
    </section>
  );
}
