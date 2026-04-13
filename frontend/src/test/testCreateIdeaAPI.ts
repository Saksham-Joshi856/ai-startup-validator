import { handleCreateIdea } from '../api/createIdea';

/**
 * Test the createIdea API handler
 * This tests the business logic without needing an HTTP server
 */
async function testCreateIdeaAPI() {
    console.log('\n=== Testing createIdea API Handler ===\n');

    // Test data
    const testData = {
        ideaText: 'Blockchain-based supply chain tracking for luxury goods',
        industry: 'Supply Chain',
    };

    console.log('Request body:', testData);
    console.log('Calling handleCreateIdea...\n');

    // Call the handler
    const result = await handleCreateIdea(testData.ideaText, testData.industry);

    // Display result
    if (result.success) {
        console.log('✅ API Response - Success:');
        console.log('Status: 201');
        console.log('Body:', JSON.stringify(result, null, 2));
    } else {
        console.log('❌ API Response - Error:');
        console.log('Status: 400 or 500');
        console.log('Body:', JSON.stringify(result, null, 2));
    }
}

/**
 * Test with missing parameters
 */
async function testCreateIdeaAPIWithMissingParams() {
    console.log('\n=== Testing createIdea API with Missing Parameters ===\n');

    console.log('Request body: { ideaText: "", industry: "" }');
    console.log('Calling handleCreateIdea with empty strings...\n');

    const result = await handleCreateIdea('', '');

    if (result.success) {
        console.log('✅ Success:', result.data);
    } else {
        console.log('❌ Expected Error (Missing validation):', result.error);
    }
}

/**
 * Run all tests
 */
async function runTests() {
    console.log('Starting createIdea API tests...\n');

    try {
        await testCreateIdeaAPI();
        await testCreateIdeaAPIWithMissingParams();
    } catch (err) {
        console.error('Test execution error:', err);
    }

    console.log('\n=== Tests completed ===\n');
}

// Run the tests
runTests();
