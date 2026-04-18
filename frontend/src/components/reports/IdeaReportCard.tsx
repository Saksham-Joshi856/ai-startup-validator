import { motion } from 'framer-motion';
import {
    Trash2,
    RotateCcw,
    ChevronRight,
    TrendingUp,
    Layers,
} from 'lucide-react';
import { ScoreIndicator } from '@/components/dashboard/ScoreIndicator';

export interface IdeaReportCardProps {
    id: string;
    title: string;
    industry: string;
    description?: string;
    marketScore: number;
    competitionScore: number;
    feasibilityScore: number;
    createdAt: string;
    isSelected?: boolean;
    onSelect?: (id: string) => void;
    onReanalyze?: (id: string) => void;
    onDelete?: (id: string) => void;
    onCompare?: (id: string) => void;
}

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
        opacity: 1,
        y: 0,
        transition: { type: 'spring', stiffness: 100, damping: 15 },
    },
    hover: {
        y: -4,
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
        transition: { type: 'spring', stiffness: 200, damping: 20 },
    },
};

export const IdeaReportCard = ({
    id,
    title,
    industry,
    description,
    marketScore,
    competitionScore,
    feasibilityScore,
    createdAt,
    isSelected = false,
    onSelect,
    onReanalyze,
    onDelete,
    onCompare,
}: IdeaReportCardProps) => {
    const avgScore = Math.round(
        (marketScore + (100 - competitionScore) + feasibilityScore) / 3
    );

    const getScoreHealth = (score: number) => {
        if (score >= 70) return { label: 'Strong', color: 'text-emerald-500' };
        if (score >= 50) return { label: 'Moderate', color: 'text-yellow-500' };
        return { label: 'Low', color: 'text-red-500' };
    };

    const health = getScoreHealth(avgScore);

    return (
        <motion.div
            variants={cardVariants}
            whileHover="hover"
            className={`relative group rounded-lg border transition-all duration-300 overflow-hidden ${isSelected
                ? 'bg-gradient-to-br from-primary/10 to-primary/5 border-primary/40'
                : 'bg-gradient-to-br from-slate-900/50 to-slate-800/30 border-slate-700/40 hover:border-primary/40'
                }`}
        >
            {/* Background gradient animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-5 transition-opacity duration-500" />

            {/* Content */}
            <div className="relative z-10 p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-foreground truncate text-lg mb-1">
                            {title || 'Untitled Idea'}
                        </h3>
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-medium px-2 py-1 rounded-md bg-primary/10 text-primary border border-primary/20">
                                {industry}
                            </span>
                            <span className="text-xs text-muted-foreground">
                                {new Date(createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>

                    {/* Avg Score */}
                    <div className="ml-4 text-right">
                        <div className={`text-3xl font-black ${health.color}`}>
                            {avgScore}
                        </div>
                        <span className="text-xs font-medium text-muted-foreground">
                            {health.label}
                        </span>
                    </div>
                </div>

                {/* Description */}
                {description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {description}
                    </p>
                )}

                {/* Score Breakdown */}
                <div className="mb-4">
                    <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs font-semibold text-muted-foreground">Score Breakdown</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <ScoreIndicator
                            label="Market"
                            score={marketScore}
                            size="sm"
                        />
                        <ScoreIndicator
                            label="Competition"
                            score={100 - competitionScore}
                            size="sm"
                        />
                        <ScoreIndicator
                            label="Feasibility"
                            score={feasibilityScore}
                            size="sm"
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-3 border-t border-slate-700/30">
                    <button
                        onClick={() => onSelect?.(id)}
                        className="flex-1 px-3 py-2 rounded-md text-sm font-medium text-foreground bg-slate-700/30 hover:bg-slate-700/50 transition-colors flex items-center justify-center gap-1"
                    >
                        <ChevronRight className="w-4 h-4" />
                        Details
                    </button>

                    {onReanalyze && (
                        <button
                            onClick={() => onReanalyze(id)}
                            className="px-3 py-2 rounded-md text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 transition-colors flex items-center justify-center gap-1"
                            title="Re-analyze this idea"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Re-analyze
                        </button>
                    )}

                    {onCompare && (
                        <button
                            onClick={() => onCompare(id)}
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-1 ${isSelected
                                ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                                : 'bg-slate-700/30 text-slate-400 hover:bg-slate-700/50'
                                }`}
                            title="Compare ideas"
                        >
                            <Layers className="w-4 h-4" />
                            Compare
                        </button>
                    )}

                    {onDelete && (
                        <button
                            onClick={() => onDelete(id)}
                            className="px-3 py-2 rounded-md text-sm font-medium text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-colors flex items-center justify-center"
                            title="Delete report"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
};
