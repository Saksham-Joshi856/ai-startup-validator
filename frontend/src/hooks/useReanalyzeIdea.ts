import { useState } from 'react';

export interface UseReanalyzeIdeaResult {
    reanalyze: (ideaId: string, userId: string) => Promise<boolean>;
    loading: boolean;
    error: string | null;
}

export function useReanalyzeIdea(): UseReanalyzeIdeaResult {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const reanalyze = async (ideaId: string, userId: string): Promise<boolean> => {
        if (!ideaId || !userId) {
            setError('Missing ideaId or userId');
            return false;
        }

        setLoading(true);
        setError(null);

        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
            const response = await fetch(`${backendUrl}/api/reanalyzeIdea`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ideaId,
                    userId,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || `API error: ${response.status}`);
            }

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Failed to re-analyze idea');
            }

            return true;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to re-analyze idea';
            console.error('Error re-analyzing idea:', errorMessage);
            setError(errorMessage);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        reanalyze,
        loading,
        error,
    };
}
