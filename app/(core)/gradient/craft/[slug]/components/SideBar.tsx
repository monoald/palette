import { dispatch } from "@/app/(core)/hooks/useStateHandler";
import { getParam } from "@/app/utils/urlState";
import { Dispatch, SetStateAction } from "react";

type Props = {
  gradientStyle: GradientStyle;
  setGradientTypeOpen: Dispatch<SetStateAction<boolean>>;
  setGradientAnimationOpen: Dispatch<SetStateAction<boolean>>;
  setColorsOpen: Dispatch<SetStateAction<boolean>>;
  setAngleOpen: Dispatch<SetStateAction<boolean>>;
  setCirclePositionOpen: Dispatch<SetStateAction<boolean>>;
  changeGradient: () => void;
  gradientHistory: CustomHistory;
  historyBack: () => void;
  historyForward: () => void;
  animation: string;
  saveGradient: () => void;
  isSaved: boolean;
};

const horizontalAnimation = {
  animation: "animation: horizontal 5s linear infinite;",
  keyframe: `@keyframes horizontal {
  0% {
    background-position-x: 0%;
  }
  50% {
    background-position-x: 100%;
  }
  100% {
    background-position-x: 0%;
  }
}`,
};
const verticalAnimation = {
  animation: "animation: vertical 5s linear infinite;",
  keyframe: `@keyframes vertical {
  0% {
    background-position-y: 0%;
  }
  50% {
    background-position-y: 100%;
  }
  100% {
    background-position-y: 0%;
  }
}`,
};

const spinAnimation = {
  animation: "animation: spin 5s linear infinite;",
  keyframe: `@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(360deg);
  }
}`,
};

