/**
 * Test file for Idea Pipeline Service
 * Tests the complete workflow: create idea, analyze with AI, and store results
 */

import { supabase } from '../lib/supabaseClient';
import { createAndAnalyzeIdea } from '../services/ideaPipelineService';

/**
 * Main test function
 */
async function testPipeline(): Promise<void> {
    try {
        console.log('='.repeat(80));
        console.log('Starting Idea Pipeline Test');
        console.log('='.repeat(80));

        // Get current session - if one exists from previous auth
        const { data: sessionData } = await supabase.auth.getSession();
        const hasSession = !!sessionData.session;

        console.log('\n📊 SESSION STATUS:');
        if (hasSession) {
            console.log(`   ✅ Active session found for user: ${sessionData.session.user.id}`);
        } else {
            console.log(`   ⚠️  No active session found`);
            console.log('   For RLS-protected tables, run auth test first:');
            console.log('      npx tsx src/test/testAuth.ts');
        }

        // Use authenticated user if available, otherwise use known UUID
        const userId = sessionData.session?.user?.id || '13664e05-7f8d-468b-8085-7016ac9acb82';

        // Test parameters
        const ideaText = 'AI SaaS for automated interview preparation';
        const industry = 'EdTech';

        console.log('\n📝 TEST PARAMETERS:');
        console.log(`   User ID: ${userId}`);
        console.log(`   Idea: ${ideaText}`);
        console.log(`   Industry: ${industry}`);

        // Call the pipeline function
        console.log('\n⏳ Calling createAndAnalyzeIdea()...\n');
        const result = await createAndAnalyzeIdea(userId, ideaText, industry);

        // Check for errors
        if (result.error) {
            console.log('\n❌ PIPELINE ERROR:');
            console.log(`   ${result.error}`);

            if (result.error.includes('row-level security')) {
                console.log('\n🔒 RLS POLICY ISSUE:');
                console.log('   This error occurs when RLS policies are blocking the insert.');
                console.log('   ');
                console.log('   ✅ SOLUTION 1: Run auth test to establish session');
                console.log('      npx tsx src/test/testAuth.ts');
                console.log('   ');
                console.log('   ✅ SOLUTION 2: Temporarily disable RLS in Supabase (dev only)');
                console.log('      ALTER TABLE startup_ideas DISABLE ROW LEVEL SECURITY;');
                console.log('      ALTER TABLE idea_analysis DISABLE ROW LEVEL SECURITY;');
                console.log('   Then after testing, re-enable:');
                console.log('      ALTER TABLE startup_ideas ENABLE ROW LEVEL SECURITY;');
                console.log('      ALTER TABLE idea_analysis ENABLE ROW LEVEL SECURITY;');
            }

            process.exit(1);
        }

        // Display inserted idea
        console.log('\n✅ INSERTED IDEA:');
        if (result.idea) {
            console.log(`   ID: ${result.idea.id}`);
            console.log(`   User ID: ${result.idea.user_id}`);
            console.log(`   Text: ${result.idea.idea_text}`);
            console.log(`   Industry: ${result.idea.industry}`);
            console.log(`   Created At: ${result.idea.created_at}`);
        } else {
            console.log('   ⚠️  No idea data returned');
        }

        // Display AI analysis result
        console.log('\n✅ AI ANALYSIS RESULT:');
        if (result.analysis) {
            console.log(`   Analysis ID: ${result.analysis.id}`);
            console.log(`   Idea ID: ${result.analysis.idea_id}`);
            console.log(`   Market Score: ${result.analysis.market_score}/100`);
            console.log(`   Competition Score: ${result.analysis.competition_score}/100`);
            console.log(`   Feasibility Score: ${result.analysis.feasibility_score}/100`);
            console.log(`   Analysis Text: ${result.analysis.analysis_text}`);
        } else {
            console.log('   ⚠️  No analysis data returned');
        }

        // Summary
        console.log('\n' + '='.repeat(80));
        console.log('✨ Pipeline test completed successfully!');
        console.log('='.repeat(80));

        // Display full response for reference
        console.log('\n📋 Full Response:');
        console.log(JSON.stringify(result, null, 2));

        process.exit(0);
    } catch (exception) {
        const errorMessage =
            exception instanceof Error ? exception.message : 'Unknown error occurred';
        console.error('\n❌ TEST FAILED:');
        console.error(`   ${errorMessage}`);
        console.error('\n🔍 Troubleshooting:');
        console.error('   1. Check that Supabase credentials are correct');
        console.error('   2. Verify startup_ideas table schema');
        console.error('   3. Verify idea_analysis table schema');
        console.error('   4. Check RLS policies on both tables');
        console.error('   5. Verify OPENROUTER_API_KEY is set');
        console.error('   6. Check database connection');
        process.exit(1);
    }
}

// Execute the test
testPipeline();
