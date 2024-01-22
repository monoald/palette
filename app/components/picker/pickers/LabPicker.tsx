interface Props {
  clr: Color;
}

export function LabPicker({ clr }: Props) {
  return (
    <>
      <div className="flex justify-evenly text-center">
        <div>
          <p>l</p>
          <div className="w-10 h-8 flex items-center justify-center border border-primary-border rounded-lg bg-transparent text-center text-sm">
            <p>{clr?.formats.lab?.l}</p>
          </div>
        </div>

        <div>
          <p>a</p>
          <div className="w-10 h-8 flex items-center justify-center border border-primary-border rounded-lg bg-transparent text-center text-sm">
            <p>{clr?.formats.lab?.a}</p>
          </div>
        </div>

        <div>
          <p>b</p>
          <div className="w-10 h-8 flex items-center justify-center border border-primary-border rounded-lg bg-transparent text-center text-sm">
            <p>{clr?.formats.lab?.b}</p>
          </div>
        </div>
      </div>

      <div className="mx-auto flex flex-col items-center justify-center gap-1 text-[#c7cc3e]">
        <span className="icon-warning" />
        <p>Read Only</p>
      </div>
    </>
  );
}
