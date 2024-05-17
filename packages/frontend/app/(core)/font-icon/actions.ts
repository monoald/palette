import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { PaletaError } from "../actions";
import { dispatch } from "../hooks/useStateHandler";
import { Fonticon, FonticonData } from "./craft/page";
import { replacePath } from "@/app/utils/urlState";
import { normalizeFonticon } from "./utils/normalizeFonticon";
import { FontIconsCollection } from "../me/action";
import { Changes } from "./edit/[slug]/page";
import { normalizeChanges } from "./utils/normalizeChanges";

const SERVICE_URI = process.env.NEXT_PUBLIC_FONTICON_SERVICE_URI;

export async function saveFontIcon(
  fonticon: FonticonData,
  token: string,
  updateFontIcons: (type: string, payload: FontIconsCollection | string) => void
) {
  dispatch("custom:load", { load: true });
  try {
    const body = await normalizeFonticon(fonticon);

    const result = await fetch(`${SERVICE_URI}/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...body }),
    }).then(async (res) => {
      const result = await res.json();
      if (!res.ok) {
        throw new PaletaError(result);
      }
      return result;
    });

    dispatch("custom:load", { load: false });
    dispatch("custom:updateMessage", {
      type: "success",
      message: `Font icon ${fonticon.data.name} saved successfully`,
    });

    updateFontIcons("save", { ...body.data, id: result.id });
    return result.id;
  } catch (error) {
    if (error instanceof PaletaError) {
      dispatch("custom:load", { load: false });
      dispatch("custom:updateMessage", {
        type: "error",
        message: error.message,
      });
    }
    return undefined;
  }
}

export async function unsaveFontIcon(
  id: string,
  token: string,
  updateFontIcons: (type: string, payload: Fonticon | string) => void,
  router: AppRouterInstance
) {
  dispatch("custom:load", { load: true });
  try {
    const data = await fetch(
      `https://extinct-houndstooth-fly.cyclic.cloud/api/v1/icons/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: `bearer ${token}`,
        },
      }
    ).then(async (res) => {
      const data = await res.json();
      if (!res.ok) {
        throw new PaletaError(data);
      }
      return data;
    });

    dispatch("custom:load", { load: false });
    dispatch("custom:updateMessage", {
      type: "success",
      message: "Font icon unsaved successfully",
    });
    updateFontIcons("unsave", id);
    router.push("/font-icon/craft");
  } catch (error) {
    if (error instanceof PaletaError) {
      dispatch("custom:load", { load: false });
      dispatch("custom:updateMessage", {
        type: "error",
        message: error.message,
      });
    }
  }
}

export async function getFonticon(
  name: string,
  token: string,
  router: AppRouterInstance
): Promise<FonticonData | undefined> {
  try {
    const fonticon: FonticonData = await fetch(`${SERVICE_URI}/${name}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(async (res) => {
      const data = await res.json();
      if (res.status !== 200) {
        throw new PaletaError(data);
      }

      return data;
    });

    return {
      ...fonticon,
    };
  } catch (error) {
    if (error instanceof PaletaError) {
      dispatch("custom:updateMessage", {
        type: "error",
        message: error.message,
      });
      router.push("/font-icon/craft");
    }
  }
}

export async function downloadFonts(fonticon: FonticonData) {
  try {
    dispatch("custom:load", { load: true });

    const body = await normalizeFonticon(fonticon);

    await fetch(`${SERVICE_URI}/download-fonts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then(async (res) => {
        if (res.status !== 200) {
          throw new PaletaError(await res.json());
        }
        return await res.blob();
      })
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res]));

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${fonticon.data.name}-fonts.zip`);
        document.body.appendChild(link);
        link.click();
        link?.parentNode?.removeChild(link);
      });

    dispatch("custom:load", { load: false });
  } catch (error) {
    if (error instanceof PaletaError) {
      dispatch("custom:load", { load: false });
      dispatch("custom:updateMessage", {
        type: "error",
        message: error.message,
      });
    }
  }
}

export async function downloadSavedFonts(id: string, name: string) {
  try {
    dispatch("custom:load", { load: true });

    await fetch(`${SERVICE_URI}/download-fonts-saved/${id}`)
      .then(async (res) => {
        if (!res.ok) {
          throw new PaletaError(await res.json());
        }
        return await res.blob();
      })
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res]));

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${name}-fonts.zip`);
        document.body.appendChild(link);
        link.click();
        link?.parentNode?.removeChild(link);
      });

    dispatch("custom:load", { load: false });
  } catch (error) {
    if (error instanceof PaletaError) {
      dispatch("custom:load", { load: false });
      dispatch("custom:updateMessage", {
        type: "error",
        message: error.message,
      });
    }
  }
}

export async function downloadIcons(id: string, name: string) {
  dispatch("custom:load", { load: true });
  try {
    await fetch(`${SERVICE_URI}/download-icons/${id}`)
      .then(async (res) => {
        if (!res.ok) {
          throw new PaletaError(await res.json());
        }
        return await res.blob();
      })
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res]));

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${name}-icons.zip`);
        document.body.appendChild(link);
        link.click();
        link?.parentNode?.removeChild(link);
      });
    dispatch("custom:load", { load: false });
  } catch (error) {
    if (error instanceof PaletaError) {
      dispatch("custom:load", { load: false });
      dispatch("custom:updateMessage", {
        type: "error",
        message: error.message,
      });
    }
  }
}

export async function updateIcons(id: string, token: string, changes: Changes) {
  dispatch("custom:load", { load: true });
  try {
    const body = normalizeChanges(changes);

    await fetch(`${SERVICE_URI}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    }).then(async (res) => {
      if (res.status !== 204) {
        const data = await res.json();
        throw new PaletaError(data);
      }
    });

    dispatch("custom:load", { load: false });
    dispatch("custom:updateMessage", {
      type: "success",
      message: "Updated successfully",
    });

    if (changes.data.name) replacePath(id + "+" + changes.data.name);
  } catch (error) {
    if (error instanceof PaletaError) {
      dispatch("custom:load", { load: false });
      dispatch("custom:updateMessage", {
        type: "error",
        message: error.message,
      });
    }
  }
}
