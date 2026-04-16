/**
 * React Hook: useAnalyzeIdea
 * Hook for calling the /api/analyzeIdea endpoint
 * Manages loading, error, and success states
 */

import { useState } from 'react';

export interface UseAnalyzeIdeaResult {
    isLoading: boolean;
    error: string | null;
    data: {
        idea: any;
        analysis: any;
    } | null;
    analyzeIdea: (userId: string, ideaText: string, industry: string) => Promise<void>;
    reset: () => void;
}

export function useAnalyzeIdea(): UseAnalyzeIdeaResult {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<{ idea: any; analysis: any } | null>(null);

    const analyzeIdea = async (userId: string, ideaText: string, industry: string) => {
        setIsLoading(true);
        setError(null);
        setData(null);

        try {
            const response = await fetch('/api/analyzeIdea', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    ideaText,
                    industry,
                }),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.error || 'Failed to analyze idea');
            }

            setData(result.data);
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : 'Unknown error occurred';
            setError(errorMessage);
            console.error('Error analyzing idea:', errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const reset = () => {
        setIsLoading(false);
        setError(null);
        setData(null);
    };

    return {
        isLoading,
        error,
        data,
        analyzeIdea,
        reset,
    };
}
