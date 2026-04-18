/**
 * AI Analysis Service
 * Uses OpenRouter API to analyze startup ideas and generate scores/feedback
 */

import { saveIdeaAnalysis } from './analysisService.js';

/**
 * Analyze a startup idea using AI
 * @param ideaText - The description/text of the startup idea
 * @param industry - The industry category for the idea
 * @returns Object containing market_score, competition_score, feasibility_score, and analysis_text
 */
export async function analyzeStartupIdea(ideaText, industry) {
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
        const validateScore = (score, fieldName) => {
            if (typeof score !== 'number' || score < 1 || score > 10) {
                throw new Error(
                    `${fieldName} must be a number between 1 and 10, got ${score}`
                );
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
export async function analyzeStartupIdeasBatch(ideas) {
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
export async function analyzeAndStoreIdea(ideaId, ideaText, industry) {
    try {
        // Validate input parameters
        if (!ideaId || !ideaText || !industry) {
            return {
                data: null,
                error:
                    'Missing required fields: ideaId, ideaText, or industry ',
            };
        }

        console.log(`Starting analysis and storage for idea: ${ideaId}`);

        // Step 1: Call AI service to analyze the idea
        const analysisResult = await analyzeStartupIdea(ideaText, industry);

        // Handle analysis errors
        if (analysisResult.error) {
            return {
                data: null,
                error: `AI analysis failed: ${analysisResult.error}`,
            };
        }

        // Step 2: Convert scores from 1-10 to 0-100 scale
        const marketScoreNormalized = Math.round(
            (analysisResult.market_score / 10) * 100
        );
        const competitionScoreNormalized = Math.round(
            (analysisResult.competition_score / 10) * 100
        );
        const feasibilityScoreNormalized = Math.round(
            (analysisResult.feasibility_score / 10) * 100
        );

        // Step 3: Store the analysis using saveIdeaAnalysis
        const saveResult = await saveIdeaAnalysis(
            ideaId,
            marketScoreNormalized,
            competitionScoreNormalized,
            feasibilityScoreNormalized,
            analysisResult.analysis_text
        );

        if (saveResult.error) {
            return {
                data: null,
                error: `Failed to store analysis: ${saveResult.error}`,
            };
        }

        console.log(`Successfully analyzed and stored idea: ${ideaId}`);

        return {
            data: saveResult.data,
            error: null,
        };
    } catch (exception) {
        const errorMessage =
            exception instanceof Error ? exception.message : 'Unknown error occurred';
        console.error('Exception while analyzing and storing idea:', errorMessage);
        return {
            data: null,
            error: errorMessage,
        };
    }
}

/**
 * Generate AI advisor response for general chat messages with startup mentorship context
 * @param message - The user message to respond to
 * @param context - Optional context object with pastIdeas, latestAnalysis, and industry
 * @returns Object containing { response, error }
 */
export async function getAdvisorResponse(message, context = {}) {
    try {
        // Validate input
        if (!message || message.trim().length === 0) {
            throw new Error('Message cannot be empty');
        }

        // Get API key from environment variable
        const apiKey = process.env.OPENROUTER_API_KEY;
        if (!apiKey) {
            throw new Error('OPENROUTER_API_KEY environment variable is not set');
        }

        // Build context information for the mentor
        let contextSection = '';
        if (context) {
            if (context.industry) {
                contextSection += `\nUser's Focus Industry: ${context.industry}`;
            }
            if (context.pastIdeas && context.pastIdeas.length > 0) {
                contextSection += `\nPast Startup Ideas Analyzed: ${context.pastIdeas.length}`;
                contextSection += context.pastIdeas
                    .slice(0, 3)
                    .map((idea) => `\n- ${idea.title || idea.description || 'Untitled'} (${idea.industry})`)
                    .join('');
            }
            if (context.latestAnalysis) {
                contextSection += `\nLatest Analysis Scores:
- Market Potential: ${context.latestAnalysis.market_score}/100
- Competition: ${context.latestAnalysis.competition_score}/100
- Feasibility: ${context.latestAnalysis.feasibility_score}/100`;
            }
        }

        // Create the system prompt for the AI mentor
        const systemPrompt = `You are an experienced Startup Mentor helping founders validate ideas, improve business models, and identify risks.

${contextSection ? `User Context:${contextSection}` : ''}

Your role:
- Help founders validate their startup ideas with realistic feedback
- Provide actionable, specific advice based on their industry and past ideas
- Identify potential risks and market challenges
- Offer strategic guidance on business models and go-to-market strategies
- Focus on practical, implementable recommendations

Guidelines for responses:
- Use bullet points for clarity and readability
- Be realistic and mention potential risks, don't provide generic praise
- Reference their specific industry and context when relevant
- Provide 3-5 specific, actionable recommendations per response
- Avoid hallucinating market data - acknowledge limitations
- Focus on what they can do TODAY to validate their idea
- Be encouraging but honest about market challenges

Response format:
Use bullet points and numbered lists for structured advice. Keep responses focused and practical.`;

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
                        content: message,
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
                `API request failed with status ${response.status}: ${errorData.error?.message || 'Unknown error'}`
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

        const aiResponse = responseData.choices[0].message.content.trim();

        console.log('✅ AI mentor response generated successfully');
        return {
            response: aiResponse,
            error: null,
        };
    } catch (exception) {
        const errorMessage =
            exception instanceof Error ? exception.message : 'Unknown error occurred';
        console.error('Error generating mentor response:', errorMessage);
        return {
            response: null,
            error: errorMessage,
        };
    }
}
