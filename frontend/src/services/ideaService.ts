import { supabase } from '../lib/supabaseClient';

/**
 * Create a new startup idea
 * @param userId - The UUID of the user creating the idea
 * @param ideaText - The description/text of the idea
 * @param industry - The industry category for the idea
 * @returns Object containing { data, error }
 */
export async function createStartupIdea(
    userId: string,
    ideaText: string,
    industry: string
): Promise<{ data: any; error: string | null }> {
    try {
        // Validate input parameters
        if (!userId || !ideaText || !industry) {
            return {
                data: null,
                error: 'Missing required fields: userId, ideaText, or industry',
            };
        }

        // Insert the new idea into startup_ideas table
        const { data, error } = await supabase
            .from('startup_ideas')
            .insert([
                {
                    user_id: userId,
                    idea_text: ideaText,
                    industry: industry,
                    created_at: new Date().toISOString(),
                },
            ])
            .select()
            .single();

        // Handle insertion errors
        if (error) {
            console.error('Error creating startup idea:', error.message);
            return {
                data: null,
                error: error.message,
            };
        }

        // Return success with the created idea data
        return {
            data: data,
            error: null,
        };
    } catch (exception) {
        const errorMessage =
            exception instanceof Error ? exception.message : 'Unknown error occurred';
        console.error('Exception while creating startup idea:', errorMessage);
        return {
            data: null,
            error: errorMessage,
        };
    }
}

/**
 * Get all startup ideas for a specific user
 * @param userId - The UUID of the user
 * @returns Object containing { data, error }
 */
export async function getUserStartupIdeas(
    userId: string
): Promise<{ data: any; error: string | null }> {
    try {
        if (!userId) {
            return {
                data: null,
                error: 'userId is required',
            };
        }

        // Fetch all ideas for the user
        const { data, error } = await supabase
            .from('startup_ideas')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching user ideas:', error.message);
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
        console.error('Exception while fetching user ideas:', errorMessage);
        return {
            data: null,
            error: errorMessage,
        };
    }
}

/**
 * Get all startup ideas for a specific user (simplified version)
 * @param userId - The UUID of the user
 * @returns Object containing { data, error }
 */
export async function getUserIdeas(
    userId: string
): Promise<{ data: any; error: any }> {
    try {
        // Validate userId parameter
        if (!userId) {
            return {
                data: null,
                error: 'userId is required',
            };
        }

        // Query startup_ideas table
        const { data, error } = await supabase
            .from('startup_ideas')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        // Handle query errors
        if (error) {
            console.error('Error fetching user ideas:', error.message);
            return {
                data: null,
                error: error,
            };
        }

        // Return success with ideas data
        return {
            data: data,
            error: null,
        };
    } catch (exception) {
        const errorMessage =
            exception instanceof Error ? exception.message : 'Unknown error occurred';
        console.error('Exception while fetching user ideas:', errorMessage);
        return {
            data: null,
            error: exception,
        };
    }
}

/**
 * Update a startup idea
 * @param ideaId - The ID of the idea to update
 * @param userId - The UUID of the user (for verification)
 * @param updates - Object containing fields to update (ideaText, industry, etc.)
 * @returns Object containing { data, error }
 */
export async function updateStartupIdea(
    ideaId: string,
    userId: string,
    updates: { ideaText?: string; industry?: string }
): Promise<{ data: any; error: string | null }> {
    try {
        if (!ideaId || !userId) {
            return {
                data: null,
                error: 'Missing required fields: ideaId or userId',
            };
        }

        // RLS policy will ensure user can only update their own ideas
        const { data, error } = await supabase
            .from('startup_ideas')
            .update({
                idea_text: updates.ideaText,
                industry: updates.industry,
                updated_at: new Date().toISOString(),
            })
            .eq('id', ideaId)
            .eq('user_id', userId)
            .select();

        if (error) {
            console.error('Error updating startup idea:', error.message);
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
        console.error('Exception while updating startup idea:', errorMessage);
        return {
            data: null,
            error: errorMessage,
        };
    }
}

/**
 * Delete a startup idea
 * @param ideaId - The ID of the idea to delete
 * @param userId - The UUID of the user (for verification)
 * @returns Object containing { data, error }
 */
export async function deleteStartupIdea(
    ideaId: string,
    userId: string
): Promise<{ data: any; error: string | null }> {
    try {
        if (!ideaId || !userId) {
            return {
                data: null,
                error: 'Missing required fields: ideaId or userId',
            };
        }

        // RLS policy will ensure user can only delete their own ideas
        const { data, error } = await supabase
            .from('startup_ideas')
            .delete()
            .eq('id', ideaId)
            .eq('user_id', userId)
            .select();

        if (error) {
            console.error('Error deleting startup idea:', error.message);
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
        console.error('Exception while deleting startup idea:', errorMessage);
        return {
            data: null,
            error: errorMessage,
        };
    }
}
