import { Dispatch, SetStateAction } from "react";

type Props = {
  setOption: Dispatch<SetStateAction<string | undefined>>;
  changePalette: () => void;
  historyBack: () => void;
  historyForward: () => void;
  paletteHistory: PaletteHistory;
  toggleImg: () => void;
};

export default function SideBar({
  setOption,
  changePalette,
  historyBack,
  historyForward,
  paletteHistory,
  toggleImg,
}: Props) {
  const copyPaletteToClipboard = () => {
    const url = window.location.href.split("#")[0];
    navigator.clipboard.writeText(url);
  };
  return (
    <aside className="h-fit flex flex-col items-center select-none md:flex-row md:h-full">
      <ul className="relative w-fit h-10 px-4 flex flex-row justify-center items-center gap-3 rounded-full border border-primary-border list-none md:flex-col md:w-10 md:h-fit md:px-0 md:py-4">
        <li>
          <button
            className="flex py-3 px-2 rounded-xl bg-transparent border-none text-secondary secondary-hover transition duration-300"
            tooltip="true"
            tooltip-content="Palette type"
            tooltip-position="left"
            onClick={() => setOption("palette-type")}
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
            onClick={() => setOption("color-blind")}
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
            <span className="icon-plus text-2xl" />
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
            className="option palette-like"
            // onClick={saveHandler}
            data-tooltip
            // data-colors={history.data[history.currentIndex]}
            // data-saved={isSaved}
            // data-id={savedId}
            tooltip="true"
            tooltip-content="Save"
            tooltip-position="left"
          >
            <span
            // className={`
            //   option__icon icon
            //   icon-heart${isSaved ? "-filled" : ""}
            // `}
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
