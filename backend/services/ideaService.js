import { getSupabaseClient } from '../config/supabaseClient.js';

/**
 * Create a new startup idea
 * @param userId - The UUID of the user creating the idea
 * @param ideaText - The description/text of the idea
 * @param industry - The industry category for the idea
 * @returns Object containing { data, error }
 */
export async function createStartupIdea(userId, ideaText, industry) {
    try {
        // Validate input parameters
        if (!userId || !ideaText || !industry) {
            console.error('❌ [ideaService] Validation failed:');
            console.error(`   userId: ${userId ? '✓' : '✗ MISSING'}`);
            console.error(`   ideaText: ${ideaText ? '✓' : '✗ MISSING'}`);
            console.error(`   industry: ${industry ? '✓' : '✗ MISSING'}`);
            return {
                data: null,
                error: 'Missing required fields: userId, ideaText, or industry',
            };
        }

        console.log(`\n📝 [ideaService.createStartupIdea] Inserting new idea...`);
        console.log(`   User ID (will be stored as user_id): ${userId}`);
        console.log(`   Idea: "${ideaText.substring(0, 60)}..."`);
        console.log(`   Industry: ${industry}`);

        // Insert the new idea into startup_ideas table
        const supabase = getSupabaseClient();
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
            console.error(`❌ [ideaService] Error creating startup idea:`, error.message);
            return {
                data: null,
                error: error.message,
            };
        }

        // Verify that data was inserted with correct user_id
        console.log(`✅ [ideaService] Idea successfully inserted into database`);
        console.log(`   Inserted ID: ${data.id}`);
        console.log(`   Stored user_id: ${data.user_id}`);
        console.log(`   Created at: ${data.created_at}`);
        console.log(`   Verification: user_id matches input? ${data.user_id === userId ? '✓ YES' : '✗ NO - MISMATCH!'}`);

        // Return success with the created idea data
        return {
            data: data,
            error: null,
        };
    } catch (exception) {
        const errorMessage =
            exception instanceof Error ? exception.message : 'Unknown error occurred';
        console.error(`❌ [ideaService] Exception while creating startup idea:`, errorMessage);
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
export async function getUserStartupIdeas(userId) {
    try {
        if (!userId) {
            return {
                data: null,
                error: 'userId is required',
            };
        }

        // Fetch all ideas for the user
        const supabase = getSupabaseClient();
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
 * Get all startup ideas (no user filter)
 * @returns Object containing { data, error }
 */
export async function getAllStartupIdeas() {
    try {
        // Query startup_ideas table
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
            .from('startup_ideas')
            .select('*')
            .order('created_at', { ascending: false });

        // Handle query errors
        if (error) {
            console.error('Error fetching all ideas:', error.message);
            return {
                data: null,
                error: error.message,
            };
        }

        // Return success with ideas array
        return {
            data: data,
            error: null,
        };
    } catch (exception) {
        const errorMessage =
            exception instanceof Error ? exception.message : 'Unknown error occurred';
        console.error('Exception while fetching all ideas:', errorMessage);
        return {
            data: null,
            error: errorMessage,
        };
    }
}

/**
 * Get a specific startup idea by ID
 * @param ideaId - The UUID of the idea
 * @returns Object containing { data, error }
 */
export async function getStartupIdeaById(ideaId) {
    try {
        if (!ideaId) {
            return {
                data: null,
                error: 'ideaId is required',
            };
        }

        // Query startup_ideas table by id
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
            .from('startup_ideas')
            .select('*')
            .eq('id', ideaId)
            .single();

        if (error) {
            console.error('Error fetching idea by ID:', error.message);
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
        console.error('Exception while fetching idea by ID:', errorMessage);
        return {
            data: null,
            error: errorMessage,
        };
    }
}
