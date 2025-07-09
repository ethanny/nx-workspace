'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const FlashNotification = dynamic(
    () => import('../flash-notification/flash-notification'),
    { ssr: false }
);

const ReactQueryProvider = dynamic(
    () => import('../react-query/react-query-provder'),
    { ssr: false }
);

export function ClientProvider({ children }: { children: React.ReactNode }) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <ReactQueryProvider>
            {children}
            <FlashNotification />
        </ReactQueryProvider>
    );
}