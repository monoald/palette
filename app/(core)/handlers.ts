import {
  PaletaError,
  saveColor,
  saveGradient,
  savePalette,
  unsaveColor,
  unsavePalette,
} from "./actions";
import { dispatch } from "./hooks/useStateHandler";
import {
  BasicCollection,
  GradientCollection,
  PaletteCollection,
} from "./me/action";

export async function handleSaveColor(
  token: string,
  color: BasicCollection,
  updateColors: (type: string, payload: BasicCollection | string) => void,
  callbackSave?: () => void,
  callbackUnsave?: () => void
) {
  try {
    await saveColor(token, color.name);

    dispatch("custom:updateMessage", {
      type: "success",
      message: "Color saved successfully!",
    });
    updateColors("save", color);
    if (callbackSave) {
      callbackSave();
    }
  } catch (error) {
    if (error instanceof PaletaError) {
      if (error.statusCode === 409) {
        dispatch("custom:updateOptionMessage", {
          message: "Color already saved, do you want to unsave it?",
          callbackContinue: async () => {
            handleUnsaveColor(token, color, updateColors, callbackUnsave);
            return false;
          },
          callbackCancel: () => {
            updateColors("save", color);
            if (callbackSave) {
              callbackSave();
            }
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
  updateColors: (type: string, payload: BasicCollection | string) => void,
  callbackUnsave?: () => void,
  callbackSave?: () => void
) {
  try {
    await unsaveColor(token, color.name);

    dispatch("custom:updateMessage", {
      type: "success",
      message: "Color unsaved successfully!",
    });
    updateColors("unsave", color.name);

    if (callbackUnsave) {
      callbackUnsave();
    }
  } catch (error) {
    if (error instanceof PaletaError) {
      if (error.statusCode === 409) {
        dispatch("custom:updateOptionMessage", {
          message: "Color already unsaved, do you want to save it?",
          callbackContinue: async () => {
            handleSaveColor(token, color, updateColors, callbackSave);
            return false;
          },
          callbackCancel: () => {
            updateColors("unsave", color);

            if (callbackUnsave) {
              callbackUnsave();
            }
          },
        });
      }
    }
    return false;
  }
}

export async function handleSavePalette(
  token: string,
  palette: Partial<PaletteCollection>,
  updatePalettes: (
    type: string,
    payload: Partial<PaletteCollection> | string
  ) => void
) {
  try {
    await savePalette(token, palette.colors as string);

    dispatch("custom:updateMessage", {
      type: "success",
      message: "Palette saved successfully!",
    });
    updatePalettes("save", palette);
    return true;
  } catch (error) {
    if (error instanceof PaletaError) {
      if (error.statusCode === 409) {
        dispatch("custom:updateOptionMessage", {
          message: "Palette already saved, do you want to unsave it?",
          callbackContinue: async () => {
            handleUnsavePalette(token, palette, updatePalettes);
            return false;
          },
          callbackCancel: () => {
            updatePalettes("save", palette);
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

export async function handleUnsavePalette(
  token: string,
  palette: Partial<PaletteCollection>,
  updatePalettes: (
    type: string,
    payload: Partial<PaletteCollection> | string
  ) => void
) {
  try {
    await unsavePalette(token, palette.colors as string);

    dispatch("custom:updateMessage", {
      type: "success",
      message: "Palette unsaved successfully!",
    });
    updatePalettes("unsave", palette.colors as string);

    return true;
  } catch (error) {
    if (error instanceof PaletaError) {
      if (error.statusCode === 409) {
        dispatch("custom:updateOptionMessage", {
          message: "Palette already unsaved, do you want to save it?",
          callbackContinue: async () => {
            handleSavePalette(token, palette, updatePalettes);
            return false;
          },
          callbackCancel: () => {
            updatePalettes("unsave", palette);
            return true;
          },
        });
      }
    }
    return false;
  }
}

export async function handleSaveGradient(
  token: string,
  gradient: Partial<GradientCollection>,
  updateGradients: (
    type: string,
    payload: Partial<GradientCollection> | string
  ) => void
) {
  try {
    await saveGradient(token, gradient.name as string);

    dispatch("custom:updateMessage", {
      type: "success",
      message: "Gradient saved successfully!",
    });
    updateGradients("save", gradient);
    return true;
  } catch (error) {
    if (error instanceof PaletaError) {
      if (error.statusCode === 409) {
        dispatch("custom:updateOptionMessage", {
          message: "Gradient already saved, do you want to unsave it?",
          callbackContinue: async () => {
            handleUnsavePalette(token, gradient, updateGradients);
            return false;
          },
          callbackCancel: () => {
            updateGradients("save", gradient);
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

export async function handleUnsaveGradient(
  token: string,
  gradient: Partial<GradientCollection>,
  updateGradients: (
    type: string,
    payload: Partial<GradientCollection> | string
  ) => void
) {
  try {
    await unsavePalette(token, gradient.name as string);

    dispatch("custom:updateMessage", {
      type: "success",
      message: "Gradient unsaved successfully!",
    });
    updateGradients("unsave", gradient.name as string);

    return true;
  } catch (error) {
    if (error instanceof PaletaError) {
      if (error.statusCode === 409) {
        dispatch("custom:updateOptionMessage", {
          message: "Gradient already unsaved, do you want to save it?",
          callbackContinue: async () => {
            handleSavePalette(token, gradient, updateGradients);
            return false;
          },
          callbackCancel: () => {
            updateGradients("unsave", gradient);
            return true;
          },
        });
      }
    }
    return false;
  }
}
