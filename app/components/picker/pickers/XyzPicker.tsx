interface Props {
  clr: { id: string; hex: string; formats?: Formats };
}

export const XyzPicker = ({ clr }: Props) => {
  return (
    <>
      <div className="flex justify-evenly text-center">
        <div>
          <p>x</p>
          <div className="w-10 h-8 flex items-center justify-center border border-primary-border rounded-lg bg-transparent text-center text-sm">
            <p>{clr?.formats?.xyz?.x}</p>
          </div>
        </div>

        <div>
          <p>y</p>
          <div className="w-10 h-8 flex items-center justify-center border border-primary-border rounded-lg bg-transparent text-center text-sm">
            <p>{clr?.formats?.xyz?.y}</p>
          </div>
        </div>

        <div>
          <p>z</p>
          <div className="w-10 h-8 flex items-center justify-center border border-primary-border rounded-lg bg-transparent text-center text-sm">
            <p>{clr?.formats?.xyz?.z}</p>
          </div>
        </div>
      </div>

      <div className="mx-auto flex flex-col items-center justify-center gap-1 text-[#c7cc3e]">
        <span className="icon-warning" />
        <p>Read Only</p>
      </div>
    </>
  );
};
