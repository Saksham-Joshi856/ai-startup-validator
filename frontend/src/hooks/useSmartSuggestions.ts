import { useState, useEffect } from 'react';

export interface SmartSuggestion {
    text: string;
    type: 'primary' | 'secondary' | 'tertiary';
    icon: string;
}

export interface UseSmartSuggestionsResult {
    suggestions: SmartSuggestion[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export function useSmartSuggestions(userId: string | null): UseSmartSuggestionsResult {
    const [suggestions, setSuggestions] = useState<SmartSuggestion[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSuggestions = async () => {
        if (!userId) {
            setSuggestions([]);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
            const response = await fetch(`${backendUrl}/api/smart-suggestions?userId=${userId}`);

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();

            if (data.success && data.suggestions) {
                setSuggestions(data.suggestions);
            } else {
                throw new Error(data.error || 'Failed to fetch suggestions');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch suggestions';
            console.error('Error fetching suggestions:', errorMessage);
            setError(errorMessage);
            // Set fallback suggestions on error
            setSuggestions([
                { text: "Validate a new idea", type: "primary", icon: "Lightbulb" },
                { text: "Review past analyses", type: "secondary", icon: "BarChart3" },
                { text: "Get mentor advice", type: "tertiary", icon: "BookOpen" },
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSuggestions();
        // Refresh suggestions every 5 minutes
        const interval = setInterval(fetchSuggestions, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, [userId]);

    return {
        suggestions,
        loading,
        error,
        refetch: fetchSuggestions,
    };
}
