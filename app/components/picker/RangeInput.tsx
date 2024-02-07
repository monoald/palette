import { dispatch } from "@/app/(core)/hooks/useStateHandler";

export interface BackgroundColor {
  start: string;
  end: string;
}

type Props = {
  min: number;
  max: number;
  value: number;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isHue?: boolean;
  thumbColor?: string;
  backgroundColor?: string;
  id: string;
};

export function RangeInput({
  id,
  min,
  max,
  value,
  onChange,
  isHue = false,
  thumbColor,
  backgroundColor,
}: Props) {
  const updateUrl = () => {
    dispatch("custom:updateHistoryFromPicker");
  };

  return (
    <input
      id={id}
      className={`w-full h-3 border-none rounded-full appearance-none ${
        isHue ? "hue-input" : "color-input"
      }`}
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={onChange}
      style={
        {
          "--thumb-bg": isHue ? `hsl(${value}, 100%, 50%)` : thumbColor,
          "--bg-color": isHue
            ? ""
            : `-webkit-linear-gradient(left, ${backgroundColor}`,
        } as React.CSSProperties
      }
      onMouseUp={updateUrl}
    />
  );
}
