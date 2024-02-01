import { getParam } from "@/app/utils/urlState";
import { Dispatch, SetStateAction } from "react";

type Props = {
  setGradientTypeOpen: Dispatch<SetStateAction<boolean>>;
  setColorsOpen: Dispatch<SetStateAction<boolean>>;
  setAngleOpen: Dispatch<SetStateAction<boolean>>;
  setCirclePositionOpen: Dispatch<SetStateAction<boolean>>;
  changeGradient: () => void;
  gradientHistory: CustomHistory;
  historyBack: () => void;
  historyForward: () => void;
};

export default function SideBar({
  setGradientTypeOpen,
  setColorsOpen,
  setAngleOpen,
  setCirclePositionOpen,
  changeGradient,
  gradientHistory,
  historyBack,
  historyForward,
}: Props) {
  return (
    <aside className="h-fit flex flex-col items-center select-none md:flex-row md:h-full">
      <ul className="relative w-fit h-10 px-4 flex flex-row justify-center items-center gap-3 rounded-full border border-primary-border list-none md:flex-col md:w-10 md:h-fit md:px-0 md:py-4">
        <li>
          <button
            className="flex py-3 px-2 rounded-xl bg-transparent border-none text-secondary secondary-hover transition duration-300"
            onClick={() => setGradientTypeOpen(true)}
            tooltip="true"
            tooltip-content="Gradient type"
            tooltip-position="left"
          >
            <span className="icon-gradient-vertical text-2xl" />
          </button>
        </li>
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
            className="flex py-3 px-2 rounded-xl bg-transparent border-none text-secondary secondary-hover transition duration-300 disabled:text-[#777777]"
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
            className="flex py-3 px-2 rounded-xl bg-transparent border-none text-secondary secondary-hover transition duration-300 disabled:text-[#777777] disabled:pointer-events-none"
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
      </ul>
    </aside>
  );
}
