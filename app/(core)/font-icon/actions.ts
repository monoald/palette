import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { PaletaError } from "../actions";
import { dispatch } from "../hooks/useStateHandler";
import { IconCollection } from "./craft/page";

export async function saveFontIcon(collection: IconCollection, token: string) {
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

    dispatch("custom:updateMessage", {
      type: "success",
      message: `Font icon ${collection.name} saved successfully`,
    });

    return data.id;

    // await fetch(`http://localhost:3000/api/v1/icons/download-fonts/${data.id}`)
    //   .then(async (res) => {
    //     if (!res.ok) {
    //       throw new PaletaError(await res.json());
    //     }
    //     return await res.blob();
    //   })
    //   .then((res) => {
    //     const url = window.URL.createObjectURL(new Blob([res]));

    //     const link = document.createElement("a");
    //     link.href = url;
    //     link.setAttribute("download", `${collection.name}.zip`);
    //     document.body.appendChild(link);
    //     link.click();
    //     link?.parentNode?.removeChild(link);
    //   });
  } catch (error) {
    if (error instanceof PaletaError) {
      dispatch("custom:updateMessage", {
        type: "error",
        message: error.message,
      });
    }
    return undefined;
  }
}

export async function getFontIcon(
  id: string,
  name: string,
  router: AppRouterInstance
) {
  try {
    const fontIcon = await fetch(
      `http://localhost:3000/api/v1/icons/${id}?name=${name}`
    ).then(async (res) => {
      console.log(res);
      const data = await res.json();
      if (res.status !== 200) {
        throw new PaletaError(data);
      }

      return data;
    });

    console.log(fontIcon);

    return fontIcon;
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
