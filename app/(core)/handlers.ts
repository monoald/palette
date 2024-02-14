import {
  PaletaError,
  saveColor,
  saveGradient,
  savePalette,
  unsaveColor,
  unsaveGradient,
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
  }
}

export async function handleSavePalette(
  token: string,
  palette: Partial<PaletteCollection>,
  updatePalettes: (
    type: string,
    payload: Partial<PaletteCollection> | string
  ) => void,
  callbackSave?: () => void,
  callbackUnsave?: () => void
) {
  try {
    await savePalette(token, palette.colors as string);

    dispatch("custom:updateMessage", {
      type: "success",
      message: "Palette saved successfully!",
    });
    updatePalettes("save", palette);

    if (callbackSave) {
      callbackSave();
    }
  } catch (error) {
    if (error instanceof PaletaError) {
      if (error.statusCode === 409) {
        dispatch("custom:updateOptionMessage", {
          message: "Palette already saved, do you want to unsave it?",
          callbackContinue: async () => {
            handleUnsavePalette(token, palette, updatePalettes, callbackUnsave);
          },
          callbackCancel: () => {
            updatePalettes("save", palette);

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
  }
}

export async function handleUnsavePalette(
  token: string,
  palette: Partial<PaletteCollection>,
  updatePalettes: (
    type: string,
    payload: Partial<PaletteCollection> | string
  ) => void,
  callbackUnsave?: () => void,
  callbackSave?: () => void
) {
  try {
    await unsavePalette(token, palette.colors as string);

    dispatch("custom:updateMessage", {
      type: "success",
      message: "Palette unsaved successfully!",
    });
    updatePalettes("unsave", palette.colors as string);

    if (callbackUnsave) {
      callbackUnsave();
    }
  } catch (error) {
    if (error instanceof PaletaError) {
      if (error.statusCode === 409) {
        dispatch("custom:updateOptionMessage", {
          message: "Palette already unsaved, do you want to save it?",
          callbackContinue: async () => {
            handleSavePalette(token, palette, updatePalettes, callbackSave);
          },
          callbackCancel: () => {
            updatePalettes("unsave", palette);
            if (callbackUnsave) {
              callbackUnsave();
            }
          },
        });
      }
    }
  }
}

export async function handleSaveGradient(
  token: string,
  gradient: Partial<GradientCollection>,
  updateGradients: (
    type: string,
    payload: Partial<GradientCollection> | string
  ) => void,
  callbackSave?: () => void,
  callbackUnsave?: () => void
) {
  try {
    await saveGradient(token, gradient.name as string);

    dispatch("custom:updateMessage", {
      type: "success",
      message: "Gradient saved successfully!",
    });
    updateGradients("save", gradient);

    if (callbackSave) {
      callbackSave();
    }
  } catch (error) {
    if (error instanceof PaletaError) {
      if (error.statusCode === 409) {
        dispatch("custom:updateOptionMessage", {
          message: "Gradient already saved, do you want to unsave it?",
          callbackContinue: async () => {
            handleUnsavePalette(
              token,
              gradient,
              updateGradients,
              callbackUnsave
            );
          },
          callbackCancel: () => {
            updateGradients("save", gradient);

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
  }
}

export async function handleUnsaveGradient(
  token: string,
  gradient: Partial<GradientCollection>,
  updateGradients: (
    type: string,
    payload: Partial<GradientCollection> | string
  ) => void,
  callbackUnsave?: () => void,
  callbackSave?: () => void
) {
  try {
    await unsaveGradient(token, gradient.name as string);

    dispatch("custom:updateMessage", {
      type: "success",
      message: "Gradient unsaved successfully!",
    });
    updateGradients("unsave", gradient.name as string);

    if (callbackUnsave) {
      callbackUnsave();
    }
  } catch (error) {
    if (error instanceof PaletaError) {
      if (error.statusCode === 409) {
        dispatch("custom:updateOptionMessage", {
          message: "Gradient already unsaved, do you want to save it?",
          callbackContinue: async () => {
            handleSavePalette(token, gradient, updateGradients, callbackSave);
            return false;
          },
          callbackCancel: () => {
            updateGradients("unsave", gradient);

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
