/**
 * Activity Tracking Service
 * Tracks user activities for retention features
 */

const { supabase } = require('../config/supabaseClient');

// ============================================================================
// ACTIVITY LOGGING
// ============================================================================

/**
 * Log a user activity
 */
async function logActivity(userId, activityType, metadata = {}) {
    try {
        const { data, error } = await supabase
            .from('user_activities')
            .insert({
                user_id: userId,
                activity_type: activityType,
                metadata: metadata,
                created_at: new Date().toISOString(),
            });

        if (error) throw error;
        return { success: true, data };
    } catch (err) {
        console.error('Failed to log activity:', err);
        return { success: false, error: err.message };
    }
}

/**
 * Activity types
 */
const ACTIVITY_TYPES = {
    IDEA_CREATED: 'idea_created',
    IDEA_ANALYZED: 'idea_analyzed',
    IDEA_VIEWED: 'idea_viewed',
    IDEA_UPDATED: 'idea_updated',
    ADVISOR_USED: 'advisor_used',
    REPORTS_VIEWED: 'reports_viewed',
    LOGIN: 'login',
    LOGOUT: 'logout',
};

// ============================================================================
// ACTIVITY RETRIEVAL
// ============================================================================

/**
 * Get user's recent activities
 */
async function getUserActivities(userId, limit = 20) {
    try {
        const { data, error } = await supabase
            .from('user_activities')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return { success: true, data: data || [] };
    } catch (err) {
        console.error('Failed to fetch activities:', err);
        return { success: false, error: err.message, data: [] };
    }
}

/**
 * Get last analyzed idea
 */
async function getLastAnalyzedIdea(userId) {
    try {
        // Fetch last idea that was analyzed
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

        if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
        return { success: true, data: data || null };
    } catch (err) {
        console.error('Failed to fetch last analyzed idea:', err);
        return { success: false, error: err.message, data: null };
    }
}

/**
 * Get last viewed idea
 */
async function getLastViewedIdea(userId) {
    try {
        const { data, error } = await supabase
            .from('user_activities')
            .select(`
                metadata,
                created_at,
                idea:metadata->idea_id
            `)
            .eq('user_id', userId)
            .eq('activity_type', ACTIVITY_TYPES.IDEA_VIEWED)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return { success: true, data: data || null };
    } catch (err) {
        console.error('Failed to fetch last viewed idea:', err);
        return { success: false, error: err.message, data: null };
    }
}

/**
 * Get last used feature
 */
async function getLastUsedFeature(userId) {
    try {
        const { data, error } = await supabase
            .from('user_activities')
            .select('activity_type, created_at, metadata')
            .eq('user_id', userId)
            .in('activity_type', [
                ACTIVITY_TYPES.ADVISOR_USED,
                ACTIVITY_TYPES.REPORTS_VIEWED,
            ])
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return { success: true, data: data || null };
    } catch (err) {
        console.error('Failed to fetch last used feature:', err);
        return { success: false, error: err.message, data: null };
    }
}

/**
 * Get user engagement metrics
 */
async function getUserEngagementMetrics(userId) {
    try {
        // Get total activities count
        const { count: totalActivities, error: countError } = await supabase
            .from('user_activities')
            .select('id', { count: 'exact' })
            .eq('user_id', userId);

        if (countError) throw countError;

        // Get last activity timestamp
        const { data: lastActivity, error: lastError } = await supabase
            .from('user_activities')
            .select('created_at')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (lastError && lastError.code !== 'PGRST116') throw lastError;

        // Get activity breakdown
        const { data: breakdown, error: breakdownError } = await supabase
            .from('user_activities')
            .select('activity_type')
            .eq('user_id', userId);

        if (breakdownError) throw breakdownError;

        // Calculate metrics
        const activityCounts = {};
        breakdown?.forEach((activity) => {
            activityCounts[activity.activity_type] =
                (activityCounts[activity.activity_type] || 0) + 1;
        });

        return {
            success: true,
            data: {
                totalActivities: totalActivities || 0,
                lastActivityAt: lastActivity?.created_at || null,
                activityBreakdown: activityCounts,
                daysActive: calculateDaysActive(breakdown || []),
            },
        };
    } catch (err) {
        console.error('Failed to fetch engagement metrics:', err);
        return { success: false, error: err.message, data: null };
    }
}

