import { dispatch } from "@/app/(core)/hooks/useStateHandler";
import { Dispatch, SetStateAction } from "react";

type Props = {
  setPaletteTypeOpen: Dispatch<SetStateAction<boolean>>;
  setColorBlindOpen: Dispatch<SetStateAction<boolean>>;
  changePalette: () => void;
  historyBack: () => void;
  historyForward: () => void;
  paletteHistory: CustomHistory;
  toggleImg: () => void;
  savePalette: () => void;
  isPaletteSaved: boolean;
};

export default function SideBar({
  setPaletteTypeOpen,
  setColorBlindOpen,
  changePalette,
  historyBack,
  historyForward,
  paletteHistory,
  toggleImg,
  savePalette,
  isPaletteSaved,
}: Props) {
  const copyPaletteToClipboard = () => {
    const url = window.location.href.split("#")[0];
    navigator.clipboard.writeText(url);
    dispatch("custom:updateMessage", {
      type: "success",
      message: "Palette url copied to clipboard",
    });
  };
  return (
    <aside className="h-10 flex flex-col items-center select-none md:flex-row md:h-full">
      <ul className="max-w-full relative w-fit h-10 px-4 flex flex-row justify-center items-center gap-3 rounded-full border border-primary-border list-none md:flex-col md:w-10 md:h-fit md:px-0 md:py-4 overflow-x-scroll hidden-bar">
        <li>
          <button
            className="flex py-3 px-2 rounded-xl bg-transparent border-none text-secondary secondary-hover transition duration-300"
            tooltip="true"
            tooltip-content="Palette type"
            tooltip-position="left"
            onClick={() => setPaletteTypeOpen(true)}
          >
            <span className="icon-palette text-2xl" />
          </button>
        </li>

        <li>
          <button
            className="flex py-3 px-2 rounded-xl bg-transparent border-none text-secondary secondary-hover transition duration-300"
            tooltip="true"
            tooltip-content="Color blind simulator"
            tooltip-position="left"
            onClick={() => setColorBlindOpen(true)}
          >
            <span className="icon-eye text-2xl" />
          </button>
        </li>

        <li>
          <button
            className="flex py-3 px-2 rounded-xl bg-transparent border-none text-secondary secondary-hover transition duration-300"
            onClick={toggleImg}
            tooltip="true"
            tooltip-content="Extract palette from image"
            tooltip-position="left"
          >
            <span className="icon-image text-2xl" />
          </button>
        </li>

        <li>
          <button
            className="flex py-3 px-2 rounded-xl bg-transparent border-none text-secondary secondary-hover transition duration-300"
            tooltip="true"
            tooltip-content="Palette type"
            tooltip-position="left"
            onClick={changePalette}
          >
            <span className="icon-shuffle text-2xl" />
          </button>
        </li>

        <li>
          <button
            className="flex py-3 px-2 rounded-xl bg-transparent border-none text-secondary secondary-hover transition duration-300 disabled:text-[#777777]"
            disabled={paletteHistory.current === 0}
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
            disabled={paletteHistory.current >= paletteHistory.data.length - 1}
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
            onClick={savePalette}
            tooltip="true"
            tooltip-content="Save"
            tooltip-position="left"
          >
            <span
              className={`${
                isPaletteSaved ? "icon-heart-filled" : "icon-heart"
              } text-2xl`}
            />
          </button>
        </li>

        <li>
          <button
            className="flex py-3 px-2 rounded-xl bg-transparent border-none text-secondary secondary-hover transition duration-300"
            tooltip="true"
            tooltip-content="Share palette"
            tooltip-position="left"
            onClick={copyPaletteToClipboard}
          >
            <span className="icon-share text-2xl" />
          </button>
        </li>
      </ul>
    </aside>
  );
}
