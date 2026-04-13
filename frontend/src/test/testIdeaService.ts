import { createStartupIdea, getUserStartupIdeas, getUserIdeas } from '../services/ideaService';

/**
 * Test the createStartupIdea service function
 */
async function testCreateIdea() {
    console.log('\n=== Testing createStartupIdea ===\n');

    // Use the test user ID from previous auth tests
    const testUserId = '13664e05-7f8d-468b-8085-7016ac9acb82'; // From testAuth.ts

    const testIdea = {
        userId: testUserId,
        ideaText: 'AI-powered healthcare diagnostics platform',
        industry: 'Healthcare',
    };

    console.log('Creating idea with:', testIdea);

    const { data, error } = await createStartupIdea(
        testIdea.userId,
        testIdea.ideaText,
        testIdea.industry
    );

    if (error) {
        console.error('❌ Error creating idea:', error);
    } else {
        console.log('✅ Idea created successfully:', data);
    }
}

/**
 * Test the getUserStartupIdeas service function
 */
async function testGetUserIdeas() {
    console.log('\n=== Testing getUserStartupIdeas ===\n');

    const testUserId = '13664e05-7f8d-468b-8085-7016ac9acb82';

    console.log(`Fetching ideas for user: ${testUserId}`);

    const { data, error } = await getUserStartupIdeas(testUserId);

    if (error) {
        console.error('❌ Error fetching ideas:', error);
    } else {
        console.log(`✅ Found ${data?.length || 0} ideas:`, data);
    }
}

/**
 * Test the new getUserIdeas service function (simplified version)
 */
async function testGetUserIdeasSimplified() {
    console.log('\n=== Testing getUserIdeas (Simplified) ===\n');

    const testUserId = '13664e05-7f8d-468b-8085-7016ac9acb82';

    console.log(`Fetching ideas for user: ${testUserId}`);
    console.log('Using simplified getUserIdeas function...');

    const { data, error } = await getUserIdeas(testUserId);

    if (error) {
        console.error('❌ Error fetching ideas:', error);
    } else {
        console.log(`✅ Found ${data?.length || 0} ideas:`, data);
    }
}

/**
 * Run all tests
 */
async function runTests() {
    console.log('Starting ideaService tests...');

    try {
        await testCreateIdea();
        await testGetUserIdeas();
        await testGetUserIdeasSimplified();
    } catch (err) {
        console.error('Test execution error:', err);
    }

    console.log('\n=== Tests completed ===\n');
}

// Run the tests
runTests();
