import { useState } from "react";
import { Select } from "../Select";
import { HexadecimalPicker } from "./pickers/HexadecimalPicker";

import { Canvas } from "./Canvas";
import { CmykPicker } from "./pickers/CmykPicker";
import { HsbPicker } from "./pickers/HsbPicker";
import { HslPicker } from "./pickers/HslPicker";
import { LabPicker } from "./pickers/LabPicker";
import { RgbPicker } from "./pickers/RgbPicker";
import { XyzPicker } from "./pickers/XyzPicker";

type Props = {
  clr: Color | undefined;
  closePicker: () => void;
};

const options = ["hex", "cmyk", "hsb", "hsl", "rgb", "lab", "xyz"];

export function Picker({ clr, closePicker }: Props) {
  const [picker, setPicker] = useState("hex");

  return (
    <>
      {clr && (
        <dialog className="w-fit h-fit p-7 mt-24 flex flex-col gap-3 border border-secondary-border z-[1] text-secondary rounded-2xl backdrop-blur-md bg-transparent-main transition-all">
          <div className="grid grid-cols-[1fr_auto] gap-4">
            <Select options={options} setSelect={setPicker} current={picker} />
            <button className="secondary-button w-8 h-8" onClick={closePicker}>
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
          </div>
          <div className="w-[222px] flex flex-col gap-3">
            {picker === "hex" && <HexadecimalPicker clr={clr} />}
            {picker === "cmyk" && <CmykPicker clr={clr} />}
            {picker === "hsb" && <HsbPicker clr={clr} />}
            {picker === "hsl" && <HslPicker clr={clr} />}
            {picker === "rgb" && <RgbPicker clr={clr} />}
            {picker === "lab" && <LabPicker clr={clr} />}
            {picker === "xyz" && <XyzPicker clr={clr} />}
          </div>
          <Canvas clr={clr} />
        </dialog>
      )}
    </>
  );
}
