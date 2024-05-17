import { Changes } from "../edit/[slug]/page";

function emptyObject(obj: Object) {
  return !(Object.keys(obj).length === 0 && obj.constructor === Object);
}

export function normalizeChanges(changes: Changes) {
  const normalized: any = {};
  const icons: any = {};

  if (emptyObject(changes.data)) {
    normalized.data = changes.data;
  }

  if (changes.icons.new.length !== 0) {
    icons.new = changes.icons.new.map((icon) => ({
      name: icon.name,
      color: icon.color,
      unicode: icon.unicode,
      svg: icon.svg,
    }));
  }

  if (changes.icons.update.length !== 0) {
    icons.update = changes.icons.update;
  }

  if (changes.icons.delete.length !== 0) {
    icons.delete = changes.icons.delete;
  }

  if (emptyObject(icons)) {
    normalized.icons = icons;
  }

  return normalized;
}
