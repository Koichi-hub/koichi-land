import { useState, useEffect } from "react";
import type { Layout } from "@snapgridjs/react";

/**
 * Custom hook to manage widget positions with localStorage.
 * @param storageKey The key used for saving positions in localStorage.
 * @param defaultLayout Default layout if no data is found in localStorage.
 */
export default function useWidgetPositions(storageKey: string, defaultLayout: Layout) {
    // State to hold the layout
    const [layout, setLayout] = useState<Layout>(() => {
        try {
            const storedLayout = localStorage.getItem(storageKey);
            if (storedLayout) {
                return JSON.parse(storedLayout);
            }
        } catch (error) {
            console.error("Failed to parse localStorage data: ", error);
        }
        return defaultLayout;
    });

    // Update localStorage whenever layout changes
    useEffect(() => {
        try {
            localStorage.setItem(storageKey, JSON.stringify(layout));
        } catch (error) {
            console.error("Failed to save layout to localStorage: ", error);
        }
    }, [layout, storageKey]);

    return [layout, setLayout] as const;
}