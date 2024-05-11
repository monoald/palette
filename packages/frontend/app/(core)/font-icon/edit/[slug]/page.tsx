"use client";

import { Dispatch, SetStateAction, useLayoutEffect, useState } from "react";
import SideBar from "./components/SideBar";
import { changeSvgColor } from "../../utils/changeIconColor";
import UpdateIconsColor from "../../components/UpdateIconsColor";
import { makeRandomID } from "@/app/utils/makeRandomID";
import { dispatch } from "../../../hooks/useStateHandler";
import { useUserStore } from "@/store";
import { useRouter } from "next/navigation";
import { MutableCard } from "../../components/MutableCard";
import { Icon, IconCollection } from "../../craft/page";
import {
  downloadFonts,
  downloadIcons,
  getFontIcon,
  unsaveFontIcon,
  updateIcons,
} from "../../actions";
import PaletaIcons from "../../components/PaletaIcons";

export default function Page({ params }: { params: { slug: string } }) {
  const [collection, setCollection] = useState<IconCollection | null>(null);

  const token = useUserStore((state) => state.token);
  const updateFontIcons = useUserStore((state) => state.updateFontIcons);
  const router = useRouter();

  useLayoutEffect(() => {
    async function get() {
      const [id, name] = params.slug.split("%2B");
      const data = await getFontIcon(id, name, router);

      setCollection(data as IconCollection);
    }
    if (!token) {
      router.push("/font-icon/craft");
    }

    get();
  }, [params.slug, router, token]);

  const handleNameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const regex = /^[a-zA-Z0-9-_]+$/;
    let normalizedText = e.target.value.toLowerCase();
    if (regex.test(normalizedText) || normalizedText === "") {
      setCollection((prev) =>
        prev ? { ...prev, name: normalizedText } : null
      );
    }
  };

  const handleAddIcon = (svg: Icon) => {
    setCollection((prev) => {
      if (prev) {
        const newIcons = [...prev.icons];
        const newIcon: Icon = { ...svg };

        const alreadyAdded = newIcons.findIndex(
          (ico) => ico.content === svg.content
        );

        if (alreadyAdded !== -1) {
          dispatch("custom:updateMessage", {
            type: "warning",
            message: "Icon already added",
          });
          return prev;
        }

        newIcon.unicode =
          newIcons.length === 0
            ? "a101"
            : (
                parseInt(newIcons[newIcons.length - 1].unicode as string, 16) +
                1
              ).toString(16);

        newIcons.push(newIcon);

        return { ...prev, icons: newIcons };
      }
      return prev;
    });
  };

  // Update Icons Color
  const [iconsColor, setIconsColor] = useState(false);

  const toggleIconsColor = () => {
    setIconsColor(!iconsColor);
  };

  const iconsColorChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCollection((prev) => {
      if (prev) {
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
      }
      return prev;
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
              let name = file.name
                .split(".")[0]
                .toLowerCase()
                .replaceAll(" ", "-");
              const color = (collection?.color as string) || "#ffffff";

              const content = changeSvgColor(target.result, color);

              let warning = false;

              let alreadyAdded = -1;
              let nameUsed = -1;

              collection.icons.forEach((ico, index) => {
                if (ico.content === content) alreadyAdded = index;
                if (ico.name === name) nameUsed = index;
              });

              if (alreadyAdded !== -1) {
                dispatch("custom:updateMessage", {
                  type: "warning",
                  message: `Icon ${name} already uploaded`,
                });
                return;
              }

              if (nameUsed !== -1) {
                dispatch("custom:updateMessage", {
                  type: "warning",
                  message: `Name ${name} already used`,
                });
                warning = true;
                collection.icons[nameUsed].warning = true;
              }

              const unicode =
                collection.icons.length === 0
                  ? (parseInt("a101", 16) + i).toString(16)
                  : (
                      parseInt(
                        collection.icons[collection.icons.length - 1]
                          .unicode as string,
                        16
                      ) +
                      1 +
                      i
                    ).toString(16);

              const newIcon = {
                name,
                content,
                unicode,
                id: makeRandomID(),
                color: collection.color,
                warning,
              };
              setCollection((prev) =>
                prev
                  ? {
                      ...prev,
                      icons: [...prev.icons, newIcon],
                    }
                  : prev
              );
            }
          };

          reader.readAsText(file);
        }
      }
    }
  };

  // Update Collection
  const updateFontIcon = async () => {
    await updateIcons(
      params.slug.split("%2B")[0],
      token as string,
      collection as IconCollection
    );
  };

  // Download
  const downloadFontIcons = async () => {
    const [id, name] = params.slug.split("%2B");
    await downloadFonts(id, name);
  };

  const downloadSvgIcons = async () => {
    const [id, name] = params.slug.split("%2B");
    await downloadIcons(id, name);
  };

  // Unsave
  const unsaveIcons = async () => {
    await unsaveFontIcon(
      params.slug.split("%2B")[0],
      token as string,
      updateFontIcons,
      router
    );
  };

  return (
    <div className="min-h-[calc(100vh-80px)] p-8 flex gap-8 bg-main text-secondary text-sm">
      {collection ? (
        <>
          <SideBar
            toggleIconsColor={toggleIconsColor}
            uploadIcons={uploadIcons}
            updateFontIcon={updateFontIcon}
            downloadFontIcons={downloadFontIcons}
            downloadSvgIcons={downloadSvgIcons}
            unsaveIcons={unsaveIcons}
          />
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
              <p className="flex items-center gap-3">
                <span className="icon-info text-2xl info-icon" /> Remember to
                save all your changes!
              </p>
              <div className="w-full h-auto grid grid-cols-[repeat(auto-fill,_minmax(140px,_1fr))] gap-8">
                {collection?.icons.map((svg) => (
                  <MutableCard
                    key={svg.id}
                    svg={svg}
                    setCollection={
                      setCollection as Dispatch<SetStateAction<IconCollection>>
                    }
                  />
                ))}
              </div>
            </section>

            <PaletaIcons handleAddIcon={handleAddIcon} />
          </main>
        </>
      ) : (
        <div className="w-full h-[calc(100vh-80px)] flex items-center justify-center">
          <span className="mx-auto" id="loader"></span>
        </div>
      )}
    </div>
  );
}
