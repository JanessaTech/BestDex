import { AuthenticationStatus } from "@rainbow-me/rainbowkit";
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware'


interface AuthState {
    connected: AuthenticationStatus;
    setState: (status: AuthenticationStatus) => void;
    isDone: boolean;
    setIsDone: (done: boolean) => void
}

export const useAuthState = create<AuthState>()(persist(
    (set) => ({
        connected: 'loading',
        isDone: false,
        setState: (status) => set({connected: status}),
        setIsDone: (done) => set({isDone: done})
    }),
    {
        name: 'auth_state',
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