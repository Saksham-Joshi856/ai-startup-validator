/**
 * Deep Diagnostic: Check actual table structure
 */

import { supabase } from '../lib/supabaseClient';

async function diagnose(): Promise<void> {
    try {
        console.log('='.repeat(80));
        console.log('DEEP DIAGNOSTIC: idea_analysis Table Structure');
        console.log('='.repeat(80));

        // Test 1: Check if table exists
        console.log('\n📋 Test 1: Checking if table exists...');
        const { data: existsCheck, error: existsError } = await supabase
            .from('idea_analysis')
            .select('*')
            .limit(1);

        if (existsError?.code === 'PGRST116') {
            console.log('❌ Table does not exist!');
            console.log(`   Error: ${existsError.message}`);
        } else if (existsError?.code === '42703') {
            console.log('⚠️  Column not found error!');
            console.log(`   Error: ${existsError.message}`);
        } else if (existsError) {
            console.log(`❌ Error: ${existsError.message}`);
            console.log(`   Code: ${existsError.code}`);
        } else {
            console.log('✅ Table exists');
        }

        // Test 2: Try to insert with different column variations
        console.log('\n📋 Test 2: Testing different column names...');

        // Create test idea first
        const { data: testIdea } = await supabase
            .from('startup_ideas')
            .insert({
                user_id: '13664e05-7f8d-468b-8085-7016ac9acb82',
                idea_text: 'Test idea for column discovery',
                industry: 'Test',
            })
            .select()
            .single();

        if (testIdea) {
            console.log(`✅ Test idea created: ${testIdea.id}`);

            // Try different column name combinations
            const columnVariations = [
                { name: 'analysis_text', attempt: 1 },
                { name: 'analysis', attempt: 2 },
                { name: 'notes', attempt: 3 },
                { name: 'feedback', attempt: 4 },
                { name: 'comment', attempt: 5 },
            ];

            for (const variation of columnVariations) {
                const testData: any = {
                    idea_id: testIdea.id,
                    market_score: 50,
                    competition_score: 50,
                    feasibility_score: 50,
                };
                testData[variation.name] = 'Test content';

                const { error } = await supabase
                    .from('idea_analysis')
                    .insert(testData);

                if (!error) {
                    console.log(`✅ SUCCESS with column name: "${variation.name}"`);
                    console.log(`   This is the column you should use!`);

                    // Get the actual schema
                    const { data: inserted } = await supabase
                        .from('idea_analysis')
                        .select('*')
                        .eq('id', testIdea.id)
                        .single();

                    if (inserted) {
                        console.log(`\n   Actual columns in table:`);
                        Object.keys(inserted).forEach(col => {
                            console.log(`     - ${col}: ${typeof inserted[col]}`);
                        });
                    }
                    break;
                } else if (error.code === '42703') {
                    console.log(`❌ Attempt ${variation.attempt} - Column "${variation.name}" not found`);
                } else {
                    console.log(`⚠️  Attempt ${variation.attempt} - Different error: ${error.message}`);
                }
            }
        }

        console.log('\n' + '='.repeat(80));
    } catch (exception) {
        const errorMessage =
            exception instanceof Error ? exception.message : 'Unknown error';
        console.error('\n❌ Error:');
        console.error(`   ${errorMessage}`);
    }
}

diagnose();
