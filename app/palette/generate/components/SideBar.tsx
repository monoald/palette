import React from "react";

export default function SideBar() {
  return (
    <aside className="select-none">
      <ul className="relative w-14 h-full flex flex-col justify-center items-center gap-3 rounded-xl bg-primary list-none border border-[#CDCDCD1A]">
        <li>
          <button
            className="p-3 rounded-xl bg-transparent border-none text-[#fefefe] hover:text-[#5BC3EB] hover:bg-[#CDCDCD1A] transition"
            // onClick={() =>
            //   optionsDispatch({ type: "option", payload: "paletteType" })
            // }
            // data-tooltip
          >
            {/* <DescriptionTooltip text="Palete type" tipPosition="right" /> */}
            <span className="icon-palette text-2xl" />
          </button>
        </li>

        <li>
          <button
            className="p-3 rounded-xl bg-transparent border-none text-[#fefefe] hover:text-[#5BC3EB] hover:bg-[#CDCDCD1A] transition"
            // onClick={() =>
            //   optionsDispatch({ type: "option", payload: "colorBlind" })
            // }
            // data-tooltip
          >
            {/* <DescriptionTooltip
              text="Color blind simulator"
              tipPosition="right"
            /> */}
            <span className="icon-eye text-2xl" />
          </button>
        </li>

        <li>
          <button
            className="p-3 rounded-xl bg-transparent border-none text-[#fefefe] hover:text-[#5BC3EB] hover:bg-[#CDCDCD1A] transition"
            // onClick={() => modalsDispatch({ type: "img-extractor" })}
            // data-tooltip
          >
            {/* <DescriptionTooltip
              text="Extract palette from image"
              tipPosition="right"
            /> */}
            <span className="icon-image text-2xl" />
          </button>
        </li>

        <li>
          <button
            className="p-3 rounded-xl bg-transparent border-none text-[#fefefe] hover:text-[#5BC3EB] hover:bg-[#CDCDCD1A] transition"
            // onClick={() =>
            //   colorsDispatch({ type: "set-colors", payload: { paletteType } })
            // }
            // data-tooltip
          >
            {/* <DescriptionTooltip
              text="Change palette (Spacebar)"
              tipPosition="right"
            /> */}
            <span className="icon-plus text-2xl" />
          </button>
        </li>

        <li>
          <button
            className="p-3 rounded-xl bg-transparent border-none text-[#fefefe] hover:text-[#5BC3EB] hover:bg-[#CDCDCD1A] transition"
            // onClick={() => colorsDispatch({ type: "back-palette" })}
            // disabled={history.currentIndex === 0}
            // data-tooltip
          >
            {/* <DescriptionTooltip text="Undo" tipPosition="right" /> */}
            <span className="icon-undo text-2xl" />
          </button>
        </li>

        <li>
          <button
            className="p-3 rounded-xl bg-transparent border-none text-[#fefefe] hover:text-[#5BC3EB] hover:bg-[#CDCDCD1A] transition"
            // onClick={() => colorsDispatch({ type: "forward-palette" })}
            // disabled={history.currentIndex === history.data.length - 1}
            // data-tooltip
          >
            {/* <DescriptionTooltip text="Redo" tipPosition="right" /> */}
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
          >
            {/* <DescriptionTooltip text="Save palette" tipPosition="right" /> */}
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
            className="p-3 rounded-xl bg-transparent border-none text-[#fefefe] hover:text-[#5BC3EB] hover:bg-[#CDCDCD1A] transition"
            // </li>onClick={handleShare}
            // data-tooltip
          >
            {/* <DescriptionTooltip text="Share palette" tipPosition="right" /> */}
            <span className="icon-share text-2xl" />
          </button>
        </li>
      </ul>
    </aside>
  );
}
