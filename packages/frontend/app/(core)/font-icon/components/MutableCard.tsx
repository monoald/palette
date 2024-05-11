import Image from "next/image";
import { Icon, IconCollection } from "../craft/page";
import { Dispatch, SetStateAction, useState } from "react";
import { changeSvgColor } from "../utils/changeIconColor";
import { dispatch } from "../../hooks/useStateHandler";

type Props = {
  svg: Icon;
  setCollection: Dispatch<SetStateAction<IconCollection>>;
};

export function MutableCard({ svg, setCollection }: Props) {
  const [toggleSetup, setToggleSetup] = useState(false);

  const handleNameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const regex = /^[a-zA-Z0-9-_]+$/;
    let normalizedText = e.target.value.toLowerCase();
    if (regex.test(normalizedText) || normalizedText === "") {
      setCollection((prev) => {
        const newIcons = [...prev.icons];
        const iconIndex = newIcons.findIndex((ico) => ico.id === svg.id);
        const icon = newIcons[iconIndex];

        const iconUsedIndex = newIcons.findIndex((ico) => {
          if (ico.id !== svg.id) {
            return ico.name === e.target.value;
          }
        });

        if (iconUsedIndex !== -1) {
          dispatch("custom:updateMessage", {
            type: "warning",
            message: `Name ${e.target.value} already used`,
          });
          newIcons[iconUsedIndex].warning = true;
          if (icon) icon.warning = true;
        } else {
          newIcons.forEach((ico) => {
            ico.warning = false;
          });
        }

        if (icon) {
          icon.name = e.target.value;
        }

        return { ...prev, icons: newIcons };
      });
    }
  };

  const handleUnicodeChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCollection((prev) => {
      const newIcons = [...prev.icons];
      const icon = newIcons.find((ico) => ico.id === svg.id);

      const unicodeUsed = newIcons.find((ico) => {
        if (ico.id !== svg.id) {
          return ico.unicode === e.target.value;
        }
      });

      if (unicodeUsed !== undefined) {
        dispatch("custom:updateMessage", {
          type: "warning",
          message: `Unicode ${e.target.value} already used`,
        });
        unicodeUsed.warning = true;
        if (icon) icon.warning = true;
      } else {
        newIcons.forEach((ico) => {
          ico.warning = false;
        });
      }

      if (icon) {
        icon.unicode = e.target.value;
      }

      return { ...prev, icons: newIcons };
    });
  };

  const handleColorChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const regex = /^[a-zA-Z0-9#]+$/;
    let normalizedText = e.target.value.toLowerCase();
    if (regex.test(normalizedText) || normalizedText === "") {
      setCollection((prev) => {
        const newIcons = [...prev.icons];
        const icon = newIcons.find((ico) => ico.id === svg.id);

        if (icon) {
          icon.color = e.target.value;
          const color = e.target.value;
          icon.content = changeSvgColor(icon.content, color);
        }

        return { ...prev, icons: newIcons };
      });
    }
  };

  const handleIconRemoved = () => {
    setCollection((prev) => {
      const newIcons = [...prev.icons];
      const iconIndex = newIcons.findIndex((ico) => ico.id === svg.id);

      newIcons.splice(iconIndex, 1);

      return { ...prev, icons: newIcons };
    });
  };
  return (
    <article
      className={`relative p-5 border ${
        svg.warning ? "border-[#ec9d09]" : "border-primary-border"
      } rounded-2xl flex flex-col items-center gap-4`}
    >
      <Image
        className="icon__svg"
        width={36}
        height={36}
        src={`data:image/svg+xml;base64,${btoa(
          unescape(encodeURIComponent(svg.content))
        )}`}
        alt={`icon ${svg.name}`}
      />

      <div className="relative w-full px-2 border border-primary-border focus-within:border-white rounded-lg overflow-hidden after:absolute after:top-0 after:right-0 after:w-10 after:h-full after:block after:bg-[linear-gradient(90deg,rgba(0,0,0,0),#03050c)] after:pointer-events-none">
        <input
          className="w-full whitespace-nowrap overflow-hidden border-none text-center focus-visible:outline-none"
          type="text"
          value={svg.name}
          onChange={handleNameChanged}
        />
      </div>

      <button
        className="w-full h-[34px] py-1 border border-primary-border rounded-full"
        onClick={handleIconRemoved}
      >
        Remove
      </button>

      <button
        className="w-full h-4"
        onClick={() => setToggleSetup(!toggleSetup)}
      >
        <span className="icon-chevron-down text-xl" />
      </button>

      {toggleSetup && (
        <div
          className={`absolute top-[calc(100%-40px)] -left-[1px] w-[calc(100%+2px)] h-auto p-5 pt-0 flex flex-col gap-4 border border-t-0 ${
            svg.warning ? "border-[#ec9d09]" : "border-primary-border"
          } rounded-b-2xl transition-all bg-main z-10`}
        >
          <div className="w-full flex flex-col gap-2">
            <label htmlFor={`unicode-${svg.name}`}>Unicode:</label>
            <input
              className="text-center"
              name={`unicode-${svg.name}`}
              id={`unicode-${svg.name}`}
              type="text"
              value={svg.unicode}
              onChange={handleUnicodeChanged}
            />
          </div>

          <div className="w-full flex flex-col gap-2">
            <label htmlFor={`color-${svg.name}`}>Color:</label>
            <input
              className="text-center"
              name={`color-${svg.name}`}
              id={`color-${svg.name}`}
              type="text"
              value={svg.color}
              onChange={handleColorChanged}
            />
          </div>

          <button className="h-4" onClick={() => setToggleSetup(!toggleSetup)}>
            <span className="icon-chevron-down text-xl block rotate-180" />
          </button>
        </div>
      )}
    </article>
  );
}