/**
 * Calculate days active
 */
function calculateDaysActive(activities) {
    if (activities.length === 0) return 0;

    const dates = new Set();
    activities.forEach((activity) => {
        const date = new Date(activity.created_at).toDateString();
        dates.add(date);
    });

    return dates.size;
}

/**
 * Get retention suggestions
 */
async function getRetentionSuggestions(userId) {
    try {
        const lastAnalyzed = await getLastAnalyzedIdea(userId);
        const engagementMetrics = await getUserEngagementMetrics(userId);

        const suggestions = [];

        // Suggestion 1: Improve last idea
        if (lastAnalyzed.success && lastAnalyzed.data) {
            const idea = lastAnalyzed.data;
            const analysisScore =
                (idea._analysis[0]?.market_score +
                    (100 - idea._analysis[0]?.competition_score) +
                    idea._analysis[0]?.feasibility_score) /
                3;

            if (analysisScore < 70) {
                suggestions.push({
                    type: 'improve_low_scoring_idea',
                    title: 'Improve Your Last Idea',
                    description: `Your idea "${idea.idea_text.substring(0, 50)}..." scored ${Math.round(analysisScore)}/100. Consider the AI feedback to improve it.`,
                    actionText: 'View Feedback',
                    actionUrl: `/reports?idea=${idea.id}`,
                    priority: 'high',
                    icon: 'TrendingUp',
                });
            }
        }

        // Suggestion 2: Continue where you left off
        if (lastAnalyzed.success && lastAnalyzed.data) {
            suggestions.push({
                type: 'continue_analysis',
                title: 'Continue Where You Left Off',
                description: `Complete your analysis of "${lastAnalyzed.data.idea_text.substring(0, 40)}..." - Last analyzed ${getTimeAgo(lastAnalyzed.data.created_at)}`,
                actionText: 'Continue',
                actionUrl: `/reports?idea=${lastAnalyzed.data.id}`,
                priority: 'medium',
                icon: 'Play',
            });
        }

        // Suggestion 3: Use AI Advisor
        if (
            engagementMetrics.success &&
            !engagementMetrics.data.activityBreakdown[ACTIVITY_TYPES.ADVISOR_USED]
        ) {
            suggestions.push({
                type: 'try_advisor',
                title: 'Get Personalized Mentorship',
                description:
                    "Chat with our AI Advisor for personalized startup guidance based on your ideas.",
                actionText: 'Chat Now',
                actionUrl: '/advisor',
                priority: 'medium',
                icon: 'MessageSquare',
            });
        }

        // Suggestion 4: Analyze More Ideas
        if (
            engagementMetrics.success &&
            engagementMetrics.data.totalActivities < 5
        ) {
            suggestions.push({
                type: 'analyze_more_ideas',
                title: 'Validate More Ideas',
                description:
                    "You've analyzed only a few ideas. Try analyzing more to find the perfect startup opportunity.",
                actionText: 'Create New Idea',
                actionUrl: '/validate-idea',
                priority: 'low',
                icon: 'Lightbulb',
            });
        }

        return {
            success: true,
            data: suggestions.sort((a, b) => {
                const priorityMap = { high: 0, medium: 1, low: 2 };
                return (
                    priorityMap[a.priority] - priorityMap[b.priority]
                );
            }),
        };
    } catch (err) {
        console.error('Failed to fetch retention suggestions:', err);
        return { success: false, error: err.message, data: [] };
    }
}

/**
 * Get time ago string
 */
function getTimeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - new Date(date)) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
        return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
        return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return new Date(date).toLocaleDateString();
}

module.exports = {
    logActivity,
    getUserActivities,
    getLastAnalyzedIdea,
    getLastViewedIdea,
    getLastUsedFeature,
    getUserEngagementMetrics,
    getRetentionSuggestions,
    ACTIVITY_TYPES,
};
