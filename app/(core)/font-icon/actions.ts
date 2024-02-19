import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { PaletaError } from "../actions";
import { dispatch } from "../hooks/useStateHandler";
import { IconCollection } from "./craft/page";
import { replacePath } from "@/app/utils/urlState";

export async function saveFontIcon(collection: IconCollection, token: string) {
  dispatch("custom:load", { load: true });
  try {
    const data = await fetch("http://localhost:3000/api/v1/icons", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `bearer ${token}`,
      },
      body: JSON.stringify(collection),
    }).then(async (res) => {
      const data = await res.json();
      if (!res.ok) {
        throw new PaletaError(data);
      }
      return data;
    });

    dispatch("custom:load", { load: false });
    dispatch("custom:updateMessage", {
      type: "success",
      message: `Font icon ${collection.name} saved successfully`,
    });

    return data.id;
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
  router: AppRouterInstance
) {
  dispatch("custom:load", { load: true });
  try {
    const data = await fetch(`http://localhost:3000/api/v1/icons/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `bearer ${token}`,
      },
    }).then(async (res) => {
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

export async function getFontIcon(
  id: string,
  name: string,
  router: AppRouterInstance
): Promise<IconCollection | undefined> {
  try {
    const fontIcon: IconCollection = await fetch(
      `http://localhost:3000/api/v1/icons/${id}?name=${name}`
    ).then(async (res) => {
      const data = await res.json();
      if (res.status !== 200) {
        throw new PaletaError(data);
      }

      return data;
    });

    return {
      ...fontIcon,
      icons: fontIcon.icons.map((icn) => {
        const newIcn = {
          color: icn.color,
          name: icn.name,
          content: icn.content,
          unicode: icn.unicode,
          id: icn._id as string,
        };
        return newIcn;
      }),
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

export async function downloadFonts(id: string, name: string) {
  dispatch("custom:load", { load: true });
  try {
    await fetch(`http://localhost:3000/api/v1/icons/download-fonts/${id}`)
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
    await fetch(`http://localhost:3000/api/v1/icons/download-icons/${id}`)
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

export async function updateIcons(
  id: string,
  token: string,
  collection: IconCollection
) {
  dispatch("custom:load", { load: true });
  try {
    await fetch(`http://localhost:3000/api/v1/icons/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `bearer ${token}`,
      },
      body: JSON.stringify({
        name: collection.name,
        icons: collection.icons,
        color: collection.color,
      }),
    }).then(async (res) => {
      const data = await res.json();
      if (res.status !== 200) {
        throw new PaletaError(data);
      }
      return data;
    });

    dispatch("custom:load", { load: false });
    dispatch("custom:updateMessage", {
      type: "success",
      message: "Updated successfully",
    });
    replacePath(id + "+" + collection.name);
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
