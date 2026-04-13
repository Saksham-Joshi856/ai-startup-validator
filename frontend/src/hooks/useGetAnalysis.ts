/**
 * React Hook: useGetAnalysis
 * Hook for calling the /api/getAnalysis endpoint
 * Manages loading, error, and analysis state
 */

import { useEffect, useState } from 'react';

export interface AnalysisData {
    market_score: number;
    competition_score: number;
    feasibility_score: number;
    analysis_text: string;
}

export interface UseGetAnalysisResult {
    isLoading: boolean;
    error: string | null;
    analysis: AnalysisData | null;
    refetch: () => Promise<void>;
    reset: () => void;
}

export function useGetAnalysis(ideaId: string | null): UseGetAnalysisResult {
    const [isLoading, setIsLoading] = useState(!!ideaId);
    const [error, setError] = useState<string | null>(null);
    const [analysis, setAnalysis] = useState<AnalysisData | null>(null);

    const fetchAnalysis = async () => {
        if (!ideaId) {
            setError('No idea ID provided');
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`http://localhost:5000/api/getAnalysis?ideaId=${ideaId}`);

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.error || 'Failed to fetch analysis');
            }

            setAnalysis({
                market_score: result.market_score,
                competition_score: result.competition_score,
                feasibility_score: result.feasibility_score,
                analysis_text: result.analysis_text,
            });
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : 'Unknown error occurred';
            setError(errorMessage);
            console.error('Error fetching analysis:', errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // Auto-fetch when ideaId changes
    useEffect(() => {
        if (ideaId) {
            fetchAnalysis();
        }
    }, [ideaId]);

    const reset = () => {
        setIsLoading(false);
        setError(null);
        setAnalysis(null);
    };

    return {
        isLoading,
        error,
        analysis,
        refetch: fetchAnalysis,
        reset,
    };
}
