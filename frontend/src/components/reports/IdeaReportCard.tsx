import { motion } from 'framer-motion';
import {
    Trash2,
    RotateCcw,
    ChevronRight,
    TrendingUp,
    Layers,
    ChevronDown,
} from 'lucide-react';
import { useState } from 'react';
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
    analysisText?: string;
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
    analysisText,
    isSelected = false,
    onSelect,
    onReanalyze,
    onDelete,
    onCompare,
}: IdeaReportCardProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const avgScore = Math.round(
        (marketScore + (100 - competitionScore) + feasibilityScore) / 3
    );

    const getScoreHealth = (score: number) => {
        if (score >= 70) return { label: 'Strong', color: 'text-emerald-500' };
        if (score >= 50) return { label: 'Moderate', color: 'text-yellow-500' };
        return { label: 'Low', color: 'text-red-500' };
    };

    const health = getScoreHealth(avgScore);

    const expandVariants = {
        collapsed: { height: 0, opacity: 0 },
        expanded: { height: 'auto', opacity: 1, transition: { duration: 0.3 } },
    };

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
            <div className="relative z-10">
                <div className="p-5">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-foreground truncate text-lg mb-2">
                                {title || 'Untitled Idea'}
                            </h3>
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs font-medium px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 transition-colors">
                                    {industry}
                                </span>
                                <span className="text-xs text-muted-foreground/70">
                                    {new Date(createdAt).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </span>
                            </div>
                        </div>

                        {/* Avg Score Badge */}
                        <div className="ml-4 text-right">
                            <motion.div
                                className={`text-3xl font-black ${health.color}`}
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 100 }}
                            >
                                {avgScore}
                            </motion.div>
                            <span className="text-xs font-semibold text-muted-foreground block mt-1">
                                {health.label}
                            </span>
                        </div>
                    </div>

                    {/* Description */}
                    {description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
                            {description}
                        </p>
                    )}

                    {/* Score Breakdown with Progress Bars */}
                    <div className="mb-4 p-3 rounded-lg bg-slate-800/30 backdrop-blur-sm border border-slate-700/20">
                        <div className="flex items-center gap-2 mb-3">
                            <TrendingUp className="w-4 h-4 text-primary/70" />
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Score Breakdown</span>
                        </div>

                        {/* Market Score */}
                        <div className="mb-3">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs text-muted-foreground/80">Market Potential</span>
                                <span className="text-xs font-bold text-emerald-400">{marketScore}/100</span>
                            </div>
                            <div className="w-full h-2 bg-slate-900/50 rounded-full overflow-hidden border border-slate-700/20">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${marketScore}%` }}
                                    transition={{ duration: 0.6, ease: 'easeOut' }}
                                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                                />
                            </div>
                        </div>

                        {/* Competition Score */}
                        <div className="mb-3">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs text-muted-foreground/80">Low Competition</span>
                                <span className="text-xs font-bold text-blue-400">{100 - competitionScore}/100</span>
                            </div>
                            <div className="w-full h-2 bg-slate-900/50 rounded-full overflow-hidden border border-slate-700/20">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${100 - competitionScore}%` }}
                                    transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
                                    className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
                                />
                            </div>
                        </div>

                        {/* Feasibility Score */}
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs text-muted-foreground/80">Feasibility</span>
                                <span className="text-xs font-bold text-purple-400">{feasibilityScore}/100</span>
                            </div>
                            <div className="w-full h-2 bg-slate-900/50 rounded-full overflow-hidden border border-slate-700/20">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${feasibilityScore}%` }}
                                    transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
                                    className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Expand Analysis Button */}
                    {analysisText && (
                        <motion.button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="w-full py-2 px-3 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground bg-slate-800/30 hover:bg-slate-800/50 border border-slate-700/20 hover:border-primary/30 transition-all flex items-center justify-center gap-2 mb-3"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <span>
                                {isExpanded ? 'Hide' : 'Show'} Full Analysis
                            </span>
                            <ChevronDown
                                className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                            />
                        </motion.button>
                    )}

                    {/* Expandable Analysis Section */}
                    {analysisText && (
                        <motion.div
                            variants={expandVariants}
                            initial="collapsed"
                            animate={isExpanded ? 'expanded' : 'collapsed'}
                            className="overflow-hidden"
                        >
                            <div className="p-3 rounded-lg bg-slate-900/40 border border-primary/20 mb-3">
                                <p className="text-xs leading-relaxed text-muted-foreground/90 whitespace-pre-wrap">
                                    {analysisText}
                                </p>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 px-5 py-3 border-t border-slate-700/30 bg-slate-900/20">
                    <button
                        onClick={() => onSelect?.(id)}
                        className="flex-1 px-3 py-2 rounded-md text-sm font-medium text-foreground bg-gradient-to-r from-primary/40 to-primary/20 hover:from-primary/50 hover:to-primary/30 border border-primary/30 hover:border-primary/50 transition-all flex items-center justify-center gap-2 group/btn"
                    >
                        <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                        Details
                    </button>
                    {onReanalyze && (
                        <button
                            onClick={() => onReanalyze(id)}
                            className="px-3 py-2 rounded-md text-sm font-medium text-amber-400/80 hover:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 hover:border-amber-500/40 transition-all flex items-center justify-center gap-1"
                            title="Re-analyze this idea"
                        >
                            <RotateCcw className="w-4 h-4" />
                            <span className="hidden sm:inline">Re-analyze</span>
                        </button>
                    )}

                    {onCompare && (
                        <button
                            onClick={() => onCompare(id)}
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-1 border ${isSelected
                                ? 'bg-blue-500/20 text-blue-400 border-blue-500/40 hover:bg-blue-500/30'
                                : 'bg-slate-700/30 text-slate-400 hover:text-slate-300 border-slate-700/40 hover:bg-slate-700/50'
                                }`}
                            title="Compare ideas"
                        >
                            <Layers className="w-4 h-4" />
                            <span className="hidden sm:inline">Compare</span>
                        </button>
                    )}

                    {onDelete && (
                        <button
                            onClick={() => onDelete(id)}
                            className="px-3 py-2 rounded-md text-sm font-medium text-red-400/60 hover:text-red-400 hover:bg-red-500/10 border border-red-500/20 hover:border-red-500/40 transition-all flex items-center justify-center"
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
