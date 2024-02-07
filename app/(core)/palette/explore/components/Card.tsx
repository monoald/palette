import { MotionDiv } from "@/app/components/FramerMotion";
import { getMainContrastColor } from "@/app/utils/createColorObject";
import { hexToRgb } from "colors-kit";
import { PaletteType } from "./getPublicPalettes";

type Props = {
  palette: PaletteType;
  index: number;
};

const variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export default function Card({ palette, index }: Props) {
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
        <ul className="w-full h-36 flex rounded-3xl overflow-hidden">
          {palette.colorsArr.map((color) => (
            <li
              key={color}
              className="w-full hover:w-[130%] transition-all text-[0px] hover:text-base"
            >
              <button
                className="w-full h-full"
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
              </button>
            </li>
          ))}
        </ul>

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
                          icon-heart${palette.saved ? "-filled" : ""}
                        `}
            />
          </button>

          <button
            className="secondary-hover flex"
            // onClick={() => editPaletteHandler(palette.colors as string)}
            tooltip="true"
            tooltip-content="Edit"
            tooltip-position="bottom"
          >
            <span className="icon-palette" />
          </button>
        </div>
      </li>
    </MotionDiv>
  );
}
