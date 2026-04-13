/**
 * Test file for /api/analyzeIdea endpoint
 */

import { handleAnalyzeIdea } from '../api/analyzeIdea';

async function testAnalyzeIdeaAPI(): Promise<void> {
    try {
        console.log('='.repeat(80));
        console.log('Testing /api/analyzeIdea Endpoint');
        console.log('='.repeat(80));

        // Test Case 1: No authentication (should fail)
        console.log('\n📋 Test 1: Call without authentication...');
        const result1 = await handleAnalyzeIdea(
            'AI resume builder for job seekers',
            'HR Tech'
        );

        console.log('\nResult:');
        console.log(JSON.stringify(result1, null, 2));

        if (result1.error?.includes('authenticated')) {
            console.log('✅ Correctly returned authentication error');
        } else {
            console.log('⚠️  Error response:', result1.error);
        }

        // Test Case 2: Missing parameters
        console.log('\n📋 Test 2: Call with missing ideaText...');
        const result2 = await handleAnalyzeIdea('', 'HR Tech');

        if (!result2.success && result2.error?.includes('Missing')) {
            console.log('✅ Correctly returned validation error');
        } else {
            console.log('⚠️  Error:', result2.error);
        }

        // Test Case 3: Missing industry
        console.log('\n📋 Test 3: Call with missing industry...');
        const result3 = await handleAnalyzeIdea('AI resume builder', '');

        if (!result3.success && result3.error?.includes('Missing')) {
            console.log('✅ Correctly returned validation error');
        } else {
            console.log('⚠️  Error:', result3.error);
        }

        console.log('\n' + '='.repeat(80));
        console.log('API Tests Completed');
        console.log('='.repeat(80));

        console.log('\n📝 NOTE: Full end-to-end test requires:');
        console.log('   1. Authenticated user session');
        console.log('   2. Valid Supabase connection');
        console.log('   3. idea_analysis table with proper schema');
        console.log('');
        console.log('   Run testPipeline.ts after setting up, which will');
        console.log('   validate the complete flow including this API.');

    } catch (exception) {
        const errorMessage =
            exception instanceof Error ? exception.message : 'Unknown error';
        console.error('\n❌ Test Error:');
        console.error(`   ${errorMessage}`);
    }
}

testAnalyzeIdeaAPI();
