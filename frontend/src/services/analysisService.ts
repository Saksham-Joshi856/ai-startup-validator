import { supabase } from '../lib/supabaseClient';

/**
 * Save analysis results for a startup idea
 * @param ideaId - The UUID of the idea being analyzed
 * @param marketScore - Market opportunity score (0-100)
 * @param competitionScore - Competition intensity score (0-100)
 * @param feasibilityScore - Technical feasibility score (0-100)
 * @param analysisText - Detailed analysis text/feedback
 * @returns Object containing { data, error }
 */
export async function saveIdeaAnalysis(
    ideaId: string,
    marketScore: number,
    competitionScore: number,
    feasibilityScore: number,
    analysisText: string
): Promise<{ data: any; error: string | null }> {
    try {
        // Validate input parameters
        if (!ideaId || marketScore == null || competitionScore == null || feasibilityScore == null || !analysisText) {
            return {
                data: null,
                error: 'Missing required fields: ideaId, marketScore, competitionScore, feasibilityScore, or analysisText',
            };
        }

        // Validate score ranges (0-100)
        if (marketScore < 0 || marketScore > 100) {
            return {
                data: null,
                error: 'marketScore must be between 0 and 100',
            };
        }
        if (competitionScore < 0 || competitionScore > 100) {
            return {
                data: null,
                error: 'competitionScore must be between 0 and 100',
            };
        }
        if (feasibilityScore < 0 || feasibilityScore > 100) {
            return {
                data: null,
                error: 'feasibilityScore must be between 0 and 100',
            };
        }

        // Insert the analysis into idea_analysis table
        const { data, error } = await supabase
            .from('idea_analysis')
            .insert([
                {
                    idea_id: ideaId,
                    market_score: marketScore,
                    competition_score: competitionScore,
                    feasibility_score: feasibilityScore,
                    analysis_text: analysisText,
                },
            ])
            .select()
            .single();

        // Handle insertion errors
        if (error) {
            console.error('Error saving idea analysis:', error.message);
            return {
                data: null,
                error: error.message,
            };
        }

        // Return success with the created analysis data
        return {
            data: data,
            error: null,
        };
    } catch (exception) {
        const errorMessage =
            exception instanceof Error ? exception.message : 'Unknown error occurred';
        console.error('Exception while saving idea analysis:', errorMessage);
        return {
            data: null,
            error: errorMessage,
        };
    }
}

/**
 * Get analysis for a specific idea
 * @param ideaId - The UUID of the idea
 * @returns Object containing { data, error }
 */
export async function getIdeaAnalysis(
    ideaId: string
): Promise<{ data: any; error: string | null }> {
    try {
        if (!ideaId) {
            return {
                data: null,
                error: 'ideaId is required',
            };
        }

        // Fetch analysis for the idea
        const { data, error } = await supabase
            .from('idea_analysis')
            .select('*')
            .eq('idea_id', ideaId)
            .single();

        if (error) {
            console.error('Error fetching idea analysis:', error.message);
            return {
                data: null,
                error: error.message,
            };
        }

        return {
            data: data,
            error: null,
        };
    } catch (exception) {
        const errorMessage =
            exception instanceof Error ? exception.message : 'Unknown error occurred';
        console.error('Exception while fetching idea analysis:', errorMessage);
        return {
            data: null,
            error: errorMessage,
        };
    }
}

/**
 * Update analysis for a startup idea
 * @param ideaId - The UUID of the idea
 * @param updates - Object containing fields to update
 * @returns Object containing { data, error }
 */
export async function updateIdeaAnalysis(
    ideaId: string,
    updates: {
        marketScore?: number;
        competitionScore?: number;
        feasibilityScore?: number;
        analysisText?: string;
    }
): Promise<{ data: any; error: string | null }> {
    try {
        if (!ideaId) {
            return {
                data: null,
                error: 'ideaId is required',
            };
        }

        // Build update object with only provided fields
        const updateData: any = {};
        if (updates.marketScore != null) updateData.market_score = updates.marketScore;
        if (updates.competitionScore != null) updateData.competition_score = updates.competitionScore;
        if (updates.feasibilityScore != null) updateData.feasibility_score = updates.feasibilityScore;
        if (updates.analysisText != null) updateData.analysis_text = updates.analysisText;

        if (Object.keys(updateData).length === 0) {
            return {
                data: null,
                error: 'No fields to update',
            };
        }

        const { data, error } = await supabase
            .from('idea_analysis')
            .update(updateData)
            .eq('idea_id', ideaId)
            .select()
            .single();

        if (error) {
            console.error('Error updating idea analysis:', error.message);
            return {
                data: null,
                error: error.message,
            };
        }

        return {
            data: data,
            error: null,
        };
    } catch (exception) {
        const errorMessage =
            exception instanceof Error ? exception.message : 'Unknown error occurred';
        console.error('Exception while updating idea analysis:', errorMessage);
        return {
            data: null,
            error: errorMessage,
        };
    }
}

/**
 * Delete analysis for a startup idea
 * @param ideaId - The UUID of the idea
 * @returns Object containing { data, error }
 */
export async function deleteIdeaAnalysis(
    ideaId: string
): Promise<{ data: any; error: string | null }> {
    try {
        if (!ideaId) {
            return {
                data: null,
                error: 'ideaId is required',
            };
        }

        const { data, error } = await supabase
            .from('idea_analysis')
            .delete()
            .eq('idea_id', ideaId)
            .select();

        if (error) {
            console.error('Error deleting idea analysis:', error.message);
            return {
                data: null,
                error: error.message,
            };
        }

        return {
            data: data,
            error: null,
        };
    } catch (exception) {
        const errorMessage =
            exception instanceof Error ? exception.message : 'Unknown error occurred';
        console.error('Exception while deleting idea analysis:', errorMessage);
        return {
            data: null,
            error: errorMessage,
        };
    }
}
