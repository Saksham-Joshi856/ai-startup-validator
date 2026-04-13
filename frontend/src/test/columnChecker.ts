/**
 * Check actual columns that exist in idea_analysis table
 */

import { supabase } from '../lib/supabaseClient';

async function checkColumns(): Promise<void> {
    try {
        console.log('='.repeat(80));
        console.log('COLUMN CHECKER: What columns exist in idea_analysis?');
        console.log('='.repeat(80));

        // Try to query with .select('*') to see what columns exist
        console.log('\n📋 Querying idea_analysis table with SELECT *...');

        const { data: allData, error: allError } = await supabase
            .from('idea_analysis')
            .select('*')
            .limit(0); // Limit 0 just to get schema without data

        if (allError) {
            console.log(`\n❌ Error: ${allError.message}`);
            console.log(`   Code: ${allError.code}`);
        }

        // Use PostgreSQL information_schema to get column info
        console.log('\n📋 Checking via PostgreSQL information_schema...');

        const { data: columnData, error: columnError } = await supabase
            .rpc('get_columns', { table_name: 'idea_analysis' })
            .catch(() => ({ data: null, error: { message: 'RPC not available' } }));

        if (columnData) {
            console.log('\n✅ Columns found:');
            console.log(JSON.stringify(columnData, null, 2));
        } else {
            console.log('\n⚠️  Could not query via RPC');
        }

        // Try a raw SQL query approach
        console.log('\n📋 Attempting direct query of table structure...');

        // Insert a minimal record to see what columns are required
        const { error: insertError } = await supabase
            .from('idea_analysis')
            .insert({
                idea_id: '00000000-0000-0000-0000-000000000000', // dummy UUID
            });

        if (insertError) {
            console.log(`\nInsert error: ${insertError.message}`);
            // Error message might tell us which columns are missing/required
            if (insertError.message.includes('column')) {
                console.log('\n👉 This tells us which columns are required!');
            }
        }

        // Try to get a record if any exist
        console.log('\n📋 Trying to fetch existing records...');
        const { data: existingData, error: fetchError } = await supabase
            .from('idea_analysis')
            .select('*')
            .limit(1);

        if (fetchError) {
            console.log(`\n❌ Fetch error: ${fetchError.message}`);
        } else if (existingData?.length > 0) {
            console.log('\n✅ Found existing record!');
            console.log('   Columns in the record:');
            Object.keys(existingData[0]).forEach((col) => {
                console.log(`     - ${col}`);
            });
        } else {
            console.log('\n⚠️  No existing records found');
            console.log('   Running table is empty - cannot determine schema from data');
        }

        console.log('\n' + '='.repeat(80));
        console.log('RECOMMENDATION:');
        console.log('Drop the existing table and recreate it with proper schema:');
        console.log('');
        console.log('In Supabase SQL Editor, run:');
        console.log('');
        console.log('DROP TABLE IF EXISTS idea_analysis CASCADE;');
        console.log('');
        console.log('Then run the full setup from:');
        console.log('docs/setup-idea-analysis-table.sql');
        console.log('='.repeat(80));

    } catch (exception) {
        const errorMessage =
            exception instanceof Error ? exception.message : 'Unknown error';
        console.error('\n❌ Error:');
        console.error(`   ${errorMessage}`);
    }
}

checkColumns();
