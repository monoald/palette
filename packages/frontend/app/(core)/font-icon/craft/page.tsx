"use client";

import { useState } from "react";
import SideBar from "./components/SideBar";
import { MutableCard } from "../components/MutableCard";
import { changeSvgColor } from "../utils/changeIconColor";
import UpdateIconsColor from "../components/UpdateIconsColor";
import { makeRandomID } from "@/app/utils/makeRandomID";
import { dispatch } from "../../hooks/useStateHandler";
import { useUserStore } from "@/store";
import { saveFontIcon, downloadFonts } from "../actions";
import { useRouter } from "next/navigation";
import PaletaIcons from "../components/PaletaIcons";

export type Icon = {
  id?: string | number;
  name: string;
  svg: string;
  unicode: string;
  color: string | undefined;
  warning?: boolean;
};

export type Fonticon = {
  id?: string;
  name: string;
  color: string | undefined;
  thumbnail: string;
};

export type FonticonData = {
  data: Fonticon;
  icons: Icon[];
};

export default function Page() {
  const [fonticon, setFonticon] = useState<FonticonData>({
    data: {
      name: "untitled",
      color: "#ffffff",
      thumbnail: "",
    },
    icons: [],
  });

  const token = useUserStore((state) => state.token);
  const updateFontIcons = useUserStore((state) => state.updateFontIcons);
  const router = useRouter();

  const handleNameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const regex = /^[a-zA-Z0-9-_]+$/;
    let normalizedText = e.target.value.toLowerCase();
    if (regex.test(normalizedText) || normalizedText === "") {
      setFonticon((prev) => ({
        ...prev,
        data: { ...prev.data, name: normalizedText },
      }));
    }
  };

  const handleAddIcon = (svg: Icon) => {
    setFonticon((prev) => {
      const newIcons = [...prev.icons];
      const newIcon: Icon = { ...svg };

      const alreadyAdded = newIcons.findIndex((ico) => ico.svg === newIcon.svg);

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
              parseInt(newIcons[newIcons.length - 1].unicode as string, 16) + 1
            ).toString(16);

      newIcons.push(newIcon);

      return { ...prev, icons: newIcons };
    });
  };

  const saveIcons = async () => {
    if (!token) {
      dispatch("custom:updateMessage", {
        type: "warning",
        message: "You must login to save a font icon",
      });
      return;
    }

    if (fonticon.icons.length < 3) {
      dispatch("custom:updateMessage", {
        type: "error",
        message: "You must add at least 3 icons",
      });
      return;
    }

    const id = await saveFontIcon(fonticon, token as string, updateFontIcons);

    if (id !== undefined) {
      router.push(`/font-icon/edit/${fonticon.data.name}`);
    }
  };

  const downloadFonticon = async () => {
    downloadFonts(fonticon);
  };

  // Update Icons Color
  const [iconsColor, setIconsColor] = useState(false);

  const toggleIconsColor = () => {
    setIconsColor(!iconsColor);
  };

  const iconsColorChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFonticon((prev) => {
      const newIcons = [...(prev.icons as Icon[])];

      newIcons.forEach((ico, index) => {
        const svg = changeSvgColor(ico.svg, e.target.value as string);

        newIcons[index] = {
          ...ico,
          svg,
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
            const target = event.target as EventTarget & { result: string };
            let name = file.name
              .split(".")[0]
              .toLowerCase()
              .replaceAll(" ", "-");
            const color = fonticon.data.color as string;

            const svg = changeSvgColor(target.result, color);

            let warning = false;

            let alreadyAdded = -1;
            let nameUsed = -1;

            fonticon.icons?.forEach((ico, index) => {
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
            setFonticon((prev) => ({
              ...prev,
              icons: [...prev.icons, newIcon],
            }));
          };

          reader.readAsText(file);
        }
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] p-8 flex gap-8 bg-main text-secondary text-sm">
      <SideBar
        toggleIconsColor={toggleIconsColor}
        uploadIcons={uploadIcons}
        saveIcons={saveIcons}
        downloadFontIcons={downloadFonticon}
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
          <div className="w-full h-auto grid grid-cols-[repeat(auto-fill,_minmax(140px,_1fr))] gap-8">
            {fonticon?.icons.map((svg) => (
              <MutableCard key={svg.id} svg={svg} setCollection={setFonticon} />
            ))}
          </div>
        </section>

        <PaletaIcons handleAddIcon={handleAddIcon} />
      </main>
    </div>
  );
}
