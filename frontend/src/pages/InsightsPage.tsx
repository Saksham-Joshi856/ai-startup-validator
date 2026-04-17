import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useInsights } from "@/hooks/useApiCalls";
import { IndustryTrendChart } from "@/components/charts/IndustryTrendChart";
import { LazyMarketOpportunityChart } from "@/components/charts/LazyMarketOpportunityChart";
import { LoadingTimeout } from "@/components/common/LoadingTimeout";
import { StatSkeleton } from "@/components/common/SkeletonLoaders";

export const InsightsPage = () => {
    const { user } = useAuth();
    const { insights, loading, isTimeout } = useInsights(user?.id || null);

    const displayInsights = insights || {
        avg_market_score: 72,
        avg_competition_score: 65,
        avg_feasibility_score: 78,
        total_ideas: 0,
    };

    return (
        <>
            {/* Loading Timeout Message */}
            <LoadingTimeout isVisible={isTimeout && loading} />

            {/* Hero Section */}
            <div className="relative px-6 pt-6 pb-2">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="relative z-10"
                >
                    <div className="flex items-center gap-3 mb-1">
                        <TrendingUp className="w-6 h-6 text-primary" />
                        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Market Insights</h1>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Real-time market trends and opportunities in the startup ecosystem
                    </p>
                </motion.div>
            </div>

            {/* Charts Section */}
            <div className="px-6 pb-8">
                {loading && !insights ? (
                    <StatSkeleton />
                ) : (
                    <>
                        {/* Top Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05, duration: 0.5 }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
                        >
                            {[
                                { label: "Market Score", value: displayInsights.avg_market_score?.toFixed(1) || "N/A", change: "+0%" },
                                { label: "Competition Score", value: displayInsights.avg_competition_score?.toFixed(1) || "N/A", change: "+0%" },
                                { label: "Feasibility Score", value: displayInsights.avg_feasibility_score?.toFixed(1) || "N/A", change: "+0%" },
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.05 + i * 0.05 }}
                                    className="glass-effect rounded-xl p-4 border border-primary/10"
                                >
                                    <p className="text-xs text-muted-foreground font-medium mb-1">{stat.label}</p>
                                    <div className="flex items-end justify-between">
                                        <p className="text-2xl font-bold text-foreground">{stat.value}/100</p>
                                        <span className="text-xs font-semibold text-green-600">{stat.change}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Charts Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1, duration: 0.5 }}
                            >
                                <IndustryTrendChart />
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15, duration: 0.5 }}
                            >
                                <LazyMarketOpportunityChart />
                            </motion.div>
                        </div>

                        {/* Insights Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="glass-effect rounded-xl p-6 border border-primary/10"
                        >
                            <h3 className="font-semibold text-foreground mb-4">Key Market Trends</h3>
                            <ul className="space-y-3">
                                {[
                                    "AI/ML startups leading funding rounds with 42% of total",
                                    "Enterprise SaaS experiencing 18% YoY growth",
                                    "FinTech innovation accelerating in emerging markets",
                                    "Sustainability-focused startups attracting institutional investors",
                                ].map((trend, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                                        <span className="text-primary font-bold mt-1">→</span>
                                        <span>{trend}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </>
                )}
            </div>
        </>
    );
};

export default InsightsPage;
