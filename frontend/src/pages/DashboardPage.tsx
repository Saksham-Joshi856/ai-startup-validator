import { motion } from "framer-motion";
import { LayoutDashboard } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useDashboardStats } from "@/hooks/useApiCalls";
import { usePersonalizedInsights } from "@/hooks/usePersonalizedInsights";
import { StatCard } from "@/components/cards/StatCard";
import { RecentValidations } from "@/components/dashboard/RecentValidations";
import { InsightsPanel } from "@/components/dashboard/InsightsPanel";
import { IdeaSubmissionForm } from "@/components/dashboard/IdeaSubmissionForm";
import { SmartSuggestionCards } from "@/components/dashboard/SmartSuggestionCards";
import { PersonalizedInsightsCard } from "@/components/dashboard/PersonalizedInsightsCard";
import { ScoreTrendChart } from "@/components/dashboard/ScoreTrendChart";
import { QuickActionsPanel } from "@/components/dashboard/QuickActionsPanel";
import { IdeasList } from "@/components/dashboard/IdeasList";
import { IndustryTrendChart } from "@/components/charts/IndustryTrendChart";
import { ScoreDistributionChart } from "@/components/charts/ScoreDistributionChart";
import { LazyMarketOpportunityChart } from "@/components/charts/LazyMarketOpportunityChart";
import { ParticleBackground } from "@/components/dashboard/ParticleBackground";
import { FloatingActionButton } from "@/components/dashboard/FloatingActionButton";
import { LoadingTimeout } from "@/components/common/LoadingTimeout";
import { StatSkeleton, CardSkeleton, TableSkeleton } from "@/components/common/SkeletonLoaders";
import { LastAnalyzedIdea } from "@/components/retention/LastAnalyzedIdea";
import { RetentionReminders } from "@/components/retention/RetentionReminders";
import { EngagementStatus } from "@/components/retention/EngagementStatus";
import { statsData as mockStatsData } from "@/lib/mock-data";

const stagger = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

export const DashboardPage = () => {
    const { user } = useAuth();
    const { stats, loading, isTimeout } = useDashboardStats(user?.id || null);
    const { insights, loading: insightsLoading } = usePersonalizedInsights(user?.id || null);

    // Transform API stats to StatCard format
    const displayStats = stats
        ? [
            { label: "Total Ideas Analyzed", value: stats.total_ideas || 0, change: "+0%", positive: true, icon: "Lightbulb" as const },
            { label: "Average Startup Score", value: stats.avg_score || 0, change: "+0%", positive: true, icon: "TrendingUp" as const, suffix: "/100" },
            { label: "Success Rate", value: stats.success_rate || 0, change: "+0%", positive: true, icon: "CheckCircle" as const, suffix: "%" },
        ]
        : mockStatsData.slice(0, 3); // Fallback to mock data

    return (
        <>
            {/* Loading Timeout Message */}
            <LoadingTimeout isVisible={isTimeout && loading} />

            {/* Hero Section */}
            <div className="relative px-4 sm:px-6 md:px-8 pt-6 pb-4">
                <ParticleBackground />
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="relative z-10"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <LayoutDashboard className="w-6 h-6 text-primary" />
                        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Real-time startup validation analytics &amp; insights
                    </p>
                </motion.div>
            </div>

            <div className="px-4 sm:px-6 md:px-8 pb-8 space-y-6">
                {/* Stats Grid - Show skeleton while loading */}
                {loading && !stats ? (
                    <StatSkeleton />
                ) : (
                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    >
                        {displayStats.map((stat, i) => (
                            <StatCard key={stat.label} {...stat} index={i} />
                        ))}
                    </motion.div>
                )}

                {/* RETENTION FEATURES */}
                {/* Engagement Reminders */}
                <div>
                    <RetentionReminders userId={user?.id || null} maxSuggestions={3} />
                </div>

                {/* Last Analyzed Idea - Quick Continue Action */}
                <div>
                    <LastAnalyzedIdea userId={user?.id || null} />
                </div>

                {/* Engagement Status */}
                <div>
                    <EngagementStatus userId={user?.id || null} />
                </div>

                {/* Smart Suggestion Cards */}
                <div>
                    <SmartSuggestionCards userId={user?.id || null} />
                </div>

                {/* Personalized Insights Card */}
                <div>
                    <PersonalizedInsightsCard insights={insights} loading={insightsLoading} />
                </div>

                {/* Score Trend Chart */}
                <div>
                    <ScoreTrendChart data={insights.scoresTrend} />
                </div>

                {/* Quick Actions Panel */}
                <div>
                    <QuickActionsPanel />
                </div>

                {/* Idea Submission Form */}
                <div>
                    <IdeaSubmissionForm />
                </div>

                {/* Ideas List */}
                <div>
                    <IdeasList />
                </div>

                {/* Charts Row 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <IndustryTrendChart />
                    <ScoreDistributionChart />
                </div>

                {/* Table + Insights */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        {loading && !stats ? <TableSkeleton /> : <RecentValidations />}
                    </div>
                    <InsightsPanel />
                </div>

                {/* Market Opportunity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <LazyMarketOpportunityChart />
                </div>
            </div>

            <FloatingActionButton />
        </>
    );
};

export default DashboardPage;
