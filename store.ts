import { create } from "zustand";
import {
  BasicCollection,
  Collections,
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
      const newColors = [...state.collections.palettes];
      const colorIndex = state.collections.palettes.findIndex(
        (palette) => palette.colors === payload
      );

      if (colorIndex !== -1) {
        newColors?.splice(colorIndex, 1);

        return {
          ...state,
          collections: { ...state.collections, palettes: newColors },
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
}));
