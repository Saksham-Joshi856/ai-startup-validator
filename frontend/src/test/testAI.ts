/**
 * Test file for AI Analysis Service
 * Tests the analyzeStartupIdea function with OpenRouter API
 */

import { analyzeStartupIdea } from '../services/aiService';

/**
 * Main test function
 */
async function testAIAnalysis(): Promise<void> {
    try {
        console.log('='.repeat(80));
        console.log('Starting AI Analysis Test');
        console.log('='.repeat(80));

        // Test parameters
        const ideaText = 'AI resume builder for job seekers';
        const industry = 'HR Tech';

        console.log('\n📝 INPUT:');
        console.log(`   Idea: ${ideaText}`);
        console.log(`   Industry: ${industry}`);

        // Call the AI analysis function
        console.log('\n⏳ Calling analyzeStartupIdea()...');
        console.log('   (Connecting to OpenRouter API with GPT-3.5-Turbo model)');

        const result = await analyzeStartupIdea(ideaText, industry);

        console.log('\n✅ Response received:\n');

        // Check for errors
        if (result.error) {
            console.log('❌ ERROR:');
            console.log(`   ${result.error}`);
            console.log('\n⚠️  Note: Make sure OPENROUTER_API_KEY is set in .env.local');
            process.exit(1);
        }

        // Display scores
        console.log('📊 ANALYSIS SCORES (1-10 scale):');
        console.log(`   Market Score: ${result.market_score}/10`);
        console.log(`   Competition Score: ${result.competition_score}/10`);
        console.log(`   Feasibility Score: ${result.feasibility_score}/10`);

        // Display analysis text
        console.log('\n📋 DETAILED ANALYSIS:');
        console.log(`   ${result.analysis_text}`);

        // Summary
        console.log('\n' + '='.repeat(80));
        console.log('✨ Test completed successfully!');
        console.log('='.repeat(80));

        // Display JSON response for reference
        console.log('\n📋 Full JSON Response:');
        console.log(JSON.stringify(result, null, 2));

        process.exit(0);
    } catch (exception) {
        const errorMessage =
            exception instanceof Error ? exception.message : 'Unknown error occurred';
        console.error('\n❌ TEST FAILED:');
        console.error(`   ${errorMessage}`);
        console.error('\n🔍 Troubleshooting:');
        console.error('   1. Check that .env.local has OPENROUTER_API_KEY');
        console.error('   2. Check that your OpenRouter account has credits');
        console.error('   3. Verify network connectivity');
        console.error('   4. Check the full error above');
        process.exit(1);
    }
}

// Execute the test
testAIAnalysis();
