"use client";

import { MotionDiv } from "@/app/components/FramerMotion";
import { ColorType } from "./getColors";
import { getMainContrastColor } from "@/app/utils/createColorObject";
import { hexToRgb } from "colors-kit";
import { useUserStore } from "@/store";
import { dispatch } from "@/app/(core)/hooks/useStateHandler";
import { handleSaveColor, handleUnsaveColor } from "@/app/(core)/handlers";
import Link from "next/link";

type Props = {
  color: ColorType;
  index: number;
};

const variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export default function Card({ color, index }: Props) {
  const token = useUserStore((state) => state.token);
  const updateColors = useUserStore((state) => state.updateColors);

  const saveColor = async () => {
    if (!token) {
      dispatch("custom:updateMessage", {
        type: "error",
        message: "You must login to save a color!",
      });
      return;
    }

    if (color.saved) {
      await handleUnsaveColor(
        token,
        color,
        updateColors,
        () => {
          dispatch("custom:unsaveColor", { name: color.name });
        },
        () => {
          dispatch("custom:saveColor", { name: color.name });
        }
      );
    } else {
      await handleSaveColor(
        token,
        color,
        updateColors,
        () => {
          dispatch("custom:saveColor", { name: color.name });
        },
        () => {
          dispatch("custom:unsaveColor", { name: color.name });
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
        <Link
          href={`/color/${color.name}`}
          className="w-full h-36 flex items-center justify-center rounded-3xl overflow-hidden text-[0px] hover:text-lg font-semibold transition-all"
          style={{
            background: "#" + color.name,
            color: getMainContrastColor(hexToRgb("#" + color.name)),
          }}
        >
          <p className="uppercase">{"#" + color.name}</p>
        </Link>

        <div className="w-fit h-fit px-5 py-2 mx-auto border border-primary-border rounded-full flex items-center gap-7 text-2xl">
          <button
            className="secondary-hover flex"
            onClick={saveColor}
            tooltip="true"
            tooltip-content="Save"
            tooltip-position="bottom"
          >
            <span
              className={`${color.saved ? "icon-heart-filled" : "icon-heart"}
              `}
            />
          </button>
        </div>
      </li>
    </MotionDiv>
  );
}
