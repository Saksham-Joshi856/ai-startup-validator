/**
 * Diagnostic script to check idea_analysis table schema
 */

import { supabase } from '../lib/supabaseClient';

async function checkSchema(): Promise<void> {
    try {
        console.log('='.repeat(80));
        console.log('Checking idea_analysis Table Schema');
        console.log('='.repeat(80));

        // Try to fetch one record to see the schema
        const { data, error } = await supabase
            .from('idea_analysis')
            .select('*')
            .limit(1);

        if (error) {
            console.log('\n❌ Error querying table:');
            console.log(`   ${error.message}`);
            console.log('\n📋 Table might not exist. Create it with SQL:');
            console.log(`
CREATE TABLE idea_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id UUID NOT NULL REFERENCES startup_ideas(id) ON DELETE CASCADE,
  market_score INT CHECK (market_score >= 0 AND market_score <= 100),
  competition_score INT CHECK (competition_score >= 0 AND competition_score <= 100),
  feasibility_score INT CHECK (feasibility_score >= 0 AND feasibility_score <= 100),
  analysis_text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
            `);
            process.exit(1);
        }

        if (data && data.length > 0) {
            console.log('\n✅ Table exists with the following columns:');
            const record = data[0];
            Object.keys(record).forEach((key) => {
                console.log(`   - ${key}: ${typeof record[key]}`);
            });
        } else {
            console.log('\n⚠️  Table exists but is empty. Checking metadata...');

            // Try to get column info another way
            const { data: tableInfo } = await supabase
                .from('idea_analysis')
                .select()
                .limit(0);

            console.log('\n📋 Expected columns based on analysisService:');
            console.log('   - id');
            console.log('   - idea_id');
            console.log('   - market_score');
            console.log('   - competition_score');
            console.log('   - feasibility_score');
            console.log('   - analysis_text  ← This is missing!');
        }

        console.log('\n' + '='.repeat(80));
    } catch (exception) {
        const errorMessage =
            exception instanceof Error ? exception.message : 'Unknown error';
        console.error('\n❌ Error:');
        console.error(`   ${errorMessage}`);
    }
}

checkSchema();
