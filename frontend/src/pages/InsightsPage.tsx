import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { IndustryTrendChart } from "@/components/charts/IndustryTrendChart";
import { MarketOpportunityChart } from "@/components/charts/MarketOpportunityChart";

export const InsightsPage = () => {
    return (
        <>
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
                {/* Top Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05, duration: 0.5 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
                >
                    {[
                        { label: "Active Startups", value: "12.5K", change: "+23%" },
                        { label: "Avg Funding", value: "$2.3M", change: "+15%" },
                        { label: "Success Rate", value: "68%", change: "+8%" },
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
                                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
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
                        <MarketOpportunityChart />
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
            </div>
        </>
    );
};

export default InsightsPage;
