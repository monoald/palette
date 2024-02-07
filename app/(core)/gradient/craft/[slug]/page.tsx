"use client";

import { replacePath } from "@/app/utils/urlState";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AngleInput } from "./components/AngleInput";
import SideBar from "./components/SideBar";
import OptionBar from "@/app/components/OptionBar";
import { CirclePosition } from "./components/CirclePosition";
import { ChangePalette } from "./components/ChangePalette";
import { Picker } from "@/app/components/picker/Picker";
import useStateHandler from "@/app/(core)/hooks/useStateHandler";
import {
  handleAddColor,
  handleURLToGradient,
  handleRemoveColor,
  handleUpdateColor,
  handleUpdateColorStyle,
  handleCraftGradient,
  handleUpdateProperty,
  handleUpdateHistory,
} from "./handlers";
import { CustomRange } from "./components/CustomRange";
import { useKeyDown } from "@/app/(core)/hooks/useKeyDown";

const gradientTypes = ["horizontal", "vertical", "circle", "conic"];
const gradientAnimations = ["horizontal", "vertical", "spin", "none"];

export default function Page({ params }: { params: { slug: string } }) {
  const searchParams = useSearchParams();

  const [gradient, setGradient] = useState<Gradient>();
  const [gradientStyle, setGradientStyle] = useState<GradientStyle>();

  useEffect(() => {
    const [newGradient, newStyle] = handleURLToGradient(
      params.slug,
      searchParams as ReadonlyURLSearchParams
    );

    setGradient(newGradient);
    setGradientStyle(newStyle);
  }, [params.slug, searchParams]);

  const changeGradient = () => {
    setGradient((prev) => {
      if (prev) {
        const [newGradient, newStyle] = handleCraftGradient(prev.history);

        setGradientStyle(newStyle);
        return newGradient;
      }
    });
  };

  useKeyDown(() => {
    changeGradient();
  }, ["Space"]);

  const updatePaletteFromPickerHandler = (e: Event) => {
    const event = e as CustomEvent;
    setGradient((prev) => {
      if (prev) {
        const newClrs = handleUpdateColor(
          event.detail.id,
          event.detail.clr,
          event.detail.format,
          prev.clrs
        );

        // updateStyles
        const clrsStyle = handleUpdateColorStyle(newClrs as GradientColor[]);
        setGradientStyle((prev) => {
          if (prev) return { ...prev, clrs: clrsStyle };
        });
        return { ...prev, clrs: newClrs };
      }
    });
  };

  const updateHistoryFromPickerHandler = (e: Event) => {
    const event = e as CustomEvent;
    const updatePath = event?.detail?.updatePath ?? true;
    setGradient((prev) => {
      if (prev) {
        const history = handleUpdateHistory(prev, updatePath);

        return {
          ...prev,
          history,
        };
      }
    });
  };

  // PALETTE
  useStateHandler(
    [updatePaletteFromPickerHandler, updateHistoryFromPickerHandler],
    ["custom:updatePaletteFromPicker", "custom:updateHistoryFromPicker"]
  );

  // OPTIONS
  const [gradientTypeOpen, setGradientTypeOpen] = useState(false);
  const [gradientAnimationOpen, setGradientAnimationOpen] = useState(false);

  const selectGradientType = (selected: string) => {
    setGradient((prev) => {
      if (prev) {
        const [newGradient, newStyle] = handleUpdateProperty(
          "type",
          selected,
          prev
        );

        setGradientStyle(newStyle);

        const history = handleUpdateHistory(newGradient);

        return { ...newGradient, history };
      }
    });
  };
  const selectGradientAnimation = (selected: string) => {
    setGradient((prev) => {
      if (prev) {
        const history = handleUpdateHistory({ ...prev, animation: selected });
        return { ...prev, animation: selected, history };
      }
    });
  };

  // ANGLE
  const updateAngle = (angle: number) => {
    setGradient((prev) => {
      if (prev) {
        const [newGradient, newStyle] = handleUpdateProperty(
          "angle",
          angle,
          prev
        );

        setGradientStyle(newStyle);
        return newGradient;
      }
    });
  };

  // CIRCLE POSITION
  const updateCirclePosition = (position: { x: number; y: number }) => {
    setGradient((prev) => {
      if (prev) {
        const [newGradient, newStyle] = handleUpdateProperty(
          "position",
          position,
          prev
        );

        setGradientStyle(newStyle);
        return newGradient;
      }
    });
  };

  // MODALS
  const [angleOpen, setAngleOpen] = useState(false);
  const [circlePositionOpen, setCirclePositionOpen] = useState(false);
  const [colorsOpen, setColorsOpen] = useState(false);

  const closePicker = () => {
    setGradient((prev) => {
      if (prev) return { ...prev, currentColor: undefined };
    });
  };

  const selectCurrentClr = (id: string | undefined) => {
    setGradient((prev) => {
      if (prev) return { ...prev, currentColor: id };
    });
  };

  // STOPS
  const updateStop = (id: string, stop: number) => {
    setGradient((prev) => {
      if (prev) {
        const [newGradient, newStyle] = handleUpdateProperty(
          "stops",
          { id, stop },
          prev
        );

        setGradientStyle(newStyle);
        return newGradient;
      }
    });
  };

  // COLOR
  const removeClr = (id: string) => {
    setGradient((prev) => {
      if (prev) {
        const newClrs = handleRemoveColor(id, prev.clrs);
        const clrsStyle = handleUpdateColorStyle(newClrs as GradientColor[]);
        setGradientStyle((prev) => {
          if (prev) return { ...prev, clrs: clrsStyle };
        });

        const newUrl = newClrs
          .map((clr) => clr.hex.replace("#", ""))
          .join("-") as string;
        replacePath(newUrl);
        const history = handleUpdateHistory({ ...prev, clrs: newClrs }, true);

        return { ...prev, clrs: newClrs, history };
      }
    });
  };

  const addClr = () => {
    setGradient((prev) => {
      if (prev) {
        const newClrs = handleAddColor(prev.clrs);
        const clrsStyle = handleUpdateColorStyle(newClrs as GradientColor[]);
        setGradientStyle((prev) => {
          if (prev) return { ...prev, clrs: clrsStyle };
        });

        const newUrl = newClrs
          .map((clr) => clr.hex.replace("#", ""))
          .join("-") as string;
        replacePath(newUrl);
        const history = handleUpdateHistory({ ...prev, clrs: newClrs }, true);

        return { ...prev, clrs: newClrs, history };
      }
    });
  };

  // HISTORY MANAGEMENT
  const historyBack = () => {
    setGradient((prev) => {
      if (prev) {
        const current = prev.history.current - 1;

        const url = prev.history.data[current].split("?");
        const [newGradient, newStyle] = handleURLToGradient(
          url[0],
          new URLSearchParams(url[1])
        );

        replacePath(url[0]);
        history.replaceState({}, "", "?" + url[1]);

        setGradientStyle(newStyle);
        return {
          ...newGradient,
          history: {
            ...prev.history,
            current,
          },
        };
      }
    });
  };

  const historyForward = () => {
    setGradient((prev) => {
      if (prev) {
        const current = prev.history.current + 1;

        const url = prev.history.data[current].split("?");
        const [newGradient, newStyle] = handleURLToGradient(
          url[0],
          new URLSearchParams(url[1])
        );

        replacePath(url[0]);
        history.replaceState({}, "", "?" + url[1]);

        setGradientStyle(newStyle);
        return {
          ...newGradient,
          history: {
            ...prev.history,
            current,
          },
        };
      }
    });
  };

  return (
    <div className="relative flex flex-col-reverse h-[calc(100vh-80px)] gap-8 p-8 bg-main md:flex-row">
      {gradient && gradientStyle && (
        <>
          <SideBar
            gradientStyle={gradientStyle}
            setGradientTypeOpen={setGradientTypeOpen}
            setGradientAnimationOpen={setGradientAnimationOpen}
            setColorsOpen={setColorsOpen}
            setAngleOpen={setAngleOpen}
            setCirclePositionOpen={setCirclePositionOpen}
            changeGradient={changeGradient}
            gradientHistory={gradient.history}
            historyBack={historyBack}
            historyForward={historyForward}
            animation={gradient.animation}
          />
          <OptionBar
            open={gradientTypeOpen}
            setOpen={setGradientTypeOpen}
            options={gradientTypes}
            current={gradient.type as string}
            selectOption={selectGradientType}
          />
          <OptionBar
            open={gradientAnimationOpen}
            setOpen={setGradientAnimationOpen}
            options={gradientAnimations}
            current={gradient.animation as string}
            selectOption={selectGradientAnimation}
          />
          {colorsOpen && (
            <ChangePalette
              clrs={gradient.clrs}
              selectCurrentClr={selectCurrentClr}
              removeClr={removeClr}
              addClr={addClr}
              setColorsOpen={setColorsOpen}
            />
          )}
          {angleOpen && (
            <AngleInput
              angle={gradient.angle}
              updateAngle={updateAngle}
              setAngleOpen={setAngleOpen}
            />
          )}
          {circlePositionOpen && (
            <CirclePosition
              updateCirclePosition={updateCirclePosition}
              circlePosition={gradient.circlePosition}
              setCirclePositionOpen={setCirclePositionOpen}
            />
          )}
          <Picker
            clr={gradient.clrs.find((clr) => clr.id === gradient.currentColor)}
            closePicker={closePicker}
          />
          <main className="w-full h-full flex flex-col gap-8 text-sm">
            <div className="relative w-full h-full flex items-center border border-primary-border rounded-3xl overflow-hidden">
              <div
                className="absolute"
                style={{
                  inset: gradient.animation === "spin" ? "-90%" : "0%",
                  backgroundSize:
                    gradient.animation === "vertical"
                      ? "100% 150%"
                      : gradient.animation === "horizontal"
                      ? "150% 100%"
                      : gradient.animation === "circle" ||
                        gradient.animation === "conic"
                      ? "100%"
                      : undefined,
                  backgroundImage: `${gradientStyle.type}${gradientStyle.clrs}${gradientStyle.end}`,
                  animation:
                    gradient.animation === "none"
                      ? undefined
                      : `${gradient.animation} 5s linear infinite`,
                }}
              ></div>
            </div>
            <CustomRange
              styleClrs={gradientStyle.clrs}
              clrs={gradient.clrs}
              updateStop={updateStop}
            />
          </main>
        </>
      )}
    </div>
  );
}
