/**
 * Retention Hooks
 * Hooks for fetching user retention and engagement features
 */

import { useState, useEffect } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";
const API_TIMEOUT_MS = 5000;

// Helper function to check if error is timeout error
const isTimeoutError = (err: unknown): boolean => {
    return err instanceof Error && err.message === "Request timeout";
};

// ============================================================================
// useLastAnalyzedIdea - Get user's last analyzed idea
// ============================================================================

export function useLastAnalyzedIdea(userId: string | null) {
    const [idea, setIdea] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) {
            setIdea(null);
            return;
        }

        const fetchLastIdea = async () => {
            setLoading(true);
            setError(null);

            const timeoutId = setTimeout(() => {
                setLoading(false);
            }, API_TIMEOUT_MS);

            try {
                const response = await fetch(
                    `${BACKEND_URL}/api/retention/last-analyzed-idea?userId=${userId}`,
                    {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                    }
                );

                clearTimeout(timeoutId);

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const data = await response.json();

                if (data.success) {
                    setIdea(data.data);
                } else {
                    setError(data.error || "Failed to fetch last analyzed idea");
                }
            } catch (err) {
                clearTimeout(timeoutId);
                if (isTimeoutError(err)) {
                    setError("Request timeout");
                } else {
                    setError(err instanceof Error ? err.message : "Unknown error");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchLastIdea();
    }, [userId]);

    return { idea, loading, error };
}

// ============================================================================
// useEngagementMetrics - Get user's engagement metrics
// ============================================================================

export interface EngagementMetrics {
    totalIdeas: number;
    analyzedIdeas: number;
    engagementScore: number;
}

export function useEngagementMetrics(userId: string | null) {
    const [metrics, setMetrics] = useState<EngagementMetrics | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) {
            setMetrics(null);
            return;
        }

        const fetchMetrics = async () => {
            setLoading(true);
            setError(null);

            const timeoutId = setTimeout(() => {
                setLoading(false);
            }, API_TIMEOUT_MS);

            try {
                const response = await fetch(
                    `${BACKEND_URL}/api/retention/engagement-metrics?userId=${userId}`,
                    {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                    }
                );

                clearTimeout(timeoutId);

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const data = await response.json();

                if (data.success) {
                    setMetrics(data.data);
                } else {
                    setError(data.error || "Failed to fetch engagement metrics");
                }
            } catch (err) {
                clearTimeout(timeoutId);
                if (isTimeoutError(err)) {
                    setError("Request timeout");
                } else {
                    setError(err instanceof Error ? err.message : "Unknown error");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchMetrics();
    }, [userId]);

    return { metrics, loading, error };
}

// ============================================================================
// useRetentionSuggestions - Get retention/engagement suggestions
// ============================================================================

export interface RetentionSuggestion {
    type: string;
    title: string;
    description: string;
    actionText: string;
    actionUrl: string;
    priority: "high" | "medium" | "low";
    icon: string;
}

export function useRetentionSuggestions(userId: string | null) {
    const [suggestions, setSuggestions] = useState<RetentionSuggestion[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) {
            setSuggestions([]);
            return;
        }

        const fetchSuggestions = async () => {
            setLoading(true);
            setError(null);

            const timeoutId = setTimeout(() => {
                setLoading(false);
            }, API_TIMEOUT_MS);

            try {
                const response = await fetch(
                    `${BACKEND_URL}/api/retention/suggestions?userId=${userId}`,
                    {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                    }
                );

                clearTimeout(timeoutId);

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const data = await response.json();

                if (data.success) {
                    setSuggestions(data.suggestions || []);
                } else {
                    setError(data.error || "Failed to fetch suggestions");
                    setSuggestions([]);
                }
            } catch (err) {
                clearTimeout(timeoutId);
                if (isTimeoutError(err)) {
                    setError("Request timeout");
                } else {
                    setError(err instanceof Error ? err.message : "Unknown error");
                }
                setSuggestions([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSuggestions();
    }, [userId]);

    return { suggestions, loading, error };
}

// ============================================================================
// useRetentionFeatures - Combine all retention hooks
// ============================================================================

export function useRetentionFeatures(userId: string | null) {
    const lastIdea = useLastAnalyzedIdea(userId);
    const metrics = useEngagementMetrics(userId);
    const suggestions = useRetentionSuggestions(userId);

    return {
        lastIdea,
        metrics,
        suggestions,
        isLoading: lastIdea.loading || metrics.loading || suggestions.loading,
        hasError: Boolean(lastIdea.error || metrics.error || suggestions.error),
    };
}
