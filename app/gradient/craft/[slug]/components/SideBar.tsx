import { Dispatch, SetStateAction } from "react";

type Props = {
  setGradientTypeOpen: Dispatch<SetStateAction<boolean>>;
  setAngleOpen: Dispatch<SetStateAction<boolean>>;
};

export default function SideBar({ setGradientTypeOpen, setAngleOpen }: Props) {
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
            tooltip="true"
            tooltip-content="Palette"
            tooltip-position="left"
          >
            <span className="icon-palette text-2xl" />
          </button>
        </li>
        <li>
          <button
            className="flex py-3 px-2 rounded-xl bg-transparent border-none text-secondary secondary-hover transition duration-300"
            onClick={() => setAngleOpen(true)}
            tooltip="true"
            tooltip-content="Angle"
            tooltip-position="left"
          >
            <span className="icon-angle text-2xl" />
          </button>
        </li>
      </ul>
    </aside>
  );
}
