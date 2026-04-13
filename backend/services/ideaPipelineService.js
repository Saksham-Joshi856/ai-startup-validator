/**
 * Idea Pipeline Service
 * Orchestrates the complete workflow: create idea, analyze with AI, and store results
 */

import { createStartupIdea } from './ideaService.js';
import { analyzeStartupIdea } from './aiService.js';
import { saveIdeaAnalysis } from './analysisService.js';

/**
 * Create and analyze a startup idea in one pipeline
 * @param userId - The UUID of the user creating the idea
 * @param ideaText - The description/text of the startup idea
 * @param industry - The industry category for the idea
 * @returns Object containing { idea, analysis, error }
 */
export async function createAndAnalyzeIdea(userId, ideaText, industry) {
    try {
        // Validate input parameters
        if (!userId || !ideaText || !industry) {
            return {
                idea: null,
                analysis: null,
                error: 'Missing required fields: userId, ideaText, or industry',
            };
        }

        console.log(`\n${'='.repeat(80)}`);
        console.log(
            `Starting idea creation and analysis pipeline for user: ${userId}`
        );
        console.log(`${'='.repeat(80)}`);

        // ============================================================================
        // Step 1: Insert idea using createStartupIdea
        // ============================================================================
        console.log('\n📝 Step 1: Creating startup idea...');
        const createResult = await createStartupIdea(userId, ideaText, industry);

        if (createResult.error) {
            const errorMsg = `Failed to create idea: ${createResult.error}`;
            console.error(`❌ ${errorMsg}`);
            return {
                idea: null,
                analysis: null,
                error: errorMsg,
            };
        }

        const createdIdea = createResult.data;
        console.log(`✅ Idea created successfully with ID: ${createdIdea.id}`);

        // ============================================================================
        // Step 2: Extract inserted idea ID
        // ============================================================================
        console.log('\n🔍 Step 2: Extracting idea ID...');
        const ideaId = createdIdea.id;

        if (!ideaId) {
            const errorMsg = 'Failed to extract idea ID from created idea';
            console.error(`❌ ${errorMsg}`);
            return {
                idea: createdIdea,
                analysis: null,
                error: errorMsg,
            };
        }

        console.log(`✅ Idea ID extracted: ${ideaId}`);

        // ============================================================================
        // Step 3: Call analyzeStartupIdea with ideaText and industry
        // ============================================================================
        console.log('\n🤖 Step 3: Analyzing idea with AI...');
        const analysisResult = await analyzeStartupIdea(ideaText, industry);

        if (analysisResult.error) {
            const errorMsg = `AI analysis failed: ${analysisResult.error}`;
            console.error(`❌ ${errorMsg}`);
            return {
                idea: createdIdea,
                analysis: null,
                error: errorMsg,
            };
        }

        console.log(`✅ AI analysis completed successfully`);
        console.log(`   Market Score: ${analysisResult.market_score}/10`);
        console.log(
            `   Competition Score: ${analysisResult.competition_score}/10`
        );
        console.log(`   Feasibility Score: ${analysisResult.feasibility_score}/10`);

        // ============================================================================
        // Step 4: Store AI result using saveIdeaAnalysis with ideaId
        // ============================================================================
        console.log('\n💾 Step 4: Storing analysis in database...');

        // Convert scores from 1-10 to 0-100 scale
        const marketScoreNormalized = Math.round(
            (analysisResult.market_score / 10) * 100
        );
        const competitionScoreNormalized = Math.round(
            (analysisResult.competition_score / 10) * 100
        );
        const feasibilityScoreNormalized = Math.round(
            (analysisResult.feasibility_score / 10) * 100
        );

        const saveResult = await saveIdeaAnalysis(
            ideaId,
            marketScoreNormalized,
            competitionScoreNormalized,
            feasibilityScoreNormalized,
            analysisResult.analysis_text
        );

        if (saveResult.error) {
            const errorMsg = `Failed to save analysis: ${saveResult.error}`;
            console.error(`❌ ${errorMsg}`);
            return {
                idea: createdIdea,
                analysis: null,
                error: errorMsg,
            };
        }

        const savedAnalysis = saveResult.data;
        console.log(`✅ Analysis stored successfully with ID: ${savedAnalysis.id}`);

        // ============================================================================
        // Step 5: Return idea and analysis
        // ============================================================================
        console.log(`\n${'='.repeat(80)}`);
        console.log(`✨ Pipeline completed successfully!`);
        console.log(`${'='.repeat(80)}\n`);

        return {
            idea: createdIdea,
            analysis: savedAnalysis,
            error: undefined,
        };
    } catch (exception) {
        const errorMessage =
            exception instanceof Error ? exception.message : 'Unknown error occurred';
        console.error(`\n❌ Exception in createAndAnalyzeIdea: ${errorMessage}`);
        return {
            idea: null,
            analysis: null,
            error: errorMessage,
        };
    }
}

/**
 * Batch create and analyze multiple ideas
 * @param userId - The UUID of the user
 * @param ideas - Array of ideas with ideaText and industry
 * @returns Array of pipeline results with idea, analysis, and error fields
 */
export async function createAndAnalyzeIdeasBatch(userId, ideas) {
    try {
        if (!userId || !ideas || ideas.length === 0) {
            throw new Error('userId and ideas array are required');
        }

        console.log(`\nStarting batch pipeline for ${ideas.length} ideas...`);

        // Process all ideas in parallel
        const results = await Promise.all(
            ideas.map((idea) =>
                createAndAnalyzeIdea(userId, idea.ideaText, idea.industry)
            )
        );

        // Count successes and failures
        const successes = results.filter((r) => !r.error).length;
        const failures = results.filter((r) => r.error).length;

        console.log(`\n✨ Batch pipeline completed:`);
        console.log(`   ✅ Successful: ${successes}`);
        console.log(`   ❌ Failed: ${failures}`);

        return results;
    } catch (exception) {
        const errorMessage =
            exception instanceof Error ? exception.message : 'Unknown error occurred';
        console.error(`\n❌ Exception in batch pipeline: ${errorMessage}`);
        throw exception;
    }
}
