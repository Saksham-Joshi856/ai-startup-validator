import { useState, useMemo } from 'react';
import { useGetIdeas } from './useApiCalls';

export interface PersonalizedInsights {
    totalIdeas: number;
    bestIdea: {
        title: string;
        industry: string;
        score: number;
    } | null;
    worstIdea: {
        title: string;
        industry: string;
        score: number;
    } | null;
    averageScore: number;
    scoresTrend: Array<{
        date: string;
        score: number;
        ideaTitle: string;
    }>;
}

export function usePersonalizedInsights(userId: string | null): {
    insights: PersonalizedInsights;
    loading: boolean;
} {
    const { ideas, loading } = useGetIdeas(userId);

    const insights = useMemo(() => {
        const defaultInsights: PersonalizedInsights = {
            totalIdeas: 0,
            bestIdea: null,
            worstIdea: null,
            averageScore: 0,
            scoresTrend: [],
        };

        if (!ideas || ideas.length === 0) {
            return defaultInsights;
        }

        // Calculate total ideas
        const totalIdeas = ideas.length;

        // Calculate average score and find best/worst
        let totalScore = 0;
        let bestIdea = null;
        let worstIdea = null;
        let bestScore = -Infinity;
        let worstScore = Infinity;

        const scoresTrend = ideas
            .map((idea) => {
                const score = idea._analysis
                    ? Math.round(
                        (idea._analysis.market_score +
                            (100 - idea._analysis.competition_score) +
                            idea._analysis.feasibility_score) /
                        3
                    )
                    : 0;

                totalScore += score;

                if (score > bestScore) {
                    bestScore = score;
                    bestIdea = {
                        title: idea.title || idea.idea_text?.substring(0, 50) || 'Untitled',
                        industry: idea.industry,
                        score,
                    };
                }

                if (score < worstScore && score > 0) {
                    worstScore = score;
                    worstIdea = {
                        title: idea.title || idea.idea_text?.substring(0, 50) || 'Untitled',
                        industry: idea.industry,
                        score,
                    };
                }

                return {
                    date: new Date(idea.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                    }),
                    score,
                    ideaTitle: idea.title || idea.idea_text?.substring(0, 30) || 'Idea',
                };
            })
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        const averageScore = totalIdeas > 0 ? Math.round(totalScore / totalIdeas) : 0;

        return {
            totalIdeas,
            bestIdea: bestScore > 0 ? bestIdea : null,
            worstIdea: worstScore < Infinity && worstScore > 0 ? worstIdea : null,
            averageScore,
            scoresTrend,
        };
    }, [ideas]);

    return {
        insights,
        loading,
    };
}
