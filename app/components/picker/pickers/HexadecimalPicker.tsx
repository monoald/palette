import { useEffect, useState } from "react";

import { RangeInput } from "../RangeInput";
import { dispatch } from "@/app/hooks/useStateHandler";

type Props = {
  clr: Color;
};

export function HexadecimalPicker({ clr }: Props) {
  const [hexColor, setHexColor] = useState(clr.hex);

  useEffect(() => {
    setHexColor(clr.hex);
  }, [clr]);

  function handleHueChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (clr) {
      const target = event.target as HTMLInputElement;
      const hueValue = +target.value;
      dispatch("custom:updatePaletteFromPicker", {
        id: clr.id,
        clr: {
          h: hueValue,
          s: clr?.formats.hsv?.s as number,
          v: clr?.formats.hsv?.v as number,
        },
        format: "hsv",
      });
    }
  }

  const handleHexChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = event.target.value;

    // Ensure the first character is '#'
    if (inputValue.length === 0 || inputValue[0] !== "#") {
      inputValue = "#" + inputValue;
    }

    setHexColor(inputValue);

    if (inputValue.length === 7) {
      dispatch("custom:updatePaletteFromPicker", {
        id: clr.id,
        clr: inputValue,
        format: "hex",
      });
      dispatch("custom:updateHistoryFromPicker");
    }
  };

  return (
    <>
      <input
        className="w-full px-3 text-center uppercase"
        type="text"
        value={hexColor}
        onChange={handleHexChange}
        maxLength={7}
      />

      <RangeInput
        id="hue"
        min={0}
        max={360}
        value={clr?.formats.hsv?.h as number}
        onChange={handleHueChange}
        isHue
      />
    </>
  );
}
