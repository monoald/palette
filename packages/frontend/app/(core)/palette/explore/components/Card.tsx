"use client";

import { MotionDiv } from "@/app/components/FramerMotion";
import { getMainContrastColor } from "@/app/utils/createBaseColorObject";
import { hexToRgb } from "colors-kit";
import { PaletteType } from "./getPublicPalettes";
import { useUserStore } from "@/store";
import { dispatch } from "@/app/(core)/hooks/useStateHandler";
import { handleSavePalette, handleUnsavePalette } from "@/app/(core)/handlers";
import Link from "next/link";

type Props = {
  palette: PaletteType;
  index: number;
};

const variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export default function Card({ palette, index }: Props) {
  const token = useUserStore((state) => state.token);
  const updatePalettes = useUserStore((state) => state.updatePalettes);

  const savePalette = async () => {
    if (!token) {
      dispatch("custom:updateMessage", {
        type: "error",
        message: "You must login to save a palette!",
      });
      return;
    }

    if (palette.saved) {
      await handleUnsavePalette(
        token,
        palette,
        updatePalettes,
        () => {
          dispatch("custom:unsavePalette", { colors: palette.name });
        },
        () => {
          dispatch("custom:savePalette", { colors: palette.name });
        }
      );
    } else {
      await handleSavePalette(
        token,
        palette,
        updatePalettes,
        () => {
          dispatch("custom:savePalette", { colors: palette.name });
        },
        () => {
          dispatch("custom:unsavePalette", { colors: palette.name });
        }
      );
    }
  };

  return (
    <MotionDiv
      variants={variants}
      initial="hidden"
      animate="visible"
      transition={{
        delay: index * 0.1,
        ease: "easeInOut",
        duration: 0.3,
      }}
      viewport={{ amount: 0 }}
    >
      <li className="flex flex-col gap-5">
        <ul className="w-full h-36 flex rounded-3xl overflow-hidden">
          {palette.colorsArr.map((color) => (
            <li
              key={color}
              className="w-full hover:w-[130%] transition-all text-[0px] hover:text-base"
            >
              <Link
                href={`/color/${color.replace("#", "")}`}
                className="w-full h-full flex items-center justify-center"
                style={{
                  background: color,
                }}
              >
                <span
                  className="uppercase"
                  style={{
                    color: getMainContrastColor(hexToRgb(color)),
                  }}
                >
                  {color}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="w-fit h-fit px-5 py-2 mx-auto border border-primary-border rounded-full flex items-center gap-7 text-2xl">
          <button
            className="secondary-hover flex"
            onClick={savePalette}
            tooltip="true"
            tooltip-content="Save"
            tooltip-position="bottom"
          >
            <span
              className={`
                ${palette.saved ? "icon-heart-filled" : "icon-heart"}
              `}
            />
          </button>

          <div
            className="w-fit h-fit"
            tooltip="true"
            tooltip-content="Edit"
            tooltip-position="bottom"
          >
            <Link
              href={`/palette/craft/${palette.name}`}
              className="secondary-hover flex"
            >
              <span className="icon-palette" />
            </Link>
          </div>
        </div>
      </li>
    </MotionDiv>
  );
}
