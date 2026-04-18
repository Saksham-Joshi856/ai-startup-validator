/**
 * Last Analyzed Idea Component
 * Shows the user's last analyzed idea with quick action to continue
 */

import React from "react";
import { motion } from "framer-motion";
import { Lightbulb, ChevronRight, TrendingUp } from "lucide-react";
import { useLastAnalyzedIdea } from "@/hooks/useRetention";
import { useNavigate } from "react-router-dom";
import { cardVariants, containerVariants } from "@/lib/animations";
import { SingleCardSkeleton } from "@/components/common/SkeletonLoaders";

interface LastAnalyzedIdeaProps {
    userId: string | null;
    onNavigate?: (path: string) => void;
}

export function LastAnalyzedIdea({
    userId,
    onNavigate,
}: LastAnalyzedIdeaProps) {
    const navigate = useNavigate();
    const { idea, loading } = useLastAnalyzedIdea(userId);

    if (loading) {
        return <SingleCardSkeleton />;
    }

    if (!idea) {
        return null;
    }

    const analysis = idea._analysis?.[0];
    const score = analysis
        ? Math.round(
            (analysis.market_score +
                (100 - analysis.competition_score) +
                analysis.feasibility_score) /
            3
        )
        : 0;

    const getScoreColor = (score: number) => {
        if (score >= 70) return "text-emerald-500";
        if (score >= 50) return "text-yellow-500";
        return "text-red-500";
    };

    const handleContinue = () => {
        const path = `/reports?idea=${idea.id}`;
        onNavigate ? onNavigate(path) : navigate(path);
    };

    return (
        <motion.div
            variants={cardVariants}
            className="p-6 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 hover:border-blue-500/40 transition-colors cursor-pointer"
            onClick={handleContinue}
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/20">
                        <Lightbulb className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-muted-foreground">
                            Last Analyzed
                        </p>
                        <h3 className="text-sm font-bold text-foreground line-clamp-1">
                            {idea.idea_text.substring(0, 50)}
                        </h3>
                    </div>
                </div>
                <div className={`text-lg font-bold ${getScoreColor(score)}`}>
                    {score}%
                </div>
            </div>

            <div className="mb-4 flex items-center gap-2">
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                    {idea.industry}
                </span>
                <span className="text-xs text-muted-foreground">
                    {new Date(idea.created_at).toLocaleDateString()}
                </span>
            </div>

            <button
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-sm font-medium transition-colors"
                onClick={(e) => {
                    e.stopPropagation();
                    handleContinue();
                }}
            >
                <span>Continue Analyzing</span>
                <ChevronRight className="w-4 h-4" />
            </button>
        </motion.div>
    );
}

export default LastAnalyzedIdea;
