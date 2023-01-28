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

//global state to manage userDetails
export const useUserDetailsStore = create((set) => ({
  userDetails: {
    fullname: null,
    email: null,
    photo: null,
    userid: null,
    aboutme: null
  },
  setUserDetails: (userDetails) => set({ userDetails }),
}));

//global state to manage selectedUser to chat with
export const useSelectedUserStore = create((set) => ({
  selectedUser: {
    fullname: null,
    email: null,
    photo: null,
    userid: null,
    aboutme: null
  },
  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));

//global state to manage all the users I have chatted with in past
export const useUsersChatsStore = create((set) => ({
  usersChats: [],
  setUsersChats: (usersChats) => set({ usersChats }),
}));

//global state to manage all the messages of all users
export const useMessagesStore = create((set) => ({
  messages: {},
  setMessages: (messages) => set({ messages }),
}));

//global state to manage all the staredMessages of the user
export const useStaredMessagesStore = create((set) => ({
  staredMessages: {},
  setStaredMessages: (staredMessages) => set({ staredMessages }),
}));

//global state to manage all chatids
export const useChatIdsStore = create((set) => ({
  chatIds: [],
  setChatIds: (chatIds) => set({ chatIds }),
}));

