"use client";

import Image from "next/image";
import { svgs } from "../data/svg";
import { Dispatch, SetStateAction, useState } from "react";
import SideBar from "../components/SideBar";
import { changeSvgColor } from "../utils/changeIconColor";
type Icon = {
  id?: string | undefined;
  name: string;
  content: string;
  unicode: string;
  color: string | undefined;
  warning?: boolean;
};

type IconCollection = {
  name: string;
  color: string | undefined;
  icons: Icon[];
  thumbnail: string;
};

export default function Page() {
  const [itemsToShow, setItemsToShow] = useState(12);
  const [collection, setCollection] = useState<IconCollection>({
    name: "untitled",
    color: "#ffffff",
    icons: [],
    thumbnail: "",
  });

  const handleNameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const regex = /^[a-zA-Z0-9-_]+$/;
    let normalizedText = e.target.value.toLowerCase();
    if (regex.test(normalizedText) || normalizedText === "") {
      setCollection((prev) => ({ ...prev, name: normalizedText }));
    }
  };

  const handleAddIcon = (svg: Icon) => {
    setCollection((prev) => {
      const newIcons = [...prev.icons];
      const newIcon: Icon = { ...svg };

      const alreadyAdded = newIcons.findIndex(
        (ico) => ico.content === svg.content
      );

      if (alreadyAdded !== -1) {
        // setErrorMessage('Icon already added!')
        return prev;
      } else {
        // setErrorMessage('')
      }

      newIcon.unicode =
        newIcons.length === 0
          ? "a101"
          : (
              parseInt(newIcons[newIcons.length - 1].unicode as string, 16) + 1
            ).toString(16);
      // newIcon.id = createUUID()

      newIcons.push(newIcon);

      return { ...prev, icons: newIcons };
    });
  };

  const handleShowMoreIcons = () => {
    setItemsToShow(itemsToShow + 12);
  };

  return (
    <div className="h-[calc(100vh-80px)] p-8 flex gap-8 bg-main text-secondary  text-sm">
      <SideBar />
      <main className="w-full h-full mx-auto flex flex-col gap-12 items-center">
        <section className="w-full h-auto flex flex-col items-center gap-10">
          <input
            type="text"
            className="max-w-80 min-h-10 text-xl text-center"
            value={collection.name}
            onChange={handleNameChanged}
          />
          <div className="w-full h-auto grid grid-cols-[repeat(auto-fill,_minmax(140px,_1fr))] gap-8">
            {collection?.icons.map((svg) => (
              // <article
              //   key={svg.id}
              //   className="p-5 border border-primary-border rounded-2xl flex flex-col items-center gap-4"
              // >
              //   <Image
              //     className="icon__svg"
              //     width={36}
              //     height={36}
              //     src={`data:image/svg+xml;base64,${btoa(
              //       unescape(encodeURIComponent(svg.content))
              //     )}`}
              //     alt={`icon ${svg.name}`}
              //   />

              //   <div className="relative w-full py-1 px-2 border border-transparent hover:border-primary-border focus-within:border-primary-border rounded-xl overflow-hidden after:absolute after:top-0 after:right-0 after:w-10 after:h-full after:block after:bg-[linear-gradient(90deg,rgba(0,0,0,0),#03050c)] after:pointer-events-none">
              //     <input
              //       className="w-full whitespace-nowrap overflow-hidden border-none text-center active:border-none focus-visible:outline-none"
              //       type="text"
              //       value={svg.name}
              //     />
              //   </div>

              //   <button className="w-full py-1 border border-primary-border rounded-2xl flex items-center justify-center gap-2">
              //     Add <span className="icon-plus" />
              //   </button>
              // </article>
              <MutableCard
                key={svg.id}
                svg={svg}
                setCollection={setCollection}
              />
            ))}
          </div>
        </section>

        <section className="w-full h-auto flex flex-col items-center gap-10">
          <h2 className="text-xl">Paleta Icons</h2>

          <div className="w-full h-auto grid grid-cols-[repeat(auto-fill,_minmax(140px,_1fr))] gap-8">
            {svgs.slice(0, itemsToShow).map((svg) => (
              <article
                key={svg.id}
                className="p-5 border border-primary-border rounded-2xl flex flex-col items-center gap-3"
              >
                <Image
                  className="icon__svg"
                  width={36}
                  height={36}
                  src={`data:image/svg+xml;base64,${btoa(
                    unescape(encodeURIComponent(svg.content))
                  )}`}
                  alt={`icon ${svg.name}`}
                />

                <div className="relative w-full py-1 px-2 overflow-hidden text-center after:absolute after:top-0 after:right-0 after:w-10 after:h-full after:block after:bg-[linear-gradient(90deg,rgba(0,0,0,0),#03050c)]">
                  <p className="whitespace-nowrap overflow-hidden">
                    {svg.name}
                  </p>
                </div>

                <button
                  className="w-full py-1 border border-primary-border rounded-2xl flex items-center justify-center gap-2"
                  onClick={() => handleAddIcon(svg)}
                >
                  Add <span className="icon-plus" />
                </button>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

type Props = {
  svg: Icon;
  setCollection: Dispatch<SetStateAction<IconCollection>>;
};

function MutableCard({ svg, setCollection }: Props) {
  const [toggleSetup, setToggleSetup] = useState(false);

  const handleNameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const regex = /^[a-zA-Z0-9-_]+$/;
    let normalizedText = e.target.value.toLowerCase();
    if (regex.test(normalizedText) || normalizedText === "") {
      setCollection((prev) => {
        const newIcons = [...prev.icons];
        const icon = newIcons.find((ico) => ico.id === svg.id);

        const nameUsed = newIcons.find((ico) => ico.name === e.target.value);

        if (nameUsed !== undefined) {
          // setErrorMessage('Name already used!')
          nameUsed.warning = true;
          if (icon) icon.warning = true;
        } else {
          // setErrorMessage('')
          newIcons.forEach((ico) => {
            ico.warning = false;
          });
        }

        if (icon) {
          icon.name = e.target.value;
        }

        return { ...prev, icons: newIcons };
      });
    }
  };

  const handleUnicodeChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCollection((prev) => {
      const newIcons = [...prev.icons];
      const icon = newIcons.find((ico) => ico.id === svg.id);

      const unicodeUsed = newIcons.find(
        (ico) => ico.unicode === e.target.value
      );

      if (unicodeUsed !== undefined) {
        // setErrorMessage('Unicode already used!')
        unicodeUsed.warning = true;
        if (icon) icon.warning = true;
      } else {
        // setErrorMessage('')
        newIcons.forEach((ico) => {
          ico.warning = false;
        });
      }

      if (icon) {
        icon.unicode = e.target.value;
      }

      return { ...prev, icons: newIcons };
    });
  };

  const handleColorChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const regex = /^[a-zA-Z0-9#]+$/;
    let normalizedText = e.target.value.toLowerCase();
    if (regex.test(normalizedText) || normalizedText === "") {
      setCollection((prev) => {
        const newIcons = [...prev.icons];
        const icon = newIcons.find((ico) => ico.id === svg.id);

        if (icon) {
          icon.color = e.target.value;
          const color = e.target.value;
          icon.content = changeSvgColor(icon.content, color);
        }

        return { ...prev, icons: newIcons };
      });
    }
  };

  const handleIconRemoved = () => {
    setCollection((prev) => {
      const newIcons = [...prev.icons];
      const iconIndex = newIcons.findIndex((ico) => ico.id === svg.id);

      newIcons.splice(iconIndex, 1);

      return { ...prev, icons: newIcons };
    });
  };
  return (
    <article className="relative p-5 border border-primary-border rounded-2xl flex flex-col items-center gap-4">
      <Image
        className="icon__svg"
        width={36}
        height={36}
        src={`data:image/svg+xml;base64,${btoa(
          unescape(encodeURIComponent(svg.content))
        )}`}
        alt={`icon ${svg.name}`}
      />

      <div className="relative w-full px-2 border border-primary-border focus-within:border-white rounded-lg overflow-hidden after:absolute after:top-0 after:right-0 after:w-10 after:h-full after:block after:bg-[linear-gradient(90deg,rgba(0,0,0,0),#03050c)] after:pointer-events-none">
        <input
          className="w-full whitespace-nowrap overflow-hidden border-none text-center focus-visible:outline-none"
          type="text"
          value={svg.name}
          onChange={handleNameChanged}
        />
      </div>

      <button
        className="w-full h-[34px] py-1 border border-primary-border rounded-full"
        onClick={handleIconRemoved}
      >
        Remove
      </button>

      <button
        className="w-full h-4"
        onClick={() => setToggleSetup(!toggleSetup)}
      >
        <span className="icon-chevron-down text-xl" />
      </button>

      {toggleSetup && (
        <div className="absolute top-[calc(100%-40px)] -left-[1px] w-[calc(100%+2px)] h-auto p-5 pt-0 flex flex-col gap-4 border border-t-0 border-primary-border rounded-b-2xl transition-all bg-main z-10">
          <div className="w-full flex flex-col gap-2">
            <label htmlFor={`unicode-${svg.name}`}>Unicode:</label>
            <input
              className="text-center"
              name={`unicode-${svg.name}`}
              id={`unicode-${svg.name}`}
              type="text"
              value={svg.unicode}
              onChange={handleUnicodeChanged}
            />
          </div>

          <div className="w-full flex flex-col gap-2">
            <label htmlFor={`color-${svg.name}`}>Color:</label>
            <input
              className="text-center"
              name={`color-${svg.name}`}
              id={`color-${svg.name}`}
              type="text"
              value={svg.color}
              onChange={handleColorChanged}
            />
          </div>

          <button className="h-4" onClick={() => setToggleSetup(!toggleSetup)}>
            <span className="icon-chevron-down text-xl block rotate-180" />
          </button>
        </div>
      )}
    </article>
  );
}
