import { useStore } from "@data-access/state-management";
import { useEffect, useRef } from "react";

const DURATION = 100000;

export const useEventResponseTimeout = (referenceId: string) => {
    const timeout = useRef<NodeJS.Timeout | null>(null);

    const refererenceQueue = useStore(state => state.referenceQueue);
    const removeEventReference = useStore(state => state.removeEventReference);
    const setFlashNotification = useStore((state) => state.setFlashNotification);

    useEffect(() => {
        if (referenceId) {
            const queueReference = refererenceQueue[referenceId];

            if (queueReference?.status === 'success' && timeout.current) {
                clearTimeout(timeout.current);

                return;
            }

            timeout.current = setTimeout(() => {
                if (queueReference?.status === 'pending') {
                    setFlashNotification({
                        message: 'Timeout',
                        alertType: 'error',
                        duration: 5500
                    });

                    removeEventReference(referenceId);
                }
            }, DURATION);
        }
        return () => {
            if (timeout.current) {
                clearTimeout(timeout.current);
            }
        }
    }, [referenceId, refererenceQueue]);

}