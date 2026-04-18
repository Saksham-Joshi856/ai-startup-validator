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
import { getAllStartupIdeas, getUserStartupIdeas } from './services/ideaService.js';
import { getIdeaAnalysis } from './services/analysisService.js';
import { createAndAnalyzeIdea } from './services/ideaPipelineService.js';
import { getAdvisorResponse, generateSmartSuggestions } from './services/aiService.js';
import { getSupabaseClient } from './config/supabaseClient.js';

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration with whitelist
const allowedOrigins = [
    'http://localhost:5173',      // Local development (Vite)
    'http://localhost:5000',      // Local backend (for testing)
    process.env.FRONTEND_URL || 'http://localhost:5173',
    process.env.PRODUCTION_FRONTEND_URL,
].filter(Boolean); // Remove undefined entries

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400 // 24 hours
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Verify Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('⚠️  Warning: Supabase environment variables not configured.');
    console.warn('Please set SUPABASE_URL and SUPABASE_ANON_KEY in backend/.env');
}

// Log CORS configuration
console.log('✅ CORS Configuration:');
console.log('   Allowed origins:', allowedOrigins);
console.log('   Credentials enabled: true');

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

// POST /api/reanalyzeIdea - Re-analyze an existing idea
app.post('/api/reanalyzeIdea', async (req, res) => {
    try {
        if (!supabaseUrl || !supabaseAnonKey) {
            return res.status(503).json({
                success: false,
                error: 'Database not configured. Please set Supabase environment variables.',
            });
        }

        const { ideaId, userId } = req.body;

        if (!ideaId || !userId) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: ideaId or userId',
            });
        }

        // Fetch the idea from database
        const supabase = getSupabaseClient();
        const { data: ideaData, error: ideaError } = await supabase
            .from('startup_ideas')
            .select('id, idea_text, description, industry, user_id')
            .eq('id', ideaId)
            .single();

        if (ideaError || !ideaData) {
            return res.status(404).json({
                success: false,
                error: 'Idea not found',
            });
        }

        // Verify ownership
        if (ideaData.user_id !== userId) {
            return res.status(403).json({
                success: false,
                error: 'Unauthorized: You can only re-analyze your own ideas',
            });
        }

        // Re-analyze the idea
        const ideaText = ideaData.description || ideaData.idea_text;
        const industry = ideaData.industry;

        const { analyzeAndStoreIdea } = await import('./services/analysisService.js');
        const result = await analyzeAndStoreIdea(ideaId, ideaText, industry);

        if (result.error) {
            console.error('Error in re-analysis pipeline:', result.error);
            return res.status(500).json({
                success: false,
                error: result.error,
            });
        }

        res.json({
            success: true,
            message: 'Idea re-analyzed successfully',
            analysis: result.data,
        });
    } catch (error) {
        console.error('Error in reanalyzeIdea endpoint:', error);
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

        // Fetch user's ideas and analyses from Supabase
        const supabase = getSupabaseClient();

        // Get all ideas for the user
        const { data: ideasData, error: ideasError } = await supabase
            .from('startup_ideas')
            .select('id, industry, created_at')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (ideasError) {
            console.error('Error fetching ideas:', ideasError);
            return res.status(500).json({
                success: false,
                error: 'Failed to fetch ideas',
            });
        }

        const totalIdeas = ideasData?.length || 0;
        let totalScore = 0;
        let analysisCount = 0;
        let analysesData = [];

        if (totalIdeas > 0) {
            const ideaIds = ideasData.map((idea) => idea.id);

            const { data: fetchedAnalyses, error: analysisError } = await supabase
                .from('idea_analysis')
                .select('market_score, competition_score, feasibility_score')
                .in('idea_id', ideaIds);

            if (analysisError) {
                console.warn('Error fetching analyses:', analysisError);
            }

            if (fetchedAnalyses && fetchedAnalyses.length > 0) {
                analysesData = fetchedAnalyses;
                analysisCount = fetchedAnalyses.length;
                totalScore = fetchedAnalyses.reduce((sum, analysis) => {
                    const avgScore =
                        (analysis.market_score +
                            (100 - analysis.competition_score) +
                            analysis.feasibility_score) /
                        3;
                    return sum + avgScore;
                }, 0);
            }
        }

        const avgScore = analysisCount > 0 ? Math.round(totalScore / analysisCount) : 0;

        // Success rate: ideas with analysis score >= 70
        const successfulIdeas = analysesData.filter(
            (a) =>
                (a.market_score +
                    (100 - a.competition_score) +
                    a.feasibility_score) /
                3 >=
                70
        ).length;

        const successRate = analysisCount > 0 ? Math.round((successfulIdeas / analysisCount) * 100) : 0;

        res.json({
            success: true,
            data: {
                total_ideas: totalIdeas,
                avg_score: avgScore,
                success_rate: successRate,
            },
        });
    } catch (error) {
        console.error('Error in dashboard-stats endpoint:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// POST /api/ai-advisor - Chat with AI advisor (Startup Mentor)
app.post('/api/ai-advisor', async (req, res) => {
    try {
        const { userId, message } = req.body;

        if (!userId || !message) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: userId or message',
            });
        }

        // Fetch user context for the mentor
        let context = {};

        try {
            const supabase = getSupabaseClient();

            // Get user's past ideas
            const { data: ideasData } = await supabase
                .from('startup_ideas')
                .select('id, description, industry, created_at')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(5);

            if (ideasData && ideasData.length > 0) {
                context.pastIdeas = ideasData.map(idea => ({
                    id: idea.id,
                    title: idea.description?.split('\n')[0]?.substring(0, 50) || 'Untitled',
                    description: idea.description,
                    industry: idea.industry,
                    created_at: idea.created_at,
                }));

                // Get latest analysis for context
                if (ideasData[0]) {
                    const { data: analysisData } = await supabase
                        .from('idea_analysis')
                        .select('market_score, competition_score, feasibility_score, analysis_text')
                        .eq('idea_id', ideasData[0].id)
                        .single();

                    if (analysisData) {
                        context.latestAnalysis = {
                            market_score: analysisData.market_score,
                            competition_score: analysisData.competition_score,
                            feasibility_score: analysisData.feasibility_score,
                        };
                    }

                    // Get industry from latest idea
                    context.industry = ideasData[0].industry;
                }
            }
        } catch (contextError) {
            console.warn('Warning: Could not fetch user context:', contextError.message);
            // Continue without context if fetch fails
        }

        // Call AI service to generate mentor response with context
        const result = await getAdvisorResponse(message, context);

        if (result.error) {
            console.error('Error generating mentor response:', result.error);
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

// GET /api/smart-suggestions - Generate personalized suggestions for dashboard
app.get('/api/smart-suggestions', async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({
                success: false,
                error: 'Missing required query parameter: userId',
            });
        }

        // Fetch user context
        let context = {};

        try {
            const supabase = getSupabaseClient();

            // Get user's past ideas
            const { data: ideasData } = await supabase
                .from('startup_ideas')
                .select('id, description, industry, created_at')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(5);

            if (ideasData && ideasData.length > 0) {
                context.pastIdeas = ideasData.map(idea => ({
                    id: idea.id,
                    title: idea.description?.split('\n')[0]?.substring(0, 50) || 'Untitled',
                    description: idea.description,
                    industry: idea.industry,
                    created_at: idea.created_at,
                }));

                // Get latest analysis for context
                if (ideasData[0]) {
                    const { data: analysisData } = await supabase
                        .from('idea_analysis')
                        .select('market_score, competition_score, feasibility_score')
                        .eq('idea_id', ideasData[0].id)
                        .single();

                    if (analysisData) {
                        context.latestAnalysis = {
                            market_score: analysisData.market_score,
                            competition_score: analysisData.competition_score,
                            feasibility_score: analysisData.feasibility_score,
                        };
                    }

                    // Get industry from latest idea
                    context.industry = ideasData[0].industry;
                }
            }
        } catch (contextError) {
            console.warn('Warning: Could not fetch user context for suggestions:', contextError.message);
            // Continue without context if fetch fails
        }

        // Generate suggestions
        const result = await generateSmartSuggestions(context);

        res.json({
            success: true,
            suggestions: result.suggestions || [],
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Error in smart-suggestions endpoint:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            suggestions: [
                { text: "Validate a new idea", type: "primary", icon: "Lightbulb" },
                { text: "Review past analyses", type: "secondary", icon: "BarChart3" },
                { text: "Get mentor advice", type: "tertiary", icon: "BookOpen" },
            ],
        });
    }
});