export default function SideBar({
  gradientStyle,
  setGradientTypeOpen,
  setGradientAnimationOpen,
  setColorsOpen,
  setAngleOpen,
  setCirclePositionOpen,
  changeGradient,
  gradientHistory,
  historyBack,
  historyForward,
  animation,
  saveGradient,
  isSaved,
}: Props) {
  const copyCodeToClipboard = () => {
    let code = "";
    if (animation === "spin") {
      code += `.parent {
  position: relative;
  overflow: hidden;
}
`;
    }
    code += ".card{";

    if (animation === "spin") {
      code += `
  position: absolute;
  inset: -90%;`;
    }

    code += `
  background: ${gradientStyle.type}${gradientStyle.clrs});
  background: -o-${gradientStyle.type}${gradientStyle.clrs});
  background: -ms-${gradientStyle.type}${gradientStyle.clrs});
  background: -moz-${gradientStyle.type}${gradientStyle.clrs});
`;

    if (animation === "horizontal") {
      code += `  background-size: 150% 100%;
  ${horizontalAnimation.animation}
`;
    } else if (animation === "vertical") {
      code += `  background-size: 100% 150%;
  ${verticalAnimation.animation}
`;
    }
    if (animation === "spin") {
      code += `  background-size: 100%;
  ${spinAnimation.animation}
`;
    }

    code += "}";

    if (animation === "horizontal") {
      code += `
${horizontalAnimation.keyframe}`;
    } else if (animation === "vertical") {
      code += `
${verticalAnimation.keyframe}`;
    } else if (animation === "spin") {
      code += `
${spinAnimation.keyframe}`;
    }

    navigator.clipboard.writeText(code);
    dispatch("custom:updateMessage", {
      type: "success",
      message: "Gradient CSS copied to clipboard",
    });
  };

  const copyUrlToClipboard = () => {
    const url = window.location.href.split("#")[0];
    navigator.clipboard.writeText(url);
    dispatch("custom:updateMessage", {
      type: "success",
      message: "Gradient url copied to clipboard",
    });
  };
  return (
    <aside className="h-fit flex flex-col items-center select-none md:flex-row md:h-full">
      <ul className="max-w-full relative w-fit h-10 px-4 flex flex-row [576px]:justify-center items-center gap-3 rounded-full border border-primary-border list-none md:flex-col md:w-10 md:h-fit md:px-0 md:py-4 overflow-x-scroll md:overflow-visible hidden-bar">
        <li>
          <button
            className="flex py-3 px-2 rounded-xl bg-transparent border-none text-secondary secondary-hover transition duration-300"
            onClick={() => setColorsOpen(true)}
            tooltip="true"
            tooltip-content="Colors"
            tooltip-position="left"
          >
            <span className="icon-palette text-2xl" />
          </button>
        </li>
        <li>
          <button
            className="flex py-3 px-2 rounded-xl bg-transparent border-none text-secondary secondary-hover transition duration-300"
            onClick={() => setGradientTypeOpen(true)}
            tooltip="true"
            tooltip-content="Gradient type"
            tooltip-position="left"
          >
            {(getParam("type") == "horizontal" || getParam("angle")) && (
              <span className="icon-gradient-horizontal text-2xl" />
            )}
            {getParam("type") == "vertical" && (
              <span className="icon-gradient-vertical text-2xl" />
            )}
            {(getParam("type") == "circle" ||
              (getParam("circle-x") && getParam("circle-y"))) && (
              <span className="icon-gradient-circle text-2xl" />
            )}
            {getParam("type") === "conic" && (
              <span className="icon-gradient-conic text-2xl" />
            )}
          </button>
        </li>
        {(getParam("angle") ||
          getParam("type") == "horizontal" ||
          getParam("type") == "vertical") && (
          <li>
            <button
              className="flex py-3 px-2 rounded-xl bg-transparent border-none text-secondary secondary-hover transition duration-300"
              onClick={() => setAngleOpen(true)}
              disabled={
                !(
                  getParam("angle") ||
                  getParam("type") == "horizontal" ||
                  getParam("type") == "vertical"
                )
              }
              tooltip="true"
              tooltip-content="Angle"
              tooltip-position="left"
            >
              <span className="icon-angle text-2xl" />
            </button>
          </li>
        )}

        {(getParam("type") == "circle" ||
          (getParam("circle-x") && getParam("circle-y"))) && (
          <li>
            <button
              className="flex py-3 px-2 rounded-xl bg-transparent border-none text-secondary secondary-hover transition duration-300"
              onClick={() => setCirclePositionOpen(true)}
              disabled={
                !(
                  getParam("type") == "circle" ||
                  (getParam("circle-x") && getParam("circle-y"))
                )
              }
              tooltip="true"
              tooltip-content="Position circle"
              tooltip-position="left"
            >
              <span className="icon-move-circle text-2xl" />
            </button>
          </li>
        )}
        <li>
          <button
            className="flex py-3 px-2 rounded-xl bg-transparent border-none text-secondary secondary-hover transition duration-300"
            onClick={() => setGradientAnimationOpen(true)}
            tooltip="true"
            tooltip-content="Animation"
            tooltip-position="left"
          >
            <span className="icon-animation text-2xl" />
          </button>
        </li>
        <li>
          <button
            className="flex py-3 px-2 rounded-xl bg-transparent border-none text-secondary secondary-hover transition duration-300"
            onClick={changeGradient}
            tooltip="true"
            tooltip-content="Craft new palette"
            tooltip-position="left"
          >
            <span className="icon-shuffle text-2xl" />
          </button>
        </li>
        <li>
          <button
            className="flex py-3 px-2 rounded-xl bg-transparent border-none text-secondary secondary-hover transition duration-300"
            disabled={gradientHistory.current === 0}
            tooltip="true"
            tooltip-content="Undo"
            tooltip-position="left"
            onClick={historyBack}
          >
            <span className="icon-undo text-2xl" />
          </button>
        </li>
        <li>
          <button
            className="flex py-3 px-2 rounded-xl bg-transparent border-none text-secondary secondary-hover transition duration-300"
            disabled={
              gradientHistory.current >= gradientHistory.data.length - 1
            }
            tooltip="true"
            tooltip-content="Redo"
            tooltip-position="left"
            onClick={historyForward}
          >
            <span className="icon-redo text-2xl" />
          </button>
        </li>

        <li>
          <button
            className="flex py-3 px-2 rounded-xl bg-transparent border-none text-secondary secondary-hover transition duration-300 disabled:text-[#777777] disabled:pointer-events-none"
            onClick={saveGradient}
            tooltip="true"
            tooltip-content="Save"
            tooltip-position="left"
          >
            <span
              className={`${
                isSaved ? "icon-heart-filled" : "icon-heart"
              } text-2xl`}
            />
          </button>
        </li>

        <li>
          <button
            className="flex py-3 px-2 rounded-xl bg-transparent border-none text-secondary secondary-hover transition duration-300"
            tooltip="true"
            tooltip-content="Copy code"
            tooltip-position="left"
            onClick={copyCodeToClipboard}
          >
            <span className="icon-code text-2xl" />
          </button>
        </li>

        <li>
          <button
            className="flex py-3 px-2 rounded-xl bg-transparent border-none text-secondary secondary-hover transition duration-300"
            tooltip="true"
            tooltip-content="Share palette"
            tooltip-position="left"
            onClick={copyUrlToClipboard}
          >
            <span className="icon-share text-2xl" />
          </button>
        </li>
      </ul>
    </aside>
  );
}
