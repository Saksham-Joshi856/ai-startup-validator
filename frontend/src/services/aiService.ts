/**
 * AI Analysis Service
 * Uses OpenRouter API to analyze startup ideas and generate scores/feedback
 */

import { saveIdeaAnalysis } from './analysisService';

/**
 * Analyze a startup idea using AI
 * @param ideaText - The description/text of the startup idea
 * @param industry - The industry category for the idea
 * @returns Object containing market_score, competition_score, feasibility_score, and analysis_text
 */
export async function analyzeStartupIdea(
    ideaText: string,
    industry: string
): Promise<{
    market_score: number;
    competition_score: number;
    feasibility_score: number;
    analysis_text: string;
    error?: string;
}> {
    try {
        // Validate input parameters
        if (!ideaText || !industry) {
            throw new Error('Missing required fields: ideaText or industry');
        }

        // Get API key from environment variable
        const apiKey = process.env.OPENROUTER_API_KEY;
        if (!apiKey) {
            throw new Error('OPENROUTER_API_KEY environment variable is not set');
        }

        // Create the prompt for AI analysis
        const systemPrompt = `You are an expert startup analyst. Analyze the given startup idea and industry, then respond ONLY with a valid JSON object (no markdown, no code blocks, just raw JSON).

Your analysis should evaluate:
1. Market opportunity (1-10 scale): How large and growing is the market?
2. Competition intensity (1-10 scale): How competitive is the market? (Lower scores mean less competition, which is better)
3. Technical feasibility (1-10 scale): How technically feasible is this idea?
4. Detailed analysis: 2-3 sentences explaining your assessment

CRITICAL: Respond ONLY with valid JSON in this exact format:
{
  "market_score": <number between 1-10>,
  "competition_score": <number between 1-10>,
  "feasibility_score": <number between 1-10>,
  "analysis_text": "<your detailed analysis here>"
}`;

        const userPrompt = `Please analyze this startup idea:

Idea: ${ideaText}

Industry: ${industry}

Provide your analysis in JSON format only.`;

        // Make request to OpenRouter API
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'openai/gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: systemPrompt,
                    },
                    {
                        role: 'user',
                        content: userPrompt,
                    },
                ],
                temperature: 0.7,
                max_tokens: 500,
            }),
        });

        // Check if response is successful
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                `API request failed with status ${response.status}: ${errorData.error?.message || 'Unknown error'
                }`
            );
        }

        // Parse the response
        const responseData = await response.json();

        // Extract the AI's message
        if (
            !responseData.choices ||
            !responseData.choices[0] ||
            !responseData.choices[0].message ||
            !responseData.choices[0].message.content
        ) {
            throw new Error('Invalid API response structure');
        }

        const aiContent = responseData.choices[0].message.content.trim();

        // Parse the JSON response from AI
        let analysisResult;
        try {
            // Remove potential markdown code blocks if AI includes them
            const cleanContent = aiContent
                .replace(/^```json\s*/i, '')
                .replace(/```\s*$/, '')
                .trim();

            analysisResult = JSON.parse(cleanContent);
        } catch (parseError) {
            console.error('Failed to parse AI response as JSON:', aiContent);
            throw new Error('AI response was not valid JSON');
        }

        // Validate the parsed response has required fields
        if (
            analysisResult.market_score == null ||
            analysisResult.competition_score == null ||
            analysisResult.feasibility_score == null ||
            !analysisResult.analysis_text
        ) {
            throw new Error('AI response missing required fields');
        }

        // Validate score ranges (1-10)
        const validateScore = (score: number, fieldName: string) => {
            if (typeof score !== 'number' || score < 1 || score > 10) {
                throw new Error(`${fieldName} must be a number between 1 and 10, got ${score}`);
            }
        };

        validateScore(analysisResult.market_score, 'market_score');
        validateScore(analysisResult.competition_score, 'competition_score');
        validateScore(analysisResult.feasibility_score, 'feasibility_score');

        // Return the analysis result
        console.log('AI analysis completed successfully');
        return {
            market_score: analysisResult.market_score,
            competition_score: analysisResult.competition_score,
            feasibility_score: analysisResult.feasibility_score,
            analysis_text: analysisResult.analysis_text,
        };
    } catch (exception) {
        const errorMessage =
            exception instanceof Error ? exception.message : 'Unknown error occurred';
        console.error('Error analyzing startup idea:', errorMessage);

        return {
            market_score: 0,
            competition_score: 0,
            feasibility_score: 0,
            analysis_text: '',
            error: errorMessage,
        };
    }
}

