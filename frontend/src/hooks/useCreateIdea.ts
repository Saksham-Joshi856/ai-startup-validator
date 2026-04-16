import { useState } from 'react';

/**
 * Custom hook for creating startup ideas via API
 * Handles loading state, error handling, and response management
 */
export function useCreateIdea() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Create a startup idea
     * @param ideaText - The description/text of the idea
     * @param industry - The industry category for the idea
     * @returns Promise with the created idea data or error
     */
    const createIdea = async (
        ideaText: string,
        industry: string
    ): Promise<{ success: boolean; data?: any; error?: string }> => {
        setIsLoading(true);
        setError(null);

        try {
            // Validate inputs
            if (!ideaText || !industry) {
                const errorMsg = 'Please provide both idea text and industry';
                setError(errorMsg);
                return {
                    success: false,
                    error: errorMsg,
                };
            }

            // Make API request to createIdea endpoint
            // This can be adapted to your API route setup
            const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
            const response = await fetch(`${backendUrl}/api/createIdea`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ideaText,
                    industry,
                }),
            });

            // Parse response
            const result = await response.json();

            // Handle API errors
            if (!response.ok) {
                const errorMsg = result.error || 'Failed to create idea';
                setError(errorMsg);
                return {
                    success: false,
                    error: errorMsg,
                };
            }

            // Return success response
            return {
                success: true,
                data: result.data,
            };
        } catch (err) {
            const errorMsg =
                err instanceof Error ? err.message : 'An error occurred';
            setError(errorMsg);
            return {
                success: false,
                error: errorMsg,
            };
        } finally {
            setIsLoading(false);
        }
    };

    return {
        createIdea,
        isLoading,
        error,
    };
}
