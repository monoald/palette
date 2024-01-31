"use client";

import { replacePath, setParam } from "@/app/utils/urlState";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AngleInput } from "./components/AngleInput";
import SideBar from "./components/SideBar";
import OptionBar from "@/app/components/OptionBar";
import { CirclePosition } from "./components/CirclePosition";
import { ChangePalette } from "./components/ChangePalette";
import { Picker } from "@/app/components/picker/Picker";
import useStateHandler from "@/app/hooks/useStateHandler";
import {
  handleAddColor,
  handleChangeGradient,
  handleChangeStyles,
  handleCreateGradientFromUrl,
  handleCreateStyles,
  handleRemoveColor,
  handleUpdateAngle,
  handleUpdateCirclePosition,
  handleUpdateColor,
  handleUpdateColorStyle,
  handleUpdateStop,
  handleUpdateType,
} from "./handlers";
import { CustomRange } from "./components/CustomRange";
import { useKeyDown } from "@/app/hooks/useKeyDown";

export type GradientStyles = {
  type: string;
  colors: string;
  end: string;
};

const gradientTypes = ["horizontal", "vertical", "circle", "conic"];

export default function Page({ params }: { params: { slug: string } }) {
  const searchParams = useSearchParams();

  const [gradient, setGradient] = useState<Gradient>();
  const [gradientStyle, setGradientStyle] = useState<{
    type: string;
    colors: string;
    end: string;
  }>();

  useEffect(() => {
    const newGradient = handleCreateGradientFromUrl(
      params.slug,
      searchParams as ReadonlyURLSearchParams
    );

    setGradient(newGradient);
    setGradientStyle(
      handleCreateStyles(searchParams as ReadonlyURLSearchParams, newGradient)
    );
  }, [params.slug, searchParams]);

  const changeGradient = () => {
    setGradient((prev) => {
      if (prev) {
        const newGradient = handleChangeGradient(prev.history);

        setGradientStyle(handleChangeStyles(newGradient));

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
          if (prev) return { ...prev, colors: clrsStyle };
        });
        return { ...prev, clrs: newClrs };
      }
    });
  };

  const updateHistoryFromPickerHandler = () => {
    setGradient((prev) => {
      if (prev) {
        const newUrl = prev.clrs
          .map((clr) => clr.hex.replace("#", ""))
          .join("-") as string;

        replacePath(newUrl);
        return {
          ...prev,
          history: {
            data: [...prev.history.data, newUrl + window.location.search],
            current: prev.history.current + 1,
          },
        };
      }
    });
  };

  useEffect(() => {
    console.log(gradient?.history);
  }, [gradient?.history]);

  // PALETTE
  useStateHandler(
    [updatePaletteFromPickerHandler, updateHistoryFromPickerHandler],
    ["custom:updatePaletteFromPicker", "custom:updateHistoryFromPicker"]
  );

  // OPTIONS
  const [gradientTypeOpen, setGradientTypeOpen] = useState(false);

  const selectGradientType = (selected: string) => {
    setGradient((prev) => {
      if (prev) {
        let angle = prev.angle;

        if (selected === "horizontal") {
          angle = 90;
        } else if (selected === "vertical") {
          angle = 0;
        }

        let newUrl = "";
        gradient?.clrs.forEach((clr, i) => {
          if (i !== 0) {
            newUrl += "-";
          }

          newUrl += clr.hex.replace("#", "");
        });

        return {
          ...prev,
          type: selected,
          angle,
          history: {
            data: [...prev.history.data, newUrl + `?type=${selected}`],
            current: prev.history.current + 1,
          },
        };
      }
    });
    const newType = handleUpdateType(selected);
    setGradientStyle((prev) => {
      if (prev) return { ...prev, type: newType };
    });
  };

  // ANGLE
  const updateAngle = (angle: number) => {
    setGradient((prev) => {
      if (prev) return { ...prev, angle };
    });
    setGradientStyle((prev) => {
      if (prev)
        return {
          ...prev,
          type: handleUpdateAngle(angle),
        };
    });
  };

  const updateHistoryOnAngleChange = (angle: number) => {
    setGradient((prev) => {
      if (prev) {
        const urlArr =
          prev.history.data[prev.history.data.length - 1].split("?");

        const param = new URLSearchParams(urlArr[1]);
        param.set("angle", `${angle}`);
        param.delete("type");

        return {
          ...prev,
          history: {
            data: [...prev.history.data, urlArr[0] + "?" + param.toString()],
            current: prev.history.current + 1,
          },
        };
      }
    });
  };

  // CIRCLE POSITION
  const updateCirclePosition = (position: { x: number; y: number }) => {
    setGradient((prev) => {
      if (prev) return { ...prev, circlePosition: position };
    });
    setGradientStyle((prev) => {
      if (prev)
        return {
          ...prev,
          type: handleUpdateCirclePosition(position),
        };
    });
  };

  const updateHistoryOnCirclePositionChange = (position: {
    x: number;
    y: number;
  }) => {
    setGradient((prev) => {
      if (prev) {
        const urlArr =
          prev.history.data[prev.history.data.length - 1].split("?");

        const param = new URLSearchParams(urlArr[1]);
        param.set("circle-x", `${position.x}`);
        param.set("circle-y", `${position.y}`);
        param.delete("type");

        return {
          ...prev,
          history: {
            data: [...prev.history.data, urlArr[0] + "?" + param.toString()],
            current: prev.history.current + 1,
          },
        };
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
    const newClrs = handleUpdateStop(
      gradient?.clrs as GradientColor[],
      id,
      stop
    );
    setGradient((prev) => {
      if (prev) return { ...prev, clrs: newClrs };
    });
    setGradientStyle((prev) => {
      if (prev) return { ...prev, colors: handleUpdateColorStyle(newClrs) };
    });
  };

  const updateHistoryOnStopsChange = (stops: string) => {
    setGradient((prev) => {
      if (prev) {
        const urlArr =
          prev.history.data[prev.history.data.length - 1].split("?");

        const param = new URLSearchParams(urlArr[1]);
        param.set("stops", stops);

        return {
          ...prev,
          history: {
            data: [...prev.history.data, urlArr[0] + "?" + param.toString()],
            current: prev.history.current + 1,
          },
        };
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
          if (prev) return { ...prev, colors: clrsStyle };
        });

        const newUrl = newClrs
          .map((clr) => clr.hex.replace("#", ""))
          .join("-") as string;
        replacePath(newUrl);
        setParam("stops", newClrs.map((clr) => clr.stop).join("-"));

        return { ...prev, clrs: newClrs };
      }
    });
  };

  const addClr = () => {
    setGradient((prev) => {
      if (prev) {
        const newClrs = handleAddColor(prev.clrs);
        const clrsStyle = handleUpdateColorStyle(newClrs as GradientColor[]);
        setGradientStyle((prev) => {
          if (prev) return { ...prev, colors: clrsStyle };
        });

        const newUrl = newClrs
          .map((clr) => clr.hex.replace("#", ""))
          .join("-") as string;
        replacePath(newUrl);
        setParam("stops", newClrs.map((clr) => clr.stop).join("-"));

        return { ...prev, clrs: newClrs };
      }
    });
  };

  return (
    <div className="relative flex flex-col-reverse h-[calc(100vh-80px)] gap-8 p-8 bg-main md:flex-row">
      {gradient && gradientStyle && (
        <>
          <SideBar
            setGradientTypeOpen={setGradientTypeOpen}
            setColorsOpen={setColorsOpen}
            setAngleOpen={setAngleOpen}
            setCirclePositionOpen={setCirclePositionOpen}
            changeGradient={changeGradient}
          />
          <OptionBar
            open={gradientTypeOpen}
            setOpen={setGradientTypeOpen}
            options={gradientTypes}
            current={gradient.type as string}
            selectOption={selectGradientType}
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
              updateHistoryOnAngleChange={updateHistoryOnAngleChange}
            />
          )}
          {circlePositionOpen && (
            <CirclePosition
              updateCirclePosition={updateCirclePosition}
              circlePosition={gradient.circlePosition}
              setCirclePositionOpen={setCirclePositionOpen}
              updateHistoryOnCirclePositionChange={
                updateHistoryOnCirclePositionChange
              }
            />
          )}
          <Picker
            clr={gradient.clrs.find((clr) => clr.id === gradient.currentColor)}
            closePicker={closePicker}
          />
          <main className="w-full h-full flex flex-col gap-8 text-sm">
            <div className="w-full h-full flex border border-primary-border rounded-2xl overflow-hidden">
              <div
                className="relative w-full h-full"
                style={{
                  background: `${gradientStyle?.type}${gradientStyle?.colors}${gradientStyle?.end}`,
                }}
              ></div>
            </div>
            <CustomRange
              styleClrs={gradientStyle.colors}
              clrs={gradient.clrs}
              updateStop={updateStop}
              updateHistoryOnStopsChange={updateHistoryOnStopsChange}
            />
          </main>
        </>
      )}
    </div>
  );
}
