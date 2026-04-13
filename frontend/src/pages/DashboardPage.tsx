import { motion } from "framer-motion";
import { LayoutDashboard } from "lucide-react";
import { StatCard } from "@/components/cards/StatCard";
import { RecentValidations } from "@/components/dashboard/RecentValidations";
import { InsightsPanel } from "@/components/dashboard/InsightsPanel";
import { IdeaSubmissionForm } from "@/components/dashboard/IdeaSubmissionForm";
import { IdeasList } from "@/components/dashboard/IdeasList";
import { IndustryTrendChart } from "@/components/charts/IndustryTrendChart";
import { ScoreDistributionChart } from "@/components/charts/ScoreDistributionChart";
import { MarketOpportunityChart } from "@/components/charts/MarketOpportunityChart";
import { ParticleBackground } from "@/components/dashboard/ParticleBackground";
import { FloatingActionButton } from "@/components/dashboard/FloatingActionButton";
import { statsData } from "@/lib/mock-data";

const stagger = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

export const DashboardPage = () => {
    return (
        <>
            {/* Hero Section */}
            <div className="relative px-6 pt-6 pb-2">
                <ParticleBackground />
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="relative z-10"
                >
                    <div className="flex items-center gap-3 mb-1">
                        <LayoutDashboard className="w-6 h-6 text-primary" />
                        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Dashboard</h1>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/20 ai-badge-glow">
                            AI Powered
                        </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Real-time startup validation analytics &amp; insights
                    </p>
                </motion.div>
            </div>

            <div className="px-6 pb-8">
                {/* Stats Grid */}
                <motion.div
                    variants={stagger}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
                >
                    {statsData.map((stat, i) => (
                        <StatCard key={stat.label} {...stat} index={i} />
                    ))}
                </motion.div>

                {/* Idea Submission Form */}
                <div className="mb-8">
                    <IdeaSubmissionForm />
                </div>

                {/* Ideas List */}
                <div className="mb-8">
                    <IdeasList />
                </div>

                {/* Charts Row 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                    <IndustryTrendChart />
                    <ScoreDistributionChart />
                </div>

                {/* Table + Insights */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                    <div className="lg:col-span-2">
                        <RecentValidations />
                    </div>
                    <InsightsPanel />
                </div>

                {/* Market Opportunity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <MarketOpportunityChart />
                </div>
            </div>

            <FloatingActionButton />
        </>
    );
};

export default DashboardPage;
