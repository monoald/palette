import { Dispatch, SetStateAction, useState } from "react";

type Props1 = {
  options: string[];
  setSelect: Dispatch<SetStateAction<string>>;
  current: string;
};

export function Select({ options, setSelect, current }: Props1) {
  const [open, setOpen] = useState(false);

  const toggleSelect = () => {
    setOpen(!open);
  };

  const selectOption = (opt: string) => {
    setSelect(opt);
    setOpen(!open);
  };
  return (
    <div className="relative w-full text-sm">
      <button
        className="w-full h-8 px-5 flex justify-between items-center bg-transparent appearance-none border border-primary-border rounded-xl focus-visible:outline-none text-center"
        role="combobox"
        aria-labelledby="select button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls="select-dropdown"
        onClick={toggleSelect}
      >
        {current}
        <span className="icon-chevron-down" />
      </button>
      <ul
        id="select-dropdown"
        role="listbox"
        className={`absolute left-0 top-full w-full border-secondary-border rounded-xl bg-transparent-main backdrop-blur-md overflow-y-scroll transition-all z-[1] ${
          open ? "h-36 border" : "h-0"
        }`}
      >
        {options.map((opt) => (
          <li
            key={opt}
            className="w-full"
            role="option"
            aria-selected={opt === current}
          >
            <button
              className="w-full px-5 py-[6px] hover:shadow-[inset_0_3px_12px_#34dfff4d,inset_0_-2px_4px_#d7faff4d] hover:bg-btn-primary"
              onClick={() => selectOption(opt)}
            >
              {opt}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
