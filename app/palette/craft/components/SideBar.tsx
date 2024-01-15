import React from "react";

export default function SideBar() {
  return (
    <aside className="select-none flex items-center">
      <ul className="relative w-14 h-fit py-4 flex flex-col justify-center items-center gap-3 rounded-full border border-primary-border list-none">
        <li>
          <button
            className="p-3 rounded-xl bg-transparent border-none text-secondary hover:text-tertiary transition duration-300"
            // onClick={() =>
            //   optionsDispatch({ type: "option", payload: "paletteType" })
            // }
            tooltip="true"
            tooltip-content="Palette type"
            tooltip-position="left"
          >
            <span className="icon-palette text-2xl" />
          </button>
        </li>

        <li>
          <button
            className="p-3 rounded-xl bg-transparent border-none text-secondary hover:text-tertiary transition duration-300"
            // onClick={() =>
            //   optionsDispatch({ type: "option", payload: "colorBlind" })
            // }
            tooltip="true"
            tooltip-content="Color blind simulator"
            tooltip-position="left"
          >
            <span className="icon-eye text-2xl" />
          </button>
        </li>

        <li>
          <button
            className="p-3 rounded-xl bg-transparent border-none text-secondary hover:text-tertiary transition duration-300"
            // onClick={() => modalsDispatch({ type: "img-extractor" })}
            tooltip="true"
            tooltip-content="Extract palette from image"
            tooltip-position="left"
          >
            <span className="icon-image text-2xl" />
          </button>
        </li>

        <li>
          <button
            className="p-3 rounded-xl bg-transparent border-none text-secondary hover:text-tertiary transition duration-300"
            // onClick={() =>
            //   colorsDispatch({ type: "set-colors", payload: { paletteType } })
            // }
            tooltip="true"
            tooltip-content="Palette type"
            tooltip-position="left"
          >
            <span className="icon-plus text-2xl" />
          </button>
        </li>

        <li>
          <button
            className="p-3 rounded-xl bg-transparent border-none text-secondary hover:text-tertiary transition duration-300"
            // onClick={() => colorsDispatch({ type: "back-palette" })}
            // disabled={history.currentIndex === 0}
            tooltip="true"
            tooltip-content="Undo"
            tooltip-position="left"
          >
            <span className="icon-undo text-2xl" />
          </button>
        </li>

        <li>
          <button
            className="p-3 rounded-xl bg-transparent border-none text-secondary hover:text-tertiary transition duration-300"
            // onClick={() => colorsDispatch({ type: "forward-palette" })}
            // disabled={history.currentIndex === history.data.length - 1}
            tooltip="true"
            tooltip-content="Redo"
            tooltip-position="left"
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
            className="p-3 rounded-xl bg-transparent border-none text-secondary hover:text-tertiary transition duration-300"
            // </li>onClick={handleShare}
            tooltip="true"
            tooltip-content="Share palette"
            tooltip-position="left"
          >
            <span className="icon-share text-2xl" />
          </button>
        </li>
      </ul>
    </aside>
  );
}
