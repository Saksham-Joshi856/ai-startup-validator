/**
 * API Client Service Layer
 * Centralized API calls for the entire app
 * Uses fetch API with error handling
 */

// Use VITE_BACKEND_URL from environment, with fallback to empty string for development proxy
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || '';

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const error = await response.json().catch(() => ({
            error: `HTTP ${response.status}`,
        }));
        throw new Error(error.error || `API Error: ${response.status}`);
    }
    return response.json();
}

// ============================================================================
// IDEA ANALYSIS API
// ============================================================================

export const ideaApi = {
    /**
     * Analyze a startup idea
     * POST /api/analyzeIdea
     */
    async analyzeIdea(
        userId: string,
        ideaText: string,
        industry: string
    ): Promise<ApiResponse<{ idea: any; analysis: any }>> {
        const response = await fetch(`${API_BASE_URL}/api/analyzeIdea`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, ideaText, industry }),
        });
        return handleResponse(response);
    },

    /**
     * Get all ideas for a user
     * GET /api/get-ideas?userId=...
     */
    async getIdeas(userId: string): Promise<ApiResponse<any[]>> {
        const response = await fetch(
            `${API_BASE_URL}/api/get-ideas?userId=${userId}`
        );
        return handleResponse(response);
    },

    /**
     * Get analysis for a specific idea
     * GET /api/get-analysis?ideaId=...
     */
    async getAnalysis(ideaId: string): Promise<ApiResponse<any>> {
        const response = await fetch(
            `${API_BASE_URL}/api/get-analysis?ideaId=${ideaId}`
        );
        return handleResponse(response);
    },

    /**
     * Get all user ideas (alternative endpoint name)
     * GET /api/getIdeas
     */
    async getUserIdeas(userId: string): Promise<ApiResponse<any[]>> {
        const response = await fetch(`${API_BASE_URL}/api/getIdeas`);
        return handleResponse(response);
    },
};

// ============================================================================
// INSIGHTS API
// ============================================================================

export const insightsApi = {
    /**
     * Get user insights/analytics
     * GET /api/insights?userId=...
     */
    async getInsights(userId: string): Promise<
        ApiResponse<{
            avg_market_score: number;
            avg_competition_score: number;
            avg_feasibility_score: number;
            total_ideas: number;
        }>
    > {
        const response = await fetch(
            `${API_BASE_URL}/api/insights?userId=${userId}`
        );
        return handleResponse(response);
    },
};

// ============================================================================
// DASHBOARD API
// ============================================================================

export const dashboardApi = {
    /**
     * Get dashboard statistics for user
     * GET /api/dashboard-stats?userId=...
     */
    async getStats(userId: string): Promise<
        ApiResponse<{
            total_ideas: number;
            avg_score: number;
            success_rate: number;
        }>
    > {
        const response = await fetch(
            `${API_BASE_URL}/api/dashboard-stats?userId=${userId}`
        );
        return handleResponse(response);
    },
};

// ============================================================================
// AI ADVISOR API
// ============================================================================

export const advisorApi = {
    /**
     * Send message to AI advisor
     * POST /api/ai-advisor
     */
    async sendMessage(
        userId: string,
        message: string
    ): Promise<ApiResponse<{ response: string }>> {
        const response = await fetch(`${API_BASE_URL}/api/ai-advisor`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, message }),
        });
        return handleResponse(response);
    },
};

// ============================================================================
// HEALTH CHECK
// ============================================================================

export const healthApi = {
    /**
     * Check if backend is running
     * GET /api/test
     */
    async checkHealth(): Promise<{ message: string }> {
        return fetch(`${API_BASE_URL}/api/test`).then((res) => res.json());
    },
};

// ============================================================================
// BATCH API UTILITIES
// ============================================================================

/**
 * Fetch multiple resources in parallel
 */
export async function fetchMultiple<T extends Record<string, Promise<any>>>(
    requests: T
): Promise<T> {
    const results = await Promise.all(Object.values(requests));
    const keys = Object.keys(requests);
    return keys.reduce(
        (acc, key, idx) => {
            acc[key as keyof T] = results[idx];
            return acc;
        },
        {} as T
    );
}

export default {
    ideaApi,
    insightsApi,
    dashboardApi,
    advisorApi,
    healthApi,
    fetchMultiple,
};
