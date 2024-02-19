import { create } from "zustand";
import {
  BasicCollection,
  Collections,
  GradientCollection,
  IconsCollection,
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
  updateUser: (user: User, token: string) => void;
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
    payload: Partial<IconsCollection> | string
  ) => void;
};

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
          colors: [...state.collections.colors, payload],
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
          palettes: [...state.collections.palettes, payload],
        },
      };
    }
  } else if (type === "unsave") {
    if (state.collections?.palettes) {
      const newPalettes = [...state.collections.palettes];
      const colorIndex = state.collections.palettes.findIndex(
        (palette) => palette.colors === payload
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
          gradients: [...state.collections.gradients, payload],
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
          icons: [...state.collections.icons, payload],
        },
      };
    }
  } else if (type === "unsave") {
    if (state.collections?.icons) {
      const newIcons = [...state.collections.icons];
      const colorIndex = state.collections.icons.findIndex(
        (icn) => icn.id === payload
      );

      if (colorIndex !== -1) {
        newIcons?.splice(colorIndex, 1);

        return {
          ...state,
          collections: { ...state.collections, icons: newIcons },
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
  updateUser: (user, token) => set(() => ({ user, token })),
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
