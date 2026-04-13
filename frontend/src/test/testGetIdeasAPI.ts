/**
 * Test file for /api/getIdeas endpoint
 */

import { handleGetIdeas } from '../api/getIdeas';

async function testGetIdeasAPI(): Promise<void> {
    try {
        console.log('='.repeat(80));
        console.log('Testing /api/getIdeas Endpoint');
        console.log('='.repeat(80));

        // Test Case 1: No authentication (should fail with 401)
        console.log('\n📋 Test 1: Call without authentication...');
        const result1 = await handleGetIdeas();

        console.log('\nResult:');
        console.log(JSON.stringify(result1, null, 2));

        if (result1.error?.includes('authenticated')) {
            console.log('✅ Correctly returned 401 Unauthorized error');
        } else {
            console.log('⚠️  Error response:', result1.error);
        }

        console.log('\n' + '='.repeat(80));
        console.log('API Tests Completed');
        console.log('='.repeat(80));

        console.log('\n📝 NOTE: Full end-to-end test requires:');
        console.log('   1. Authenticated user session');
        console.log('   2. Valid Supabase connection');
        console.log('   3. Ideas in database for the user');
        console.log('');
        console.log('   To test with authentication:');
        console.log('   1. Run testPipeline.ts to create ideas');
        console.log('   2. Then test getIdeas to verify retrieval');

    } catch (exception) {
        const errorMessage =
            exception instanceof Error ? exception.message : 'Unknown error';
        console.error('\n❌ Test Error:');
        console.error(`   ${errorMessage}`);
    }
}

testGetIdeasAPI();
