"use client";

import { MotionDiv } from "@/app/components/FramerMotion";
import { GradientType } from "./getPublicGradients";
import { useUserStore } from "@/store";
import { dispatch } from "@/app/(core)/hooks/useStateHandler";
import {
  handleSaveGradient,
  handleUnsaveGradient,
} from "@/app/(core)/handlers";
import Link from "next/link";

type Props = {
  gradient: GradientType;
  index: number;
};

const variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export default function Card({ gradient, index }: Props) {
  const token = useUserStore((state) => state.token);
  const updateGradients = useUserStore((state) => state.updateGradients);

  const saveGradient = async () => {
    if (!token) {
      dispatch("custom:updateMessage", {
        type: "error",
        message: "You must login to save a gradient!",
      });
      return;
    }

    if (gradient.saved) {
      await handleUnsaveGradient(
        token,
        gradient,
        updateGradients,
        () => {
          dispatch("custom:unsaveGradient", { name: gradient.name });
        },
        () => {
          dispatch("custom:saveGradient", { name: gradient.name });
        }
      );
    } else {
      await handleSaveGradient(
        token,
        gradient,
        updateGradients,
        () => {
          dispatch("custom:saveGradient", { name: gradient.name });
        },
        () => {
          dispatch("custom:unsaveGradient", { name: gradient.name });
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
        <div
          className="w-full h-36 flex rounded-3xl overflow-hidden"
          style={{ background: gradient.style }}
        ></div>

        <div className="w-fit h-fit px-5 py-2 mx-auto border border-primary-border rounded-full flex items-center gap-7 text-2xl">
          <button
            className="secondary-hover flex"
            onClick={saveGradient}
            tooltip="true"
            tooltip-content="Save"
            tooltip-position="bottom"
          >
            <span
              className={`${
                gradient.saved ? "icon-heart-filled" : "icon-heart"
              }`}
            />
          </button>

          <div
            className="w-fit h-fit"
            tooltip="true"
            tooltip-content="Edit"
            tooltip-position="bottom"
          >
            <Link
              href={`/gradient/craft/${gradient.name}`}
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
