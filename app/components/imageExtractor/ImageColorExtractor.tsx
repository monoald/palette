import { useState } from "react";

import { ImageCanvas } from "./ImageCanvas";
import { ExtractorForm } from "./ExtractorForm";

type Props = {
  toggleImg: () => void;
};

export function ImageColorExtractor({ toggleImg }: Props) {
  const [url, setUrl] = useState<string>("");

  return (
    <dialog className="absolute top-1/2 -translate-y-1/2 w-fit h-fit p-7 flex flex-col gap-6 border border-secondary-border z-[1] text-secondary rounded-2xl backdrop-blur-md bg-transparent-main transition-all">
      <button className="secondary-button w-8 h-8 ml-auto" onClick={toggleImg}>
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

      {url === "" ? (
        <ExtractorForm setUrl={setUrl} />
      ) : (
        <ImageCanvas url={url} setUrl={setUrl} />
      )}
    </dialog>
  );
}
