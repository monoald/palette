import { create } from "zustand";
import {
  BasicCollection,
  Collections,
  GradientCollection,
  FontIconsCollection,
  PaletteCollection,
} from "./app/(core)/me/action";

export type User = {
  avatar: string;
  username: string;
  id: string;
};

export type UserState = {
  user: User | null;
  token: string | null;
  collections: Collections | null;
};

type Actions = {
  updateUser: (user: User | null, token: string | null) => void;
  updateCollections: (collections: Collections) => void;
  updateColors: (type: string, payload: BasicCollection | string) => void;
  updatePalettes: (
    type: string,
    payload: Partial<PaletteCollection> | string
  ) => void;
  updateGradients: (
    type: string,
    payload: Partial<GradientCollection> | string
  ) => void;
  updateFontIcons: (
    type: string,
    payload: Partial<FontIconsCollection> | string
  ) => void;
};

function handleUpdateUser(user: User | null, token: string | null) {
  return { user, token };
}

function handleUpdateColors(
  state: UserState & Actions,
  type: string,
  payload: any
): Partial<UserState & Actions> {
  if (type === "save") {
    if (state.collections) {
      return {
        ...state,
        collections: {
          ...state.collections,
          colors: [payload, ...state.collections.colors],
        },
      };
    }
  } else if (type === "unsave") {
    if (state.collections?.colors) {
      const newColors = [...state.collections.colors];
      const colorIndex = state.collections.colors.findIndex(
        (clr) => clr.name === payload
      );

      if (colorIndex !== -1) {
        newColors?.splice(colorIndex, 1);

        return {
          ...state,
          collections: { ...state.collections, colors: newColors },
        };
      }
    }
  }
  return state;
}

function handleUpdatePalettes(
  state: UserState & Actions,
  type: string,
  payload: any
): Partial<UserState & Actions> {
  if (type === "save") {
    if (state.collections) {
      return {
        ...state,
        collections: {
          ...state.collections,
          palettes: [payload, ...state.collections.palettes],
        },
      };
    }
  } else if (type === "unsave") {
    if (state.collections?.palettes) {
      const newPalettes = [...state.collections.palettes];
      const colorIndex = state.collections.palettes.findIndex(
        (palette) => palette.name === payload
      );

      if (colorIndex !== -1) {
        newPalettes?.splice(colorIndex, 1);

        return {
          ...state,
          collections: { ...state.collections, palettes: newPalettes },
        };
      }
    }
  }
  return state;
}

function handleUpdateGradients(
  state: UserState & Actions,
  type: string,
  payload: any
): Partial<UserState & Actions> {
  if (type === "save") {
    if (state.collections) {
      return {
        ...state,
        collections: {
          ...state.collections,
          gradients: [payload, ...state.collections.gradients],
        },
      };
    }
  } else if (type === "unsave") {
    if (state.collections?.gradients) {
      const newGradients = [...state.collections.gradients];
      const colorIndex = state.collections.gradients.findIndex(
        (gradient) => gradient.name === payload
      );

      if (colorIndex !== -1) {
        newGradients?.splice(colorIndex, 1);

        return {
          ...state,
          collections: { ...state.collections, gradients: newGradients },
        };
      }
    }
  }
  return state;
}

function handleUpdateFontIcons(
  state: UserState & Actions,
  type: string,
  payload: any
): Partial<UserState & Actions> {
  if (type === "save") {
    if (state.collections) {
      return {
        ...state,
        collections: {
          ...state.collections,
          fonticons: [payload, ...state.collections.fonticons],
        },
      };
    }
  } else if (type === "unsave") {
    if (state.collections?.fonticons) {
      const newIcons = [...state.collections.fonticons];
      const colorIndex = state.collections.fonticons.findIndex(
        (fonticon) => fonticon.id === payload
      );

      if (colorIndex !== -1) {
        newIcons?.splice(colorIndex, 1);

        return {
          ...state,
          collections: { ...state.collections, fonticons: newIcons },
        };
      }
    }
  }
  return state;
}

export const useUserStore = create<UserState & Actions>((set) => ({
  user: null,
  token: null,
  collections: null,
  updateUser: (user, token) => set(() => handleUpdateUser(user, token)),
  updateCollections: (collections) => set(() => ({ collections })),
  updateColors: (type, payload) =>
    set((state) => handleUpdateColors(state, type, payload)),
  updatePalettes: (type, payload) =>
    set((state) => handleUpdatePalettes(state, type, payload)),
  updateGradients: (type, payload) =>
    set((state) => handleUpdateGradients(state, type, payload)),
  updateFontIcons: (type, payload) =>
    set((state) => handleUpdateFontIcons(state, type, payload)),
}));
