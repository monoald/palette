"use client";

import Image from "next/image";
import { svgs } from "../data/svg";
import { useState } from "react";
import SideBar from "../components/SideBar";
import { MutableCard } from "../components/MutableCard";
import { changeSvgColor } from "../utils/changeIconColor";
import UpdateIconsColor from "../components/UpdateIconsColor";
import { makeRandomID } from "@/app/utils/makeRandomID";
export type Icon = {
  id?: string | undefined;
  name: string;
  content: string;
  unicode: string;
  color: string | undefined;
  warning?: boolean;
};

export type IconCollection = {
  name: string;
  color: string;
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

  // Update Icons Color
  const [iconsColor, setIconsColor] = useState(false);

  const toggleIconsColor = () => {
    setIconsColor(!iconsColor);
  };

  const iconsColorChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCollection((prev) => {
      const newIcons = [...(prev.icons as Icon[])];

      newIcons.forEach((ico, index) => {
        const content = changeSvgColor(ico.content, e.target.value as string);

        newIcons[index] = {
          ...ico,
          content,
          color: e.target.value,
        };
      });

      return {
        ...prev,
        color: e.target.value,
        icons: newIcons,
      };
    });
  };

  // Upload Icons
  const uploadIcons = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;

    if (selectedFiles && selectedFiles.length > 0) {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        if (file.type === "image/svg+xml") {
          const reader = new FileReader();

          reader.onload = (event: Event) => {
            if (collection) {
              const target = event.target as EventTarget & { result: string };
              const name = file.name.split(".")[0];
              const color = collection.color as string;

              const content = changeSvgColor(target.result, color);

              let warning = false;

              let alreadyAdded = -1;
              let nameUsed = -1;

              collection.icons?.forEach((ico, index) => {
                if (ico.content === content) alreadyAdded = index;
                if (ico.name === name) nameUsed = index;
              });

              if (alreadyAdded !== -1) {
                // setErrorMessage('Icon already added!')
                return;
              } else {
                // setErrorMessage('')
              }

              if (nameUsed !== -1) {
                // setErrorMessage('Name already used!')
                warning = true;
                collection.icons[nameUsed].warning = true;
              } else {
                // setErrorMessage('')
                collection.icons.forEach((ico) => {
                  ico.warning = false;
                });
              }

              const unicode =
                collection.icons.length === 0
                  ? (parseInt("a100", 16) + 1 + i).toString(16)
                  : (
                      parseInt(
                        collection.icons[collection.icons.length - 1]
                          .unicode as string,
                        16
                      ) + i
                    ).toString(16);

              const newIcon = {
                name,
                content,
                unicode,
                id: makeRandomID(),
                color: collection.color,
                warning,
              };
              setCollection((prev) => ({
                ...prev,
                icons: [...prev.icons, newIcon],
              }));
            }
          };

          reader.readAsText(file);
        }
      }
      // if (inputRef.current) inputRef.current.value = ''
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] p-8 flex gap-8 bg-main text-secondary text-sm">
      <SideBar toggleIconsColor={toggleIconsColor} uploadIcons={uploadIcons} />
      {iconsColor && (
        <UpdateIconsColor
          iconsColorChanged={iconsColorChanged}
          toggleIconsColor={toggleIconsColor}
          iconsColor={collection.color as string}
        />
      )}
      <main className="w-full h-full ml-[72px] flex flex-col gap-12 items-center">
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
