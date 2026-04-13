/**
 * Test file for /api/getAnalysis endpoint
 */

import { handleGetAnalysis } from '../api/getAnalysis';

async function testGetAnalysisAPI(): Promise<void> {
    try {
        console.log('='.repeat(80));
        console.log('Testing /api/getAnalysis Endpoint');
        console.log('='.repeat(80));

        // Test Case 1: Missing ideaId parameter
        console.log('\n📋 Test 1: Call without ideaId parameter...');
        const result1 = await handleGetAnalysis('');

        console.log('\nResult:');
        console.log(JSON.stringify(result1, null, 2));

        if (result1.error?.includes('Missing')) {
            console.log('✅ Correctly returned validation error');
        } else {
            console.log('⚠️  Error response:', result1.error);
        }

        // Test Case 2: Invalid ideaId (not found)
        console.log('\n📋 Test 2: Call with non-existent ideaId...');
        const result2 = await handleGetAnalysis('00000000-0000-0000-0000-000000000000');

        console.log('\nResult:');
        console.log(JSON.stringify(result2, null, 2));

        if (result2.error?.includes('No analysis found')) {
            console.log('✅ Correctly returned not found error');
        } else {
            console.log('⚠️  Error response:', result2.error);
        }

        console.log('\n' + '='.repeat(80));
        console.log('API Tests Completed');
        console.log('='.repeat(80));

        console.log('\n📝 NOTE: Full end-to-end test requires:');
        console.log('   1. Valid ideaId from database');
        console.log('   2. Corresponding analysis in idea_analysis table');
        console.log('   3. Run testPipeline.ts to create test data first');

    } catch (exception) {
        const errorMessage =
            exception instanceof Error ? exception.message : 'Unknown error';
        console.error('\n❌ Test Error:');
        console.error(`   ${errorMessage}`);
    }
}

testGetAnalysisAPI();
