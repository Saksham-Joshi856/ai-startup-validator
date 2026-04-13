/**
 * API Route: /api/getIdeas
 * Retrieves all startup ideas for the currently authenticated user
 * 
 * GET endpoint that:
 * 1. Gets current authenticated user
 * 2. Returns error 401 if not authenticated
 * 3. Queries startup_ideas table filtered by user_id
 * 4. Orders results by created_at descending
 * 5. Returns ideas as JSON
 */

import { supabase } from '../lib/supabaseClient';

/**
 * Core business logic for retrieving user's ideas
 */
export async function handleGetIdeas(): Promise<{
    success: boolean;
    data?: any[];
    error?: string;
    count?: number;
}> {
    try {
        console.log('🔐 Attempting to get current user...');

        // Get current authenticated user
        const { data: sessionData, error: sessionError } =
            await supabase.auth.getSession();

        if (sessionError) {
            console.error('Session error:', sessionError.message);
            return {
                success: false,
                error: 'Failed to get session: ' + sessionError.message,
            };
        }

        const user = sessionData?.session?.user;

        if (!user) {
            console.log('❌ No authenticated user found');
            return {
                success: false,
                error: 'User not authenticated. Please sign in first.',
            };
        }

        console.log(`✅ User authenticated: ${user.id}`);
        console.log('📋 Fetching user ideas...');

        // Query startup_ideas table filtered by user_id, ordered by created_at DESC
        const { data: ideas, error: queryError } = await supabase
            .from('startup_ideas')
            .select(
                'id, user_id, idea_text, industry, created_at, updated_at'
            )
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (queryError) {
            console.error('Query error:', queryError.message);
            return {
                success: false,
                error: 'Failed to fetch ideas: ' + queryError.message,
            };
        }

        console.log(`✅ Retrieved ${ideas?.length || 0} ideas`);

        return {
            success: true,
            data: ideas || [],
            count: ideas?.length || 0,
        };
    } catch (exception) {
        const errorMessage =
            exception instanceof Error ? exception.message : 'Unknown error';
        console.error('Exception in handleGetIdeas:', errorMessage);
        return {
            success: false,
            error: errorMessage,
        };
    }
}

/**
 * Vercel Functions / Fetch API handler (for Next.js App Router)
 */
export async function GET(request: Request): Promise<Response> {
    try {
        const result = await handleGetIdeas();

        if (result.success) {
            // Return 200 OK with ideas
            return Response.json(
                {
                    success: true,
                    data: result.data,
                    count: result.count,
                },
                { status: 200 }
            );
        } else if (
            result.error?.includes('authenticated') ||
            result.error?.includes('session')
        ) {
            // Return 401 Unauthorized for auth errors
            return Response.json(
                {
                    success: false,
                    error: result.error,
                },
                { status: 401 }
            );
        } else {
            // Return 400 Bad Request for other errors
            return Response.json(
                {
                    success: false,
                    error: result.error,
                },
                { status: 400 }
            );
        }
    } catch (exception) {
        const errorMessage =
            exception instanceof Error ? exception.message : 'Unknown error';
        console.error('API Error:', errorMessage);

        return Response.json(
            {
                success: false,
                error: errorMessage,
            },
            { status: 500 }
        );
    }
}

/**
 * Express.js middleware handler (if using Express)
 */
export async function getIdeasHandler(req: any, res: any): Promise<void> {
    if (req.method !== 'GET') {
        res.status(405).json({
            success: false,
            error: 'Method not allowed. Use GET.',
        });
        return;
    }

    const result = await handleGetIdeas();

    if (result.success) {
        res.status(200).json({
            success: true,
            data: result.data,
            count: result.count,
        });
    } else if (
        result.error?.includes('authenticated') ||
        result.error?.includes('session')
    ) {
        res.status(401).json({
            success: false,
            error: result.error,
        });
    } else {
        res.status(400).json({
            success: false,
            error: result.error,
        });
    }
}

/**
 * AWS Lambda / Cold start handler (alternative)
 */
export async function getIdeasLambda(event: any): Promise<any> {
    try {
        const result = await handleGetIdeas();

        const statusCode = result.success
            ? 200
            : result.error?.includes('authenticated')
                ? 401
                : 400;

        return {
            statusCode,
            body: JSON.stringify({
                success: result.success,
                data: result.data,
                count: result.count,
                error: result.error,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        };
    } catch (exception) {
        const errorMessage =
            exception instanceof Error ? exception.message : 'Unknown error';
        return {
            statusCode: 500,
            body: JSON.stringify({
                success: false,
                error: errorMessage,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        };
    }
}
