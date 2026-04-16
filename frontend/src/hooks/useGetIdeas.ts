/**
 * React Hook: useGetIdeas
 * Hook for calling the /api/getIdeas endpoint
 * Manages loading, error, and ideas state
 */

import { useEffect, useState } from 'react';

export interface Idea {
    id: string;
    user_id: string;
    idea_text: string;
    industry: string;
    created_at: string;
    updated_at: string;
}

export interface UseGetIdeasResult {
    isLoading: boolean;
    error: string | null;
    ideas: Idea[] | null;
    count: number;
    refetch: () => Promise<void>;
    reset: () => void;
}

export function useGetIdeas(autoFetch = true): UseGetIdeasResult {
    const [isLoading, setIsLoading] = useState(autoFetch);
    const [error, setError] = useState<string | null>(null);
    const [ideas, setIdeas] = useState<Idea[] | null>(null);
    const [count, setCount] = useState(0);

    const fetchIdeas = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
            const response = await fetch(`${backendUrl}/api/getIdeas`);

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.error || 'Failed to fetch ideas'
                );
            }

            setIdeas(result.ideas || []);
            setCount((result.ideas || []).length);
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : 'Unknown error occurred';
            setError(errorMessage);
            console.error('Error fetching ideas:', errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // Auto-fetch on mount if autoFetch is true
    useEffect(() => {
        if (autoFetch) {
            fetchIdeas();
        }
    }, [autoFetch]);

    const reset = () => {
        setIsLoading(false);
        setError(null);
        setIdeas(null);
        setCount(0);
    };

    return {
        isLoading,
        error,
        ideas,
        count,
        refetch: fetchIdeas,
        reset,
    };
}
