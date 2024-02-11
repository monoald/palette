import { PaletaError, saveColor, unsaveColor } from "./actions";
import { dispatch } from "./hooks/useStateHandler";
import { BasicCollection } from "./me/action";

export async function handleSaveColor(
  token: string,
  color: BasicCollection,
  updateColors: (type: string, payload: BasicCollection | string) => void
) {
  try {
    await saveColor(token, color.name);

    dispatch("custom:updateMessage", {
      type: "success",
      message: "Color saved successfully!",
    });
    updateColors("save", color);
    return true;
  } catch (error) {
    if (error instanceof PaletaError) {
      if (error.statusCode === 409) {
        dispatch("custom:updateOptionMessage", {
          message: "Color already saved, do you want to unsave it?",
          callbackContinue: async () => {
            handleUnsaveColor(token, color, updateColors);
            dispatch("custom:updateMessage", {
              type: "success",
              message: "Color unsaved successfully!",
            });
            return false;
          },
          callbackCancel: () => {
            updateColors("save", color);
            return true;
          },
        });
      } else {
        dispatch("custom:updateMessage", {
          type: "error",
          message: error.message,
        });
      }
    }

    return false;
  }
}

export async function handleUnsaveColor(
  token: string,
  color: BasicCollection,
  updateColors: (type: string, payload: BasicCollection | string) => void
) {
  try {
    await unsaveColor(token, color.name);

    dispatch("custom:updateMessage", {
      type: "success",
      message: "Color unsaved successfully!",
    });
    updateColors("unsave", color.name);

    return true;
  } catch (error) {
    if (error instanceof PaletaError) {
      if (error.statusCode === 409) {
        dispatch("custom:updateOptionMessage", {
          message: "Color already unsaved, do you want to save it?",
          callbackContinue: async () => {
            handleSaveColor(token, color, updateColors);
            dispatch("custom:updateMessage", {
              type: "success",
              message: "Color unsaved successfully!",
            });
            return false;
          },
          callbackCancel: () => {
            updateColors("unsave", color);
            return true;
          },
        });
      }
    }
    return false;
  }
}
