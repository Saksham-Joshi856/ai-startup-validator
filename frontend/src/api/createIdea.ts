import { createStartupIdea } from '../services/ideaService';
import { supabase } from '../lib/supabaseClient';

/**
 * API Route Handler for creating a new startup idea
 * POST /api/createIdea
 *
 * Request body:
 * {
 *   ideaText: string,
 *   industry: string
 * }
 *
 * Response:
 * {
 *   success: boolean,
 *   data?: any,
 *   error?: string
 * }
 */
export async function handleCreateIdea(
    ideaText: string,
    industry: string
): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
        // Validate input parameters
        if (!ideaText || !industry) {
            return {
                success: false,
                error: 'Missing required fields: ideaText and industry',
            };
        }

        // Get the currently authenticated user
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        // Check if user is authenticated
        if (authError || !user) {
            console.error('Authentication error:', authError?.message);
            return {
                success: false,
                error:
                    authError?.message ||
                    'User not authenticated. Please login to create ideas.',
            };
        }

        console.log(`Creating idea for user: ${user.id}`);

        // Call the createStartupIdea service function
        const { data, error } = await createStartupIdea(
            user.id,
            ideaText,
            industry
        );

        // Handle service errors
        if (error) {
            console.error('Error creating startup idea:', error);
            return {
                success: false,
                error: typeof error === 'string' ? error : `Failed to create idea`,
            };
        }

        // Return success response with created idea data
        console.log('Idea created successfully:', data);
        return {
            success: true,
            data: data,
        };
    } catch (exception) {
        const errorMessage =
            exception instanceof Error ? exception.message : 'Unknown error occurred';
        console.error('Exception in createIdea handler:', errorMessage);
        return {
            success: false,
            error: errorMessage,
        };
    }
}

/**
 * Express.js style middleware handler
 * Can be used with app.post('/api/createIdea', createIdeaHandler)
 */
export async function createIdeaHandler(
    req: any,
    res: any
): Promise<void> {
    try {
        // Validate request method
        if (req.method !== 'POST') {
            res.status(405).json({ error: 'Method not allowed' });
            return;
        }

        // Extract request body
        const { ideaText, industry } = req.body;

        // Call the handler function
        const result = await handleCreateIdea(ideaText, industry);

        // Return response
        if (result.success) {
            res.status(201).json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : 'Unknown error';
        console.error('Error in createIdeaHandler:', errorMessage);
        res.status(500).json({
            success: false,
            error: errorMessage,
        });
    }
}

/**
 * Fetch API style handler
 * Can be used with handlers like Vercel Functions or similar
 */
export async function POST(
    request: Request
): Promise<Response> {
    try {
        // Parse request body
        const body = await request.json();
        const { ideaText, industry } = body;

        // Call the handler function
        const result = await handleCreateIdea(ideaText, industry);

        // Return response
        if (result.success) {
            return new Response(JSON.stringify(result), {
                status: 201,
                headers: { 'Content-Type': 'application/json' },
            });
        } else {
            return new Response(JSON.stringify(result), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : 'Unknown error';
        console.error('Error in POST handler:', errorMessage);
        return new Response(
            JSON.stringify({
                success: false,
                error: errorMessage,
            }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
}