/**
 * Analyze multiple startup ideas in batch
 * @param ideas - Array of ideas with ideaText and industry
 * @returns Array of analysis results
 */
export async function analyzeStartupIdeasBatch(
    ideas: Array<{ ideaText: string; industry: string }>
): Promise<
    Array<{
        market_score: number;
        competition_score: number;
        feasibility_score: number;
        analysis_text: string;
        error?: string;
    }>
> {
    try {
        if (!ideas || ideas.length === 0) {
            throw new Error('Ideas array is empty');
        }

        console.log(`Starting batch analysis for ${ideas.length} ideas...`);

        // Analyze all ideas in parallel
        const results = await Promise.all(
            ideas.map((idea) => analyzeStartupIdea(idea.ideaText, idea.industry))
        );

        console.log(`Batch analysis completed for ${ideas.length} ideas`);
        return results;
    } catch (exception) {
        const errorMessage =
            exception instanceof Error ? exception.message : 'Unknown error occurred';
        console.error('Error in batch analysis:', errorMessage);
        throw exception;
    }
}

/**
 * Analyze a startup idea and store the results in the database
 * @param ideaId - The UUID of the idea to analyze
 * @param ideaText - The description/text of the startup idea
 * @param industry - The industry category for the idea
 * @returns Object containing the stored analysis data with { data, error }
 */
export async function analyzeAndStoreIdea(
    ideaId: string,
    ideaText: string,
    industry: string
): Promise<{ data: any; error: string | null }> {
    try {
        // Validate input parameters
        if (!ideaId || !ideaText || !industry) {
            return {
                data: null,
                error: 'Missing required fields: ideaId, ideaText, or industry',
            };
        }

        console.log(`Starting analysis and storage for idea: ${ideaId}`);

        // Step 1: Call AI service to analyze the idea
        const analysisResult = await analyzeStartupIdea(ideaText, industry);

        // Check if AI analysis failed
        if (analysisResult.error) {
            console.error('AI analysis failed:', analysisResult.error);
            return {
                data: null,
                error: `AI analysis failed: ${analysisResult.error}`,
            };
        }

        // Step 2: Convert 1-10 score to 0-100 scale for storage
        // Then round to whole numbers
        const marketScoreNormalized = Math.round((analysisResult.market_score / 10) * 100);
        const competitionScoreNormalized = Math.round(
            (analysisResult.competition_score / 10) * 100
        );
        const feasibilityScoreNormalized = Math.round(
            (analysisResult.feasibility_score / 10) * 100
        );

        console.log(`AI analysis completed. Scores: Market=${marketScoreNormalized}, Competition=${competitionScoreNormalized}, Feasibility=${feasibilityScoreNormalized}`);

        // Step 3: Save the analysis to the database
        const storageResult = await saveIdeaAnalysis(
            ideaId,
            marketScoreNormalized,
            competitionScoreNormalized,
            feasibilityScoreNormalized,
            analysisResult.analysis_text
        );

        // Check if storage failed
        if (storageResult.error) {
            console.error('Failed to store analysis:', storageResult.error);
            return {
                data: null,
                error: `Failed to store analysis: ${storageResult.error}`,
            };
        }

        // Step 4: Return the stored data
        console.log(`Analysis successfully saved for idea: ${ideaId}`);
        return {
            data: storageResult.data,
            error: null,
        };
    } catch (exception) {
        const errorMessage =
            exception instanceof Error ? exception.message : 'Unknown error occurred';
        console.error('Exception in analyzeAndStoreIdea:', errorMessage);
        return {
            data: null,
            error: errorMessage,
        };
    }
}