// POST /api/ai-advisor - Chat with AI advisor (Startup Mentor)
app.post('/api/ai-advisor', async (req, res) => {
    try {
        const { userId, message } = req.body;

        if (!userId || !message) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: userId or message',
            });
        }

        // Fetch user context for the mentor
        let context = {};

        try {
            const supabase = getSupabaseClient();

            // Get user's past ideas
            const { data: ideasData } = await supabase
                .from('startup_ideas')
                .select('id, description, industry, created_at')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(5);

            if (ideasData && ideasData.length > 0) {
                context.pastIdeas = ideasData.map(idea => ({
                    id: idea.id,
                    title: idea.description?.split('\n')[0]?.substring(0, 50) || 'Untitled',
                    description: idea.description,
                    industry: idea.industry,
                    created_at: idea.created_at,
                }));

                // Get latest analysis for context
                if (ideasData[0]) {
                    const { data: analysisData } = await supabase
                        .from('idea_analysis')
                        .select('market_score, competition_score, feasibility_score, analysis_text')
                        .eq('idea_id', ideasData[0].id)
                        .single();

                    if (analysisData) {
                        context.latestAnalysis = {
                            market_score: analysisData.market_score,
                            competition_score: analysisData.competition_score,
                            feasibility_score: analysisData.feasibility_score,
                        };
                    }

                    // Get industry from latest idea
                    context.industry = ideasData[0].industry;
                }
            }
        } catch (contextError) {
            console.warn('Warning: Could not fetch user context:', contextError.message);
            // Continue without context if fetch fails
        }

        // Call AI service to generate mentor response with context
        const result = await getAdvisorResponse(message, context);

        if (result.error) {
            console.error('Error generating mentor response:', result.error);
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

// ============================================================================
// RETENTION FEATURES - User Activity Tracking
// ============================================================================

// GET /api/retention/last-analyzed-idea - Get last analyzed idea for user
app.get('/api/retention/last-analyzed-idea', async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({
                success: false,
                error: 'Missing required parameter: userId',
            });
        }

        const supabase = getSupabaseClient();

        // Fetch last analyzed idea
        const { data, error } = await supabase
            .from('startup_ideas')
            .select(`
                id,
                idea_text,
                industry,
                created_at,
                _analysis:idea_analysis(
                    market_score,
                    competition_score,
                    feasibility_score,
                    analysis_text
                )
            `)
            .eq('user_id', userId)
            .not('_analysis', 'is', null)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (error && error.code !== 'PGRST116') throw error;

        res.json({
            success: true,
            data: data || null,
        });
    } catch (error) {
        console.error('Error fetching last analyzed idea:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// GET /api/retention/engagement-metrics - Get user engagement metrics
app.get('/api/retention/engagement-metrics', async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({
                success: false,
                error: 'Missing required parameter: userId',
            });
        }

        const supabase = getSupabaseClient();

        // Get total ideas count
        const { count: totalIdeas } = await supabase
            .from('startup_ideas')
            .select('id', { count: 'exact' })
            .eq('user_id', userId);

        // Get ideas with analysis
        const { data: ideasWithAnalysis } = await supabase
            .from('startup_ideas')
            .select('id')
            .eq('user_id', userId);

        let analyzedCount = 0;
        if (ideasWithAnalysis && ideasWithAnalysis.length > 0) {
            const { count } = await supabase
                .from('idea_analysis')
                .select('id', { count: 'exact' })
                .in('idea_id', ideasWithAnalysis.map(i => i.id));
            analyzedCount = count || 0;
        }

        res.json({
            success: true,
            data: {
                totalIdeas: totalIdeas || 0,
                analyzedIdeas: analyzedCount,
                engagementScore: calculateEngagementScore(totalIdeas || 0, analyzedCount),
            },
        });
    } catch (error) {
        console.error('Error fetching engagement metrics:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// GET /api/retention/suggestions - Get retention suggestions
app.get('/api/retention/suggestions', async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({
                success: false,
                error: 'Missing required parameter: userId',
            });
        }

        const supabase = getSupabaseClient();
        const suggestions = [];

        // Get last analyzed idea
        const { data: lastIdea } = await supabase
            .from('startup_ideas')
            .select(`
                id,
                idea_text,
                industry,
                created_at,
                _analysis:idea_analysis(
                    market_score,
                    competition_score,
                    feasibility_score
                )
            `)
            .eq('user_id', userId)
            .not('_analysis', 'is', null)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        // Suggestion 1: Improve last idea if score is low
        if (lastIdea) {
            const analysis = lastIdea._analysis?.[0];
            if (analysis) {
                const score = (analysis.market_score + (100 - analysis.competition_score) + analysis.feasibility_score) / 3;

                if (score < 70) {
                    suggestions.push({
                        type: 'improve_low_scoring_idea',
                        title: 'Improve Your Last Idea',
                        description: `Your idea "${lastIdea.idea_text.substring(0, 40)}..." scored ${Math.round(score)}/100. Here's how to improve it.`,
                        actionText: 'View Feedback',
                        actionUrl: `/reports`,
                        priority: 'high',
                        icon: 'TrendingUp',
                    });
                }
            }

            // Suggestion 2: Continue where you left off
            const lastAnalyzedDate = new Date(lastIdea.created_at);
            const daysSinceAnalysis = Math.floor((new Date() - lastAnalyzedDate) / (1000 * 60 * 60 * 24));

            if (daysSinceAnalysis > 0) {
                suggestions.push({
                    type: 'continue_analysis',
                    title: 'Continue Where You Left Off',
                    description: `Last analyzed "${lastIdea.idea_text.substring(0, 40)}..." ${daysSinceAnalysis} day${daysSinceAnalysis > 1 ? 's' : ''} ago`,
                    actionText: 'Continue',
                    actionUrl: '/reports',
                    priority: 'medium',
                    icon: 'Play',
                });
            }
        }

        // Suggestion 3: Analyze more ideas
        const { count: totalIdeas } = await supabase
            .from('startup_ideas')
            .select('id', { count: 'exact' })
            .eq('user_id', userId);

        if (totalIdeas && totalIdeas < 5) {
            suggestions.push({
                type: 'analyze_more_ideas',
                title: 'Validate More Ideas',
                description: 'You\'ve only analyzed ' + (totalIdeas || 0) + ' idea(s). Try a few more to find the best opportunity.',
                actionText: 'Create New Idea',
                actionUrl: '/validate-idea',
                priority: 'medium',
                icon: 'Lightbulb',
            });
        }

        res.json({
            success: true,
            suggestions: suggestions.sort((a, b) => {
                const priorityMap = { high: 0, medium: 1, low: 2 };
                return priorityMap[a.priority] - priorityMap[b.priority];
            }),
        });
    } catch (error) {
        console.error('Error fetching retention suggestions:', error);
        res.status(500).json({ success: false, error: 'Internal server error', suggestions: [] });
    }
});

