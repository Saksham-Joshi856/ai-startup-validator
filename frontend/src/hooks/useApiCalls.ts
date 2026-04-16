/**
 * Custom React Hooks for API calls
 * Used across the application for data fetching
 */

import { useState, useEffect } from 'react';
import { ideaApi, insightsApi, dashboardApi, advisorApi } from '@/services/apiClient';

// ============================================================================
// useGetIdeas - Fetch all ideas for a user
// ============================================================================

export function useGetIdeas(userId: string | null) {
    const [ideas, setIdeas] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) return;

        const fetchIdeas = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await ideaApi.getIdeas(userId);
                if (response.success) {
                    setIdeas(response.data || []);
                } else {
                    setError(response.error || 'Failed to fetch ideas');
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        fetchIdeas();
    }, [userId]);

    return { ideas, loading, error, refetch: () => userId && ideaApi.getIdeas(userId) };
}

// ============================================================================
// useGetAnalysis - Fetch analysis for a specific idea
// ============================================================================

export function useGetAnalysis(ideaId: string | null) {
    const [analysis, setAnalysis] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!ideaId) return;

        const fetchAnalysis = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await ideaApi.getAnalysis(ideaId);
                if (response.success) {
                    setAnalysis(response.data);
                } else {
                    setError(response.error || 'Failed to fetch analysis');
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        fetchAnalysis();
    }, [ideaId]);

    return { analysis, loading, error };
}

// ============================================================================
// useInsights - Fetch user insights/analytics
// ============================================================================

export function useInsights(userId: string | null) {
    const [insights, setInsights] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) return;

        const fetchInsights = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await insightsApi.getInsights(userId);
                if (response.success) {
                    setInsights(response.data);
                } else {
                    setError(response.error || 'Failed to fetch insights');
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        fetchInsights();
    }, [userId]);

    return { insights, loading, error };
}

// ============================================================================
// useDashboardStats - Fetch dashboard statistics
// ============================================================================

export function useDashboardStats(userId: string | null) {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) return;

        const fetchStats = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await dashboardApi.getStats(userId);
                if (response.success) {
                    setStats(response.data);
                } else {
                    setError(response.error || 'Failed to fetch stats');
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [userId]);

    return { stats, loading, error };
}

// ============================================================================
// useAIAdvisor - Send message to AI advisor
// ============================================================================

export function useAIAdvisor() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const sendMessage = async (userId: string, message: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await advisorApi.sendMessage(userId, message);
            if (response.success) {
                return response.data?.response || 'No response received';
            } else {
                setError(response.error || 'Failed to send message');
                return null;
            }
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Unknown error';
            setError(errorMsg);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { sendMessage, loading, error };
}
