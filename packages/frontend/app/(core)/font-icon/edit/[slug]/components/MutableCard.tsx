import Image from "next/image";
import { Icon, FonticonData } from "../../../craft/page";
import { Dispatch, SetStateAction, useState } from "react";
import { changeSvgColor } from "../../../utils/changeIconColor";
import { dispatch } from "../../../../hooks/useStateHandler";
import { Changes } from "../page";

type Props = {
  icon: Icon;
  setFonticon: Dispatch<SetStateAction<FonticonData>>;
  changes: Changes;
  setChanges: Dispatch<SetStateAction<Changes>>;
};

const handleUpdate = (changes: Changes, icon: Icon, payload: Partial<Icon>) => {
  const newIndex = changes.icons.new.findIndex((ico) => ico.id === icon.id);

  if (newIndex !== -1) {
    const tempNewIcon = { ...icon, ...payload };
    const tempNewIcons = changes.icons.new;

    if (newIndex !== -1) {
      tempNewIcons[newIndex] = tempNewIcon;
    } else {
      tempNewIcons.push(tempNewIcon);
    }

    return { ...changes, icons: { ...changes.icons, new: tempNewIcons } };
  }

  const updateIndex = changes.icons.update.findIndex((ico) => {
    return +ico.id === icon.id;
  }) as number;

  const tempUpdateIcon = {
    ...changes.icons.update[updateIndex],
    ...payload,
    id: `${icon.id}`,
  };

  let tempUpdateIcons = changes.icons.update;

  if (updateIndex !== -1) {
    tempUpdateIcons[updateIndex] = tempUpdateIcon;
  } else {
    tempUpdateIcons.push(tempUpdateIcon);
  }

  return { ...changes, icons: { ...changes.icons, update: tempUpdateIcons } };
};

const handleDelete = (changes: Changes, id: string | number): Changes => {
  const newIndex = changes.icons.new.findIndex((ico) => ico.id === `${id}`);

  if (newIndex !== -1) {
    const tempNewIcons = changes.icons.new;

    tempNewIcons.splice(newIndex, 1);

    return { ...changes, icons: { ...changes.icons, new: tempNewIcons } };
  }

  const updateIndex = changes.icons.update.findIndex(
    (ico) => ico.id === `${id}`
  );

  if (updateIndex !== -1) {
    const tempUpdateIcons = changes.icons.update;
    const tempDeleteIcons = [...changes.icons.delete, { id: +id }];

    tempUpdateIcons.splice(updateIndex, 1);

    return {
      ...changes,
      icons: {
        ...changes.icons,
        update: tempUpdateIcons,
        delete: tempDeleteIcons,
      },
    };
  }

  const tempDeleteIcons = [...changes.icons.delete, { id: +id }];
  return { ...changes, icons: { ...changes.icons, delete: tempDeleteIcons } };
};

