import { MotionDiv } from "@/app/components/FramerMotion";
import { GradientType } from "./getPublicGradients";

type Props = {
  gradient: GradientType;
  index: number;
};

const variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export default function Card({ gradient, index }: Props) {
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
          className="w-full h-36 flex rounded-3xl overflow-hidden"
          style={{ background: gradient.style }}
        ></div>

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
                          icon-heart${gradient.saved ? "-filled" : ""}
                        `}
            />
          </button>

          <button
            className="secondary-hover flex"
            // onClick={() => editPaletteHandler(gradient.colors as string)}
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
