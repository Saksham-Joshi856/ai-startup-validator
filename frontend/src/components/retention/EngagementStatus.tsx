/**
 * Engagement Status Component
 * Shows user engagement metrics and progress
 */

import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, Zap, Target } from "lucide-react";
import { useEngagementMetrics } from "@/hooks/useRetention";
import { cardVariants } from "@/lib/animations";
import { SingleCardSkeleton } from "@/components/common/SkeletonLoaders";

interface EngagementStatusProps {
    userId: string | null;
}

export function EngagementStatus({ userId }: EngagementStatusProps) {
    const { metrics, loading } = useEngagementMetrics(userId);

    if (loading) {
        return <SingleCardSkeleton />;
    }

    if (!metrics) {
        return null;
    }

    const engagementLevel =
        metrics.engagementScore >= 80
            ? { label: "Excellent", color: "text-emerald-500", bg: "bg-emerald-500/10" }
            : metrics.engagementScore >= 60
                ? { label: "Good", color: "text-yellow-500", bg: "bg-yellow-500/10" }
                : metrics.engagementScore >= 40
                    ? { label: "Fair", color: "text-orange-500", bg: "bg-orange-500/10" }
                    : { label: "Low", color: "text-red-500", bg: "bg-red-500/10" };

    return (
        <motion.div
            variants={cardVariants}
            className="p-5 rounded-lg bg-gradient-to-br from-slate-500/10 to-slate-500/5 border border-slate-500/20"
        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-slate-500/20">
                        <Zap className="w-5 h-5 text-slate-400" />
                    </div>
                    <p className="text-xs font-semibold text-muted-foreground">
                        Engagement Status
                    </p>
                </div>
                <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`text-sm font-bold px-2.5 py-1 rounded ${engagementLevel.bg} ${engagementLevel.color}`}
                >
                    {engagementLevel.label}
                </motion.span>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-muted-foreground">
                        Analysis Completion
                    </p>
                    <p className="text-xs font-semibold text-foreground">
                        {metrics.analyzedIdeas}/{metrics.totalIdeas}
                    </p>
                </div>
                <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{
                            width: `${metrics.totalIdeas > 0 ? (metrics.analyzedIdeas / metrics.totalIdeas) * 100 : 0}%`,
                        }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-blue-500 to-emerald-500"
                    />
                </div>
            </div>

            {/* Engagement Score */}
            <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-background/50">
                    <p className="text-xs text-muted-foreground mb-1">
                        Total Ideas
                    </p>
                    <p className="text-xl font-bold text-foreground">
                        {metrics.totalIdeas}
                    </p>
                </div>
                <div className="p-3 rounded-lg bg-background/50">
                    <p className="text-xs text-muted-foreground mb-1">
                        Analyzed
                    </p>
                    <p className="text-xl font-bold text-emerald-500">
                        {metrics.analyzedIdeas}
                    </p>
                </div>
            </div>

            {metrics.totalIdeas === 0 && (
                <p className="text-xs text-muted-foreground mt-3 text-center">
                    Create your first idea to get started!
                </p>
            )}
        </motion.div>
    );
}

export default EngagementStatus;
