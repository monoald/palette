import { Dispatch, SetStateAction } from "react";
import { Options } from "../data/options";

type Props = {
  options: Options;
  setOption: Dispatch<SetStateAction<string | undefined>>;
  current: string | null;
};

function OptionBar({ options, setOption, current }: Props) {
  const handleSelectOption = (selected: string) => {
    const paletteChange = new CustomEvent("custom:paletteChange", {
      detail: {
        event: options?.name,
        paletteType: selected,
        colorBlind: selected,
      },
    });

    window.dispatchEvent(paletteChange);
  };

  return (
    <div
      className={`absolute ml-8 left-0 top-0 w-64 h-full py-8 z-[1] [animation-fill-mode:forwards] ${
        options ? "animate-slide-left" : "animate-slide-right"
      }`}
    >
      <aside className="w-full h-full p-7 border border-secondary-border rounded-2xl flex flex-col gap-2 backdrop-blur-2xl bg-transparent-main text-secondary text-sm">
        <ul className="h-full">
          {options?.options.map((option) => (
            <li key={option}>
              <button
                className={`group relative w-full h-full py-2 text-start capitalize primary-hover ${
                  current === option ? "primary-active" : ""
                }`}
                onClick={() => handleSelectOption(option)}
              >
                <span className="h-full relative after:absolute after:left-0 after:top-[100%] after:w-0 after:h-[2px] after:bg-tertiary group-hover:after:w-full after:transition-all">
                  {option}
                </span>
              </button>
            </li>
          ))}
        </ul>

        <button className="primary-button" onClick={() => setOption(undefined)}>
          <div>
            <span>Close</span>
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
      </aside>
    </div>
  );
}

export default OptionBar;
