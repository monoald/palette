import { makeRandomID } from "@/app/utils/makeRandomID";
import { Icon, IconCollection } from "../craft/page";

export function normalizeIcon(icon: IconCollection): IconCollection {
  const icons: Icon[] = [...icon.icons].map((ico) => {
    let color = ico.color;
    if (ico.color === "#") color = undefined;
    return {
      name: ico.name,
      content: ico.content,
      unicode: ico.unicode,
      color: color,
      id: makeRandomID(),
    };
  });

  const name = icon.name.toLowerCase().trim().replaceAll(" ", "-");

  const color = icon.color === "#" ? undefined : icon.color;

  return { name, color, icons, thumbnail: "" };
}
