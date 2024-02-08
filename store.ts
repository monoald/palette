"use client";
import { create } from "zustand";

export type User = {
  avatar: string;
  username: string;
  id: string;
};

type State = {
  user: User | null;
  token: string | null;
};

type Actions = {
  updateUser: (user: User, token: string) => void;
};

export const useUserStore = create<State & Actions>((set) => ({
  user: null,
  token: null,
  updateUser: (user, token) => set(() => ({ user, token })),
}));
