"use client";

import { Dispatch, SetStateAction, useLayoutEffect, useState } from "react";
import SideBar from "./components/SideBar";
import { changeSvgColor } from "../../utils/changeIconColor";
import UpdateIconsColor from "../../components/UpdateIconsColor";
import { makeRandomID } from "@/app/utils/makeRandomID";
import { dispatch } from "../../../hooks/useStateHandler";
import { useUserStore } from "@/store";
import { useRouter } from "next/navigation";
import { MutableCard } from "./components/MutableCard";
import { Icon, FonticonData } from "../../craft/page";
import {
  downloadIcons,
  downloadSavedFonts,
  getFonticon,
  unsaveFontIcon,
  updateIcons,
} from "../../actions";
import PaletaIcons from "../../components/PaletaIcons";

export type Changes = {
  data: {
    name?: string;
    color?: string;
  };
  icons: {
    new: Icon[];
    update: {
      id: string;
      name?: string;
      color?: string;
      unicode?: string;
      svg?: string;
    }[];
    delete: {
      id: number;
    }[];
  };
};

const baseChanges = {
  data: {},
  icons: {
    new: [],
    update: [],
    delete: [],
  },
};

export default function Page({ params }: { params: { slug: string } }) {
  const [fonticon, setFonticon] = useState<FonticonData>();
  const [changes, setChanges] = useState<Changes>(baseChanges);

  const token = useUserStore((state) => state.token)!;
  const updateFontIcons = useUserStore((state) => state.updateFontIcons);
  const router = useRouter();

  useLayoutEffect(() => {
    async function get() {
      const data = await getFonticon(params.slug, token, router);

      setFonticon(data as FonticonData);
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
      setFonticon((prev) =>
        prev != undefined
          ? { ...prev, data: { ...prev.data, name: normalizedText } }
          : undefined
      );
      setChanges((prev) => ({ ...prev, data: { name: normalizedText } }));
    }
  };

  const handleAddIcon = (svg: Icon) => {
    const alreadyAdded = fonticon?.icons.findIndex(
      (ico) => ico.svg === svg.svg
    );

    if (alreadyAdded !== -1) {
      dispatch("custom:updateMessage", {
        type: "warning",
        message: "Icon already added",
      });
      return;
    }

    const tempIcon: Icon = { ...svg };
    tempIcon.unicode =
      fonticon?.icons.length === 0
        ? "a101"
        : (
            parseInt(
              fonticon?.icons[fonticon?.icons.length - 1].unicode as string,
              16
            ) + 1
          ).toString(16);

    const tempIcons = [...fonticon?.icons!, tempIcon];
    setFonticon((prev) => ({ ...prev!, icons: tempIcons }));

    const newIcons = changes.icons?.new
      ? [...changes.icons.new, tempIcon]
      : [tempIcon];
    setChanges((prev) => ({
      ...prev,
      icons: { ...prev.icons, new: newIcons },
    }));
  };

  // Update Icons Color
  const [iconsColor, setIconsColor] = useState(false);

  const toggleIconsColor = () => {
    setIconsColor(!iconsColor);
  };

  const iconsColorChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setFonticon((prev) => {
      if (prev) {
        const newIcons = [...(prev.icons as Icon[])];

        newIcons.forEach((ico, index) => {
          const svg = changeSvgColor(ico.svg, color as string);

          newIcons[index] = {
            ...ico,
            svg,
            color: color,
          };
        });

        return {
          data: {
            ...prev.data,
            color: color,
          },
          icons: newIcons,
        };
      }
      return prev;
    });
    setChanges((prev) => ({ ...prev, data: { ...prev.data, color } }));
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
            if (fonticon) {
              const target = event.target as EventTarget & { result: string };
              let name = file.name
                .split(".")[0]
                .toLowerCase()
                .replaceAll(" ", "-");
              const color = (fonticon.data.color as string) || "#ffffff";

              const svg = changeSvgColor(target.result, color);

              let warning = false;

              let alreadyAdded = -1;
              let nameUsed = -1;

              fonticon.icons.forEach((ico, index) => {
                if (ico.svg === svg) alreadyAdded = index;
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
                fonticon.icons[nameUsed].warning = true;
              }

              const unicode =
                fonticon.icons.length === 0
                  ? (parseInt("a101", 16) + i).toString(16)
                  : (
                      parseInt(
                        fonticon.icons[fonticon.icons.length - 1]
                          .unicode as string,
                        16
                      ) +
                      1 +
                      i
                    ).toString(16);

              const newIcon = {
                name,
                svg,
                unicode,
                id: makeRandomID(),
                color: fonticon.data.color,
                warning,
              };
              setFonticon((prev) =>
                prev
                  ? {
                      ...prev,
                      icons: [...prev.icons, newIcon],
                    }
                  : prev
              );

              const newIcons = changes.icons?.new
                ? [...changes.icons.new, newIcon]
                : [newIcon];
              setChanges((prev) => ({
                ...prev,
                icons: { ...prev.icons, new: newIcons },
              }));
            }
          };

          reader.readAsText(file);
        }
      }
    }
  };

  // Update Collection
  const updateFontIcon = async () => {
    await updateIcons(fonticon?.data.id!, token as string, changes);
    setChanges(baseChanges);
  };

  // Download
  const downloadFonticons = async () => {
    if (JSON.stringify(changes) !== JSON.stringify(baseChanges)) {
      await updateFontIcon();
    }
    await downloadSavedFonts(fonticon?.data?.id!, fonticon?.data.name!);
  };

  const downloadSvgIcons = async () => {
    if (JSON.stringify(changes) !== JSON.stringify(baseChanges)) {
      await updateFontIcon();
    }
    await downloadIcons(fonticon?.data.id!, fonticon?.data.name!);
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
      {fonticon ? (
        <>
          <SideBar
            toggleIconsColor={toggleIconsColor}
            uploadIcons={uploadIcons}
            updateFontIcon={updateFontIcon}
            downloadFontIcons={downloadFonticons}
            downloadSvgIcons={downloadSvgIcons}
            unsaveIcons={unsaveIcons}
          />
          {iconsColor && (
            <UpdateIconsColor
              iconsColorChanged={iconsColorChanged}
              toggleIconsColor={toggleIconsColor}
              iconsColor={fonticon.data.color as string}
            />
          )}
          <main className="w-full h-full ml-[72px] flex flex-col gap-12 items-center">
            <section className="w-full h-auto flex flex-col items-center gap-10">
              <input
                type="text"
                className="max-w-80 min-h-10 text-xl text-center"
                value={fonticon.data.name}
                onChange={handleNameChanged}
              />
              <p className="flex items-center gap-3">
                <span className="icon-info text-2xl info-icon" /> Remember to
                save all your changes!
              </p>
              <div className="w-full h-auto grid grid-cols-[repeat(auto-fill,_minmax(140px,_1fr))] gap-8">
                {fonticon?.icons.map((icon) => (
                  <MutableCard
                    key={icon.id}
                    icon={icon}
                    setFonticon={
                      setFonticon as Dispatch<SetStateAction<FonticonData>>
                    }
                    changes={changes}
                    setChanges={setChanges}
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
