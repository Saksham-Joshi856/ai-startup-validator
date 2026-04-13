/**
 * API Route: /api/getAnalysis
 * Retrieves AI analysis for a specific startup idea
 * 
 * GET endpoint that:
 * 1. Accepts query parameter: ideaId
 * 2. Queries idea_analysis table filtered by idea_id
 * 3. Returns analysis data (scores and text)
 * 4. Handles errors properly
 */

import { supabase } from '../lib/supabaseClient';

/**
 * Core business logic for retrieving analysis for an idea
 */
export async function handleGetAnalysis(ideaId: string): Promise<{
    success: boolean;
    data?: any;
    error?: string;
}> {
    try {
        // Validate ideaId parameter
        if (!ideaId || ideaId.trim() === '') {
            console.log('❌ Missing ideaId parameter');
            return {
                success: false,
                error: 'Missing required parameter: ideaId',
            };
        }

        console.log(`📊 Fetching analysis for idea: ${ideaId}`);

        // Query idea_analysis table by idea_id
        const { data: analysis, error: queryError } = await supabase
            .from('idea_analysis')
            .select(
                'id, idea_id, market_score, competition_score, feasibility_score, analysis_text, created_at, updated_at'
            )
            .eq('idea_id', ideaId)
            .single();

        if (queryError) {
            // Handle "not found" case separately
            if (queryError.code === 'PGRST116') {
                console.log(`⚠️  No analysis found for idea: ${ideaId}`);
                return {
                    success: false,
                    error: `No analysis found for idea ${ideaId}`,
                };
            }

            console.error('Query error:', queryError.message);
            return {
                success: false,
                error: 'Failed to fetch analysis: ' + queryError.message,
            };
        }

        if (!analysis) {
            console.log(`⚠️  Analysis not found for idea: ${ideaId}`);
            return {
                success: false,
                error: `No analysis found for idea ${ideaId}`,
            };
        }

        console.log(`✅ Analysis retrieved for idea: ${ideaId}`);

        return {
            success: true,
            data: analysis,
        };
    } catch (exception) {
        const errorMessage =
            exception instanceof Error ? exception.message : 'Unknown error';
        console.error('Exception in handleGetAnalysis:', errorMessage);
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
        // Extract query parameter from URL
        const url = new URL(request.url);
        const ideaId = url.searchParams.get('ideaId');

        const result = await handleGetAnalysis(ideaId || '');

        if (result.success) {
            return Response.json(
                {
                    success: true,
                    data: result.data,
                },
                { status: 200 }
            );
        } else if (result.error?.includes('Missing')) {
            return Response.json(
                {
                    success: false,
                    error: result.error,
                },
                { status: 400 }
            );
        } else if (result.error?.includes('No analysis found')) {
            return Response.json(
                {
                    success: false,
                    error: result.error,
                },
                { status: 404 }
            );
        } else {
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
export async function getAnalysisHandler(req: any, res: any): Promise<void> {
    if (req.method !== 'GET') {
        res.status(405).json({
            success: false,
            error: 'Method not allowed. Use GET.',
        });
        return;
    }

    const ideaId = req.query.ideaId || '';
    const result = await handleGetAnalysis(ideaId);

    if (result.success) {
        res.status(200).json({
            success: true,
            data: result.data,
        });
    } else if (result.error?.includes('Missing')) {
        res.status(400).json({
            success: false,
            error: result.error,
        });
    } else if (result.error?.includes('No analysis found')) {
        res.status(404).json({
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
export async function getAnalysisLambda(event: any): Promise<any> {
    try {
        const ideaId = event.queryStringParameters?.ideaId || '';
        const result = await handleGetAnalysis(ideaId);

        let statusCode = result.success ? 200 : 400;
        if (result.error?.includes('Missing')) statusCode = 400;
        if (result.error?.includes('No analysis found')) statusCode = 404;

        return {
            statusCode,
            body: JSON.stringify({
                success: result.success,
                data: result.data,
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
