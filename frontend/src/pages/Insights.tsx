import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { IndustryTrendChart } from "@/components/charts/IndustryTrendChart";
import { MarketOpportunityChart } from "@/components/charts/MarketOpportunityChart";

const Insights = () => {
    return (
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

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <IndustryTrendChart />
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <MarketOpportunityChart />
                </motion.div>
            </div>
        </div>
    );
};

export default Insights;
