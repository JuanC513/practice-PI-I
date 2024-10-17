import { create } from "zustand";

const useHomeStore = create((set) => ({
    home: {
        showHome: false,
    },

    setHome: (homeUpdates) =>
        set((state) => ({
            home: {...state.home, ...homeUpdates},
        })),
}))

export default useHomeStore;