/**
 * API Route: /api/analyzeIdea
 * Analyzes a startup idea using AI and stores the results
 * 
 * POST endpoint that:
 * 1. Extracts ideaText and industry from request body
 * 2. Gets current authenticated user
 * 3. Calls createAndAnalyzeIdea pipeline
 * 4. Returns analysis results
 */

import { supabase } from '../lib/supabaseClient';
import { createAndAnalyzeIdea } from '../services/ideaPipelineService';

/**
 * Core business logic for analyzing an idea
 */
export async function handleAnalyzeIdea(
    ideaText: string,
    industry: string
): Promise<{
    success: boolean;
    data?: any;
    error?: string;
}> {
    try {
        // Validate input
        if (!ideaText || !industry) {
            return {
                success: false,
                error: 'Missing required fields: ideaText or industry',
            };
        }

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
        console.log(`📝 Analyzing idea: "${ideaText}" in ${industry}`);

        // Call the pipeline to create idea, analyze, and store
        const result = await createAndAnalyzeIdea(user.id, ideaText, industry);

        if (result.error) {
            console.error('Pipeline error:', result.error);
            return {
                success: false,
                error: result.error,
            };
        }

        console.log('✅ Analysis completed successfully');
        return {
            success: true,
            data: {
                idea: result.idea,
                analysis: result.analysis,
            },
        };
    } catch (exception) {
        const errorMessage =
            exception instanceof Error ? exception.message : 'Unknown error';
        console.error('Exception in handleAnalyzeIdea:', errorMessage);
        return {
            success: false,
            error: errorMessage,
        };
    }
}

/**
 * Express.js middleware handler (if using Express)
 */
export async function analyzeIdeaHandler(req: any, res: any): Promise<void> {
    if (req.method !== 'POST') {
        res.status(405).json({
            success: false,
            error: 'Method not allowed. Use POST.',
        });
        return;
    }

    const { ideaText, industry } = req.body;

    const result = await handleAnalyzeIdea(ideaText, industry);

    if (result.success) {
        res.status(200).json(result);
    } else {
        res.status(400).json(result);
    }
}

/**
 * Vercel Functions / Fetch API handler (for Next.js App Router)
 */
export async function POST(request: Request): Promise<Response> {
    try {
        // Parse request body
        let body;
        try {
            body = await request.json();
        } catch (e) {
            return Response.json(
                {
                    success: false,
                    error: 'Invalid JSON in request body',
                },
                { status: 400 }
            );
        }

        const { ideaText, industry } = body;

        // Call business logic
        const result = await handleAnalyzeIdea(ideaText, industry);

        // Return response
        if (result.success) {
            return Response.json(result, { status: 200 });
        } else {
            return Response.json(result, { status: 400 });
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
 * AWS Lambda / Cold start handler (alternative)
 */
export async function analyzeIdeaLambda(event: any): Promise<any> {
    try {
        const { ideaText, industry } = JSON.parse(event.body || '{}');

        const result = await handleAnalyzeIdea(ideaText, industry);

        return {
            statusCode: result.success ? 200 : 400,
            body: JSON.stringify(result),
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
