type Props = {
  iconsColorChanged: (e: React.ChangeEvent<HTMLInputElement>) => void;
  toggleIconsColor: () => void;
  iconsColor: string;
};

export default function UpdateIconsColor({
  iconsColorChanged,
  toggleIconsColor,
  iconsColor,
}: Props) {
  return (
    <dialog className="absolute top-1/2 -translate-y-1/2 w-fit h-fit p-7 flex flex-col gap-8 border border-secondary-border z-[1] text-secondary rounded-2xl backdrop-blur-md bg-transparent-main transition-all">
      <button
        className="secondary-button right-7 top-7 w-8 h-8"
        style={{ position: "absolute" }}
        onClick={toggleIconsColor}
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

      <label htmlFor="icons-color" className="text-lg font-semibold pt-[3px]">
        Color
      </label>
      <input
        type="text"
        value={iconsColor}
        className="text-center text-base"
        onChange={iconsColorChanged}
      />
    </dialog>
  );
}
