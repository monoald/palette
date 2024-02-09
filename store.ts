import { create } from "zustand";
import { Collections } from "./app/(core)/me/action";

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
};

export const useUserStore = create<UserState & Actions>((set) => ({
  user: null,
  token: null,
  collections: null,
  updateUser: (user, token) => set(() => ({ user, token })),
  updateCollections: (collections) => set(() => ({ collections })),
}));