export function MutableCard({ icon, setFonticon, changes, setChanges }: Props) {
  const [toggleSetup, setToggleSetup] = useState(false);

  const handleNameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const regex = /^[a-zA-Z0-9-_]+$/;
    let normalizedName = e.target.value.toLowerCase();
    if (regex.test(normalizedName) || normalizedName === "") {
      setFonticon((prev) => {
        const newIcons = [...prev.icons];
        const iconIndex = newIcons.findIndex((ico) => ico.id === icon.id);
        const tempIcon = newIcons[iconIndex];

        const iconUsedIndex = newIcons.findIndex((ico) => {
          if (ico.id !== tempIcon.id) {
            return ico.name === normalizedName;
          }
        });

        if (iconUsedIndex !== -1) {
          dispatch("custom:updateMessage", {
            type: "warning",
            message: `Name ${normalizedName} already used`,
          });
          newIcons[iconUsedIndex].warning = true;
          if (tempIcon) tempIcon.warning = true;
        } else {
          newIcons.forEach((ico) => {
            ico.warning = false;
          });
        }

        if (tempIcon) {
          tempIcon.name = normalizedName;
        }

        return { ...prev, icons: newIcons };
      });

      const newChanges = handleUpdate(changes, icon, { name: normalizedName });
      setChanges(newChanges);
    }
  };

  const handleUnicodeChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const unicode = e.target.value;
    setFonticon((prev) => {
      const newIcons = [...prev.icons];
      const tempIcon = newIcons.find((ico) => ico.id === icon.id);

      const unicodeUsed = newIcons.find((ico) => {
        if (ico.id !== icon.id) {
          return ico.unicode === unicode;
        }
      });

      if (unicodeUsed !== undefined) {
        dispatch("custom:updateMessage", {
          type: "warning",
          message: `Unicode ${unicode} already used`,
        });
        unicodeUsed.warning = true;
        if (tempIcon) tempIcon.warning = true;
      } else {
        newIcons.forEach((ico) => {
          ico.warning = false;
        });
      }

      if (tempIcon) {
        tempIcon.unicode = unicode;
      }

      return { ...prev, icons: newIcons };
    });

    const newChanges = handleUpdate(changes, icon, { unicode });
    setChanges(newChanges);
  };

  const handleColorChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const regex = /^[a-zA-Z0-9#]+$/;
    let color = e.target.value.toLowerCase();
    if (regex.test(color) || color === "") {
      const updatedSvg = changeSvgColor(icon.svg, color);
      setFonticon((prev) => {
        const newIcons = [...prev.icons];
        const tempIcon = newIcons.find((ico) => ico.id === icon.id);

        if (tempIcon) {
          tempIcon.color = color;
          tempIcon.svg = updatedSvg;
        }

        return { ...prev, icons: newIcons };
      });
      const newChanges = handleUpdate(changes, icon, {
        color,
        svg: updatedSvg,
      });
      setChanges(newChanges);
    }
  };

  const handleIconRemoved = () => {
    setFonticon((prev) => {
      const newIcons = [...prev.icons];
      const iconIndex = newIcons.findIndex((ico) => ico.id === icon.id);
      newIcons.splice(iconIndex, 1);
      return { ...prev, icons: newIcons };
    });

    const newChanges = handleDelete(changes, icon.id!);
    setChanges(newChanges);
  };

  return (
    <article
      className={`relative p-5 border ${
        icon.warning ? "border-[#ec9d09]" : "border-primary-border"
      } rounded-2xl flex flex-col items-center gap-4`}
    >
      <Image
        className="icon__svg"
        width={36}
        height={36}
        src={`data:image/svg+xml;base64,${btoa(
          unescape(encodeURIComponent(icon.svg))
        )}`}
        alt={`icon ${icon.name}`}
      />

      <div className="relative w-full px-2 border border-primary-border focus-within:border-white rounded-lg overflow-hidden after:absolute after:top-0 after:right-0 after:w-10 after:h-full after:block after:bg-[linear-gradient(90deg,rgba(0,0,0,0),#03050c)] after:pointer-events-none">
        <input
          className="w-full whitespace-nowrap overflow-hidden border-none text-center focus-visible:outline-none"
          type="text"
          value={icon.name}
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
            icon.warning ? "border-[#ec9d09]" : "border-primary-border"
          } rounded-b-2xl transition-all bg-main z-10`}
        >
          <div className="w-full flex flex-col gap-2">
            <label htmlFor={`unicode-${icon.name}`}>Unicode:</label>
            <input
              className="text-center"
              name={`unicode-${icon.name}`}
              id={`unicode-${icon.name}`}
              type="text"
              value={icon.unicode}
              onChange={handleUnicodeChanged}
            />
          </div>

          <div className="w-full flex flex-col gap-2">
            <label htmlFor={`color-${icon.name}`}>Color:</label>
            <input
              className="text-center"
              name={`color-${icon.name}`}
              id={`color-${icon.name}`}
              type="text"
              value={icon.color}
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
