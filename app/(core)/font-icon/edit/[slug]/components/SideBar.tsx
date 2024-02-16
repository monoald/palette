type Props = {
  toggleIconsColor: () => void;
  uploadIcons: (e: React.ChangeEvent<HTMLInputElement>) => void;
  updateFontIcon: () => Promise<void>;
  downloadFontIcons: () => Promise<void>;
  downloadSvgIcons: () => Promise<void>;
  unsaveIcons: () => Promise<void>;
};

export default function SideBar({
  toggleIconsColor,
  uploadIcons,
  updateFontIcon,
  downloadFontIcons,
  downloadSvgIcons,
  unsaveIcons,
}: Props) {
  return (
    <aside className="fixed top-1/2 -translate-y-1/2 flex items-center select-none z-10">
      <ul className="relative w-10 py-4 h-fit flex flex-col justify-center items-center gap-3 rounded-full border border-primary-border list-none ">
        <li>
          <button
            className="flex py-3 px-2 rounded-xl bg-transparent border-none text-secondary secondary-hover transition duration-300"
            onClick={toggleIconsColor}
            tooltip="true"
            tooltip-content="Update icons color"
            tooltip-position="left"
          >
            <span className="icon-palette text-2xl" />
          </button>
        </li>
        <li>
          <div
            className="relative flex py-3 px-2 rounded-xl bg-transparent border-none text-secondary secondary-hover transition duration-300"
            tooltip="true"
            tooltip-content="Upload icons"
            tooltip-position="left"
          >
            <span className="icon-upload text-2xl" />
            <input
              type="file"
              name="upload-icons"
              className="absolute inset-0 opacity-0"
              onChange={uploadIcons}
              accept=".svg"
              multiple
            />
          </div>
        </li>
        <li>
          <button
            className="flex py-3 px-2 rounded-xl bg-transparent border-none text-secondary secondary-hover transition duration-300"
            onClick={downloadFontIcons}
            tooltip="true"
            tooltip-content="Download fonts"
            tooltip-position="left"
          >
            <span className="icon-font text-2xl" />
          </button>
        </li>
        <li>
          <button
            className="flex py-3 px-2 rounded-xl bg-transparent border-none text-secondary secondary-hover transition duration-300"
            onClick={downloadSvgIcons}
            tooltip="true"
            tooltip-content="Download icons"
            tooltip-position="left"
          >
            <span className="icon-download text-2xl" />
          </button>
        </li>
        <li>
          <button
            className="flex py-3 px-2 rounded-xl bg-transparent border-none text-secondary secondary-hover transition duration-300"
            onClick={updateFontIcon}
            tooltip="true"
            tooltip-content="Save changes"
            tooltip-position="left"
          >
            <span className="icon-save text-2xl" />
          </button>
        </li>
        <li>
          <button
            className="flex py-3 px-2 rounded-xl bg-transparent border-none text-secondary secondary-hover transition duration-300"
            onClick={unsaveIcons}
            tooltip="true"
            tooltip-content="Unsave font icon"
            tooltip-position="left"
          >
            <span className="icon-heart-filled text-2xl" />
          </button>
        </li>
      </ul>
    </aside>
  );
}
