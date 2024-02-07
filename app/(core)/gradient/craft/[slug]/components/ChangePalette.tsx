import { Dispatch, SetStateAction } from "react";

type Props = {
  clrs: GradientColor[];
  selectCurrentClr: (id: string | undefined) => void;
  removeClr: (id: string) => void;
  addClr: (id: string) => void;
  setColorsOpen: Dispatch<SetStateAction<boolean>>;
};
export function ChangePalette({
  clrs,
  selectCurrentClr,
  removeClr,
  addClr,
  setColorsOpen,
}: Props) {
  return (
    <dialog className="absolute top-1/2 -translate-y-1/2 p-7 w-fit h-fit flex flex-col items-center gap-5 border border-primary-border rounded-2xl z-[1] text-secondary backdrop-blur-md bg-transparent-main transition-all">
      <button
        className="secondary-button w-8 h-8 ml-auto"
        onClick={() => setColorsOpen(false)}
      >
        <div>
          <span className="icon-x" />
          <div className="circle-12"></div>
          <div className="circle-11"></div>
          <div className="circle-10"></div>
          <div className="circle-9"></div>
          <div className="circle-8"></div>
          <div className="circle-7"></div>
          <div className="circle-6"></div>
          <div className="circle-5"></div>
          <div className="circle-4"></div>
          <div className="circle-3"></div>
          <div className="circle-2"></div>
          <div className="circle-1"></div>
        </div>
      </button>

      <div className="flex gap-4">
        {clrs.map((clr) => (
          <article
            key={clr.id}
            className="group w-20 h-36 rounded-xl flex flex-col items-center justify-center"
            style={{ background: clr.hex }}
          >
            <button
              className="text-2xl hidden p-3 group-hover:flex"
              style={{
                color: clr.contrastColor,
              }}
              onClick={() => removeClr(clr.id)}
              tooltip="true"
              tooltip-content="Remove"
              tooltip-position="bottom"
            >
              <span className="icon-x" />
            </button>
            <button
              className="text-2xl hidden p-3 group-hover:flex"
              style={{
                color: clr.contrastColor,
              }}
              onClick={() => selectCurrentClr(clr.id)}
              tooltip="true"
              tooltip-content="Color picker"
              tooltip-position="bottom"
            >
              <span className="icon-eye-dropper" />
            </button>
          </article>
        ))}
        <button
          className="group w-20 h-36 border border-primary-border rounded-xl bg-transparent"
          onClick={addClr}
        >
          <span className="icon-plus text-2xl" />
        </button>
      </div>
    </dialog>
  );
}
