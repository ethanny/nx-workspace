import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { createAuthedUserSlice, IAuthUser } from './createAuthedUserSlice';
import { createEventReferenceSlice, IEventReferenceSlice } from './createEventReferenceSlice';
import { createFlashNotificationSlice, IFlashNotificationState } from './createFlashNotificationSlice';

interface IStore extends IAuthUser, IEventReferenceSlice, IFlashNotificationState {
    resetAll: () => void;
}

/**
 * Make sure to enforce type for each slice
 */

export const useStore = create<IStore>()(
    devtools(
        persist(
            (set, get, api) => ({
                ...createAuthedUserSlice(set, get, api),
                ...createEventReferenceSlice(set, get, api),
                ...createFlashNotificationSlice(set, get, api),

                // Global reset action
                resetAll: () => {
                    get().clearAuthedUser();
                    get().clearEventReference();
                },
            }),
            {
                name: 'app-storage',
                storage: createJSONStorage(() => sessionStorage),
            }
        )
    )
);
