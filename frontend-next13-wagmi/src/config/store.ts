import { AuthenticationStatus } from "@rainbow-me/rainbowkit";
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware'


interface AuthState {
    auth: AuthenticationStatus;
    setAuth: (status: AuthenticationStatus) => void;
    isDone: boolean;
    setIsDone: (done: boolean) => void
}

export const useAuthState = create<AuthState>()(persist(
    (set) => ({
        auth: 'loading',
        isDone: false,
        setAuth: (status) => set({auth: status}),
        setIsDone: (done) => set({isDone: done})
    }),
    {
        name: 'authState',
        storage: createJSONStorage(() => localStorage),
        onRehydrateStorage: () => (state) => {
            state?.setIsDone(true)
        }
    }
))

interface SettingState {
    slipage: number;
    deadline: number | '';
    updateSlipage: (newSlipage: number) => void;
    updateDeadline: (newDeadline: number | '') => void
}
export const useUpdateSetting = create<SettingState>()(persist(
    (set) => ({
        slipage: 0.3, // percentage
        deadline: 10, // mins
        updateSlipage : (slipage) => set({slipage: slipage}),
        updateDeadline: (deadline) => set({deadline: deadline})
    }),
    {
        name: 'setting', 
        storage: createJSONStorage(() => localStorage),
    }
))