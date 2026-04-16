// Load environment variables FIRST, before importing anything else
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

import express from 'express';
import cors from 'cors';

// Import services (now .env is loaded)
import { getAllStartupIdeas } from './services/ideaService.js';
import { getIdeaAnalysis } from './services/analysisService.js';
import { createAndAnalyzeIdea } from './services/ideaPipelineService.js';
import { getAdvisorResponse } from './services/aiService.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Verify Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('⚠️  Warning: Supabase environment variables not configured.');
    console.warn('Please set SUPABASE_URL and SUPABASE_ANON_KEY in backend/.env');
}

// Health check route
app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend working' });
});

// GET /api/getIdeas - Fetch all startup ideas
app.get('/api/getIdeas', async (req, res) => {
    try {
        if (!supabaseUrl || !supabaseAnonKey) {
            return res.status(503).json({
                success: false,
                error: 'Database not configured. Please set Supabase environment variables.',
            });
        }

        const result = await getAllStartupIdeas();

        if (result.error) {
            console.error('Error fetching ideas:', result.error);
            return res.status(500).json({ success: false, error: result.error });
        }

        res.json({ success: true, ideas: result.data || [] });
    } catch (error) {
        console.error('Error in getIdeas endpoint:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// GET /api/getAnalysis - Fetch idea analysis
app.get('/api/getAnalysis', async (req, res) => {
    try {
        if (!supabaseUrl || !supabaseAnonKey) {
            return res.status(503).json({
                success: false,
                error: 'Database not configured. Please set Supabase environment variables.',
            });
        }

        const { ideaId } = req.query;

        if (!ideaId) {
            return res.status(400).json({
                success: false,
                error: 'Missing required query parameter: ideaId',
            });
        }

        const result = await getIdeaAnalysis(ideaId);

        if (result.error) {
            console.error('Error fetching analysis:', result.error);
            return res.status(404).json({
                success: false,
                error: 'Analysis not found for this idea',
            });
        }

        res.json({
            success: true,
            market_score: result.data.market_score,
            competition_score: result.data.competition_score,
            feasibility_score: result.data.feasibility_score,
            analysis_text: result.data.analysis_text,
        });
    } catch (error) {
        console.error('Error in getAnalysis endpoint:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// POST /api/analyzeIdea - Create and analyze an idea
app.post('/api/analyzeIdea', async (req, res) => {
    try {
        if (!supabaseUrl || !supabaseAnonKey) {
            return res.status(503).json({
                success: false,
                error: 'Database not configured. Please set Supabase environment variables.',
            });
        }

        const { userId, ideaText, industry } = req.body;

        if (!userId || !ideaText || !industry) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: userId, ideaText, or industry',
            });
        }

        const result = await createAndAnalyzeIdea(userId, ideaText, industry);

        if (result.error) {
            console.error('Error in analysis pipeline:', result.error);
            return res.status(500).json({
                success: false,
                error: result.error,
            });
        }

        res.json({
            success: true,
            idea: result.idea,
            analysis: result.analysis,
        });
    } catch (error) {
        console.error('Error in analyzeIdea endpoint:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// GET /api/get-ideas - Fetch ideas for specific user
app.get('/api/get-ideas', async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({
                success: false,
                error: 'Missing required query parameter: userId',
            });
        }

        const result = await getAllStartupIdeas();

        if (result.error) {
            console.error('Error fetching ideas:', result.error);
            return res.status(500).json({ success: false, error: result.error });
        }

        res.json({
            success: true,
            ideas: result.data || [],
        });
    } catch (error) {
        console.error('Error in get-ideas endpoint:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// GET /api/get-analysis - Fetch analysis for specific idea
app.get('/api/get-analysis', async (req, res) => {
    try {
        const { ideaId } = req.query;

        if (!ideaId) {
            return res.status(400).json({
                success: false,
                error: 'Missing required query parameter: ideaId',
            });
        }

        const result = await getIdeaAnalysis(ideaId);

        if (result.error) {
            console.error('Error fetching analysis:', result.error);
            return res.status(404).json({
                success: false,
                error: 'Analysis not found for this idea',
            });
        }

        res.json({
            success: true,
            market_score: result.data.market_score,
            competition_score: result.data.competition_score,
            feasibility_score: result.data.feasibility_score,
            analysis_text: result.data.analysis_text,
        });
    } catch (error) {
        console.error('Error in get-analysis endpoint:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// GET /api/insights - Get insights/analytics for user
app.get('/api/insights', async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({
                success: false,
                error: 'Missing required query parameter: userId',
            });
        }

        // Placeholder response - will calculate from database in future
        res.json({
            success: true,
            avg_market_score: 72,
            avg_competition_score: 65,
            avg_feasibility_score: 78,
            total_ideas: 0,
        });
    } catch (error) {
        console.error('Error in insights endpoint:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// GET /api/dashboard-stats - Get dashboard statistics
app.get('/api/dashboard-stats', async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({
                success: false,
                error: 'Missing required query parameter: userId',
            });
        }

        // Placeholder response
        res.json({
            success: true,
            total_ideas: 0,
            avg_score: 0,
            success_rate: 0,
        });
    } catch (error) {
        console.error('Error in dashboard-stats endpoint:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// POST /api/ai-advisor - Chat with AI advisor
app.post('/api/ai-advisor', async (req, res) => {
    try {
        const { userId, message } = req.body;

        if (!userId || !message) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: userId or message',
            });
        }

        // Call AI service to generate advisor response
        const result = await getAdvisorResponse(message);

        if (result.error) {
            console.error('Error generating advisor response:', result.error);
            return res.status(500).json({
                success: false,
                error: result.error,
            });
        }

        res.json({
            success: true,
            data: {
                response: result.response,
            },
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Error in ai-advisor endpoint:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
    console.log(`Test endpoint: http://localhost:${PORT}/api/test`);
    console.log(`\nAvailable endpoints:`);
    console.log(`  GET  /api/test                    - Health check`);
    console.log(`  GET  /api/getIdeas                - Fetch all startup ideas`);
    console.log(`  GET  /api/get-ideas?userId=...    - Fetch ideas for user`);
    console.log(`  GET  /api/getAnalysis?ideaId=...  - Fetch idea analysis`);
    console.log(`  GET  /api/get-analysis?ideaId=... - Fetch analysis for idea`);
    console.log(`  POST /api/analyzeIdea             - Create and analyze an idea`);
    console.log(`  GET  /api/insights?userId=...     - Get user insights`);
    console.log(`  GET  /api/dashboard-stats?userId=... - Get dashboard stats`);
    console.log(`  POST /api/ai-advisor              - Chat with AI advisor`);
});
