export default function SideBar() {
  return (
    <aside className="h-fit flex flex-col items-center select-none md:flex-row md:h-full">
      <ul className="relative w-fit h-10 px-4 flex flex-row justify-center items-center gap-3 rounded-full border border-primary-border list-none md:flex-col md:w-10 md:h-fit md:px-0 md:py-4">
        <li>
          <button
            className="flex py-3 px-2 rounded-xl bg-transparent border-none text-secondary secondary-hover transition duration-300"
            // onClick={() => setColorsOpen(true)}
            tooltip="true"
            tooltip-content="Icons Color"
            tooltip-position="left"
          >
            <span className="icon-palette text-2xl" />
          </button>
        </li>
        <li>
          <button
            className="flex py-3 px-2 rounded-xl bg-transparent border-none text-secondary secondary-hover transition duration-300"
            // onClick={() => setColorsOpen(true)}
            tooltip="true"
            tooltip-content="Icons Color"
            tooltip-position="left"
          >
            <span className="icon-upload text-2xl" />
          </button>
        </li>
        <li>
          <button
            className="flex py-3 px-2 rounded-xl bg-transparent border-none text-secondary secondary-hover transition duration-300"
            // onClick={() => setColorsOpen(true)}
            tooltip="true"
            tooltip-content="Icons Color"
            tooltip-position="left"
          >
            <span className="icon-font text-2xl" />
          </button>
        </li>
        <li>
          <button
            className="flex py-3 px-2 rounded-xl bg-transparent border-none text-secondary secondary-hover transition duration-300"
            // onClick={() => setColorsOpen(true)}
            tooltip="true"
            tooltip-content="Icons Color"
            tooltip-position="left"
          >
            <span className="icon-download text-2xl" />
          </button>
        </li>
        <li>
          <button
            className="flex py-3 px-2 rounded-xl bg-transparent border-none text-secondary secondary-hover transition duration-300"
            // onClick={() => setColorsOpen(true)}
            tooltip="true"
            tooltip-content="Icons Color"
            tooltip-position="left"
          >
            <span className="icon-save text-2xl" />
          </button>
        </li>
        <li>
          <button
            className="flex py-3 px-2 rounded-xl bg-transparent border-none text-secondary secondary-hover transition duration-300"
            // onClick={() => setColorsOpen(true)}
            tooltip="true"
            tooltip-content="Icons Color"
            tooltip-position="left"
          >
            <span className="icon-heart text-2xl" />
          </button>
        </li>
      </ul>
    </aside>
  );
}