// Helper function to calculate engagement score
function calculateEngagementScore(totalIdeas, analyzedIdeas) {
    if (totalIdeas === 0) return 0;
    const score = Math.round((analyzedIdeas / totalIdeas) * 100);
    return Math.min(score, 100);
}

// Start server
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
    console.log(`Test endpoint: http://localhost:${PORT}/api/test`);
    console.log(`\nAvailable endpoints:`);
    console.log(`  GET  /api/test                           - Health check`);
    console.log(`  GET  /api/getIdeas                       - Fetch all startup ideas`);
    console.log(`  GET  /api/get-ideas?userId=...           - Fetch ideas for user`);
    console.log(`  GET  /api/getAnalysis?ideaId=...         - Fetch idea analysis`);
    console.log(`  GET  /api/get-analysis?ideaId=...        - Fetch analysis for idea`);
    console.log(`  POST /api/analyzeIdea                    - Create and analyze an idea`);
    console.log(`  POST /api/reanalyzeIdea                  - Re-analyze an existing idea`);
    console.log(`  GET  /api/insights?userId=...            - Get user insights`);
    console.log(`  GET  /api/dashboard-stats?userId=...     - Get dashboard stats`);
    console.log(`  GET  /api/smart-suggestions?userId=...   - Get smart suggestions`);
    console.log(`  POST /api/ai-advisor                     - Chat with AI advisor`);
    console.log(`  GET  /api/retention/last-analyzed-idea   - Get last analyzed idea`);
    console.log(`  GET  /api/retention/engagement-metrics   - Get engagement metrics`);
    console.log(`  GET  /api/retention/suggestions          - Get retention suggestions`);
});
