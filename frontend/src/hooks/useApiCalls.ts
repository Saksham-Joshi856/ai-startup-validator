/**
 * Custom React Hooks for API calls
 * Used across the application for data fetching
 * Includes timeout handling and error tracking
 */

import { useState, useEffect } from 'react';
import { ideaApi, insightsApi, dashboardApi, advisorApi } from '@/services/apiClient';
import { isTimeoutError } from '@/lib/timeoutUtils';

const API_TIMEOUT_MS = 5000; // 5 seconds timeout

// ============================================================================
// useGetIdeas - Fetch all ideas for a user
// ============================================================================

export function useGetIdeas(userId: string | null) {
    const [ideas, setIdeas] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isTimeout, setIsTimeout] = useState(false);

    const fetchIdeas = async () => {
        if (!userId) {
            console.warn('useGetIdeas: userId is null, skipping fetch');
            return;
        }

        console.log(`🔄 [useGetIdeas] Fetching ideas for userId: ${userId}`);
        setLoading(true);
        setError(null);
        setIsTimeout(false);

        const timeoutId = setTimeout(() => {
            console.warn(`⏱️ [useGetIdeas] Request timeout after ${API_TIMEOUT_MS}ms`);
            setIsTimeout(true);
            setLoading(false);
        }, API_TIMEOUT_MS);

        try {
            const response = await ideaApi.getIdeas(userId);
            clearTimeout(timeoutId);

            if (response.success) {
                console.log(`✅ [useGetIdeas] Successfully fetched ${response.data?.length || 0} ideas`);
                if (response.data && response.data.length > 0) {
                    console.log(`   First idea:`, response.data[0]);
                }
                setIdeas(response.data || []);
                setIsTimeout(false);
            } else {
                const errorMsg = response.error || 'Failed to fetch ideas';
                console.error(`❌ [useGetIdeas] Error:`, errorMsg);
                setError(errorMsg);
            }
        } catch (err) {
            clearTimeout(timeoutId);
            if (isTimeoutError(err)) {
                console.warn(`⏱️ [useGetIdeas] Timeout error`);
                setIsTimeout(true);
                setError('Server is slow. Data will load when ready.');
            } else {
                const errorMsg = err instanceof Error ? err.message : 'Unknown error';
                console.error(`❌ [useGetIdeas] Exception:`, errorMsg);
                setError(errorMsg);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIdeas();
    }, [userId]);

    return { ideas, loading, error, isTimeout, refetch: fetchIdeas };
}

// ============================================================================
// useGetAnalysis - Fetch analysis for a specific idea
// ============================================================================

export function useGetAnalysis(ideaId: string | null) {
    const [analysis, setAnalysis] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isTimeout, setIsTimeout] = useState(false);

    useEffect(() => {
        if (!ideaId) return;

        const fetchAnalysis = async () => {
            setLoading(true);
            setError(null);
            setIsTimeout(false);

            const timeoutId = setTimeout(() => {
                setIsTimeout(true);
                setLoading(false);
            }, API_TIMEOUT_MS);

            try {
                const response = await ideaApi.getAnalysis(ideaId);
                clearTimeout(timeoutId);
                if (response.success) {
                    setAnalysis(response.data);
                    setIsTimeout(false);
                } else {
                    setError(response.error || 'Failed to fetch analysis');
                }
            } catch (err) {
                clearTimeout(timeoutId);
                if (isTimeoutError(err)) {
                    setIsTimeout(true);
                    setError('Analysis is being generated. Please wait...');
                } else {
                    setError(err instanceof Error ? err.message : 'Unknown error');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchAnalysis();
    }, [ideaId]);

    return { analysis, loading, error, isTimeout };
}

// ============================================================================
// useInsights - Fetch user insights/analytics
// ============================================================================

export function useInsights(userId: string | null) {
    const [insights, setInsights] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isTimeout, setIsTimeout] = useState(false);

    useEffect(() => {
        if (!userId) return;

        const fetchInsights = async () => {
            setLoading(true);
            setError(null);
            setIsTimeout(false);

            const timeoutId = setTimeout(() => {
                setIsTimeout(true);
                setLoading(false);
            }, API_TIMEOUT_MS);

            try {
                const response = await insightsApi.getInsights(userId);
                clearTimeout(timeoutId);
                if (response.success) {
                    setInsights(response.data);
                    setIsTimeout(false);
                } else {
                    setError(response.error || 'Failed to fetch insights');
                }
            } catch (err) {
                clearTimeout(timeoutId);
                if (isTimeoutError(err)) {
                    setIsTimeout(true);
                    setError('Insights are loading. Please wait...');
                } else {
                    setError(err instanceof Error ? err.message : 'Unknown error');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchInsights();
    }, [userId]);

    return { insights, loading, error, isTimeout };
}

// ============================================================================
// useDashboardStats - Fetch dashboard statistics
// ============================================================================

export function useDashboardStats(userId: string | null) {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isTimeout, setIsTimeout] = useState(false);

    const fetchStats = async () => {
        if (!userId) return;

        setLoading(true);
        setError(null);
        setIsTimeout(false);

        const timeoutId = setTimeout(() => {
            setIsTimeout(true);
            setLoading(false);
        }, API_TIMEOUT_MS);

        try {
            const response = await dashboardApi.getStats(userId);
            clearTimeout(timeoutId);
            if (response.success) {
                setStats(response.data);
                setIsTimeout(false);
            } else {
                setError(response.error || 'Failed to fetch stats');
            }
        } catch (err) {
            clearTimeout(timeoutId);
            if (isTimeoutError(err)) {
                setIsTimeout(true);
                setError('Stats are loading. Please wait...');
            } else {
                setError(err instanceof Error ? err.message : 'Unknown error');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, [userId]);

    return { stats, loading, error, isTimeout, refetch: fetchStats };
}

// ============================================================================
// useAIAdvisor - Send message to AI advisor
// ============================================================================

export function useAIAdvisor() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isTimeout, setIsTimeout] = useState(false);

    const sendMessage = async (userId: string, message: string) => {
        console.log('\n🤖 [useAIAdvisor] Sending message to AI advisor');
        console.log(`   User ID: ${userId}`);
        console.log(`   Message: ${message.substring(0, 50)}...`);

        setLoading(true);
        setError(null);
        setIsTimeout(false);

        const timeoutId = setTimeout(() => {
            console.warn('⚠️  [useAIAdvisor] Request timeout');
            setIsTimeout(true);
            setLoading(false);
            setError('AI is thinking... This may take a moment.');
        }, API_TIMEOUT_MS);

        try {
            console.log('   📡 Calling API...');
            const response = await advisorApi.sendMessage(userId, message);

            clearTimeout(timeoutId);

            if (response.success && response.data?.reply) {
                console.log('✅ [useAIAdvisor] Received AI response');
                setIsTimeout(false);
                const reply = response.data.reply;
                console.log(`   Reply: ${reply.substring(0, 50)}...`);
                return reply;
            } else {
                const errorMsg = response.error || 'Failed to send message';
                console.error('❌ [useAIAdvisor] API error:', errorMsg);
                setError(errorMsg);
                return null;
            }
        } catch (err) {
            clearTimeout(timeoutId);
            if (isTimeoutError(err)) {
                console.warn('⚠️  [useAIAdvisor] Timeout error');
                setIsTimeout(true);
                setError('AI is thinking... This may take a moment.');
            } else {
                const errorMsg = err instanceof Error ? err.message : 'Unknown error';
                console.error('❌ [useAIAdvisor] Exception:', errorMsg);
                setError('AI is unavailable, try again');
            }
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { sendMessage, loading, error, isTimeout };
}
