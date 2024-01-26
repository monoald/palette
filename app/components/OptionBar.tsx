import { Dispatch, SetStateAction, useRef } from "react";

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  options: string[];
  current: string;

  selectOption: (option: string) => void;
};

function OptionBar({ open, options, current, selectOption, setOpen }: Props) {
  const optionsRef = useRef<HTMLDivElement>(null);

  const closeOptionBar = () => {
    const element = optionsRef.current as HTMLElement;
    element.classList.add("animate-slide-right");

    setTimeout(() => {
      setOpen(!open);
    }, 3000);
  };

  if (open) {
    return (
      <div
        ref={optionsRef}
        className="absolute ml-8 -left-[320px] top-0 w-64 h-full py-8 z-[1] [animation-fill-mode:forwards] animate-slide-left"
      >
        <aside className="w-full h-full p-7 border border-secondary-border rounded-2xl flex flex-col gap-2 backdrop-blur-2xl bg-transparent-main text-secondary text-sm">
          <ul className="h-full">
            {options.map((option) => (
              <li key={option}>
                <button
                  className={`group relative w-full h-full py-2 text-start capitalize primary-hover ${
                    current === option ? "primary-active" : ""
                  }`}
                  onClick={() => selectOption(option)}
                >
                  <span className="h-full relative after:absolute after:left-0 after:top-[100%] after:w-0 after:h-[2px] after:bg-tertiary group-hover:after:w-full after:transition-all">
                    {option}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <button className="primary-button mx-auto" onClick={closeOptionBar}>
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
}

export default OptionBar;
