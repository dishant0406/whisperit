import { create } from "zustand";

//global state to manager logined user with userid token and userdata
export const useAuthStore = create((set) => ({
  user: {
    userid: null,
    token: null,
    user: null,
  },
  setUser: (user) => set({ user }),
}));

