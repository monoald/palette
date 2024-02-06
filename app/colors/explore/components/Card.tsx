import { MotionDiv } from "@/app/components/FramerMotion";
import { ColorType } from "./getColors";
import { getMainContrastColor } from "@/app/utils/createColorObject";
import { hexToRgb } from "colors-kit";

type Props = {
  color: ColorType;
  index: number;
};

const variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export default function Card({ color, index }: Props) {
  return (
    <MotionDiv
      variants={variants}
      initial="hidden"
      animate="visible"
      transition={{
        delay: index * 0.2,
        ease: "easeInOut",
        duration: 0.5,
      }}
      viewport={{ amount: 0 }}
    >
      <li className="flex flex-col gap-5">
        <div
          className="w-full h-36 flex items-center justify-center rounded-3xl overflow-hidden text-[0px] hover:text-lg font-semibold transition-all"
          style={{
            background: "#" + color.name,
            color: getMainContrastColor(hexToRgb("#" + color.name)),
          }}
        >
          <p className="uppercase">{"#" + color.name}</p>
        </div>

        <div className="w-fit h-fit px-5 py-2 mx-auto border border-primary-border rounded-full flex items-center gap-7 text-2xl">
          <button
            className="secondary-hover flex"
            tooltip="true"
            tooltip-content="Save"
            tooltip-position="bottom"
          >
            <span
              className={`
                icon
                icon-heart${color.saved ? "-filled" : ""}
              `}
            />
          </button>
        </div>
      </li>
    </MotionDiv>
  );
}
