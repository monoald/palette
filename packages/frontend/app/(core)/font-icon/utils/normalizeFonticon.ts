import { Icon, FonticonData } from "../craft/page";
import { generateThumbnail } from "./generateThumbnail";

export async function normalizeFonticon(
  fonticon: FonticonData
): Promise<FonticonData> {
  const icons: Icon[] = [...fonticon.icons].map((ico) => {
    let color = ico.color;
    if (ico.color === "#") color = undefined;
    return {
      name: ico.name,
      svg: ico.svg,
      unicode: ico.unicode,
      color: color,
    };
  });

  const name = fonticon.data.name.toLowerCase().trim().replaceAll(" ", "-");

  const color = fonticon.data.color === "#" ? undefined : fonticon.data.color;

  const data = {
    name,
    color,
    thumbnail: await generateThumbnail(fonticon.icons),
  };

  return { data, icons };
}
