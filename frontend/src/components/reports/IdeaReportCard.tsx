import { motion } from 'framer-motion';
import {
    Trash2,
    RotateCcw,
    ChevronRight,
    Layers,
    ChevronDown,
    TrendingUp,
    Crosshair,
    Zap,
} from 'lucide-react';
import { useState } from 'react';
import { ScoreRing } from './ScoreRing';

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
        y: -2,
        transition: { type: 'spring', stiffness: 200, damping: 20 },
    },
};

const expandVariants = {
    collapsed: { height: 0, opacity: 0 },
    expanded: { height: 'auto', opacity: 1, transition: { duration: 0.3 } },
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

    const getScoreColor = (score: number) => {
        if (score >= 80) return {
            badge: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
            text: 'text-green-700 dark:text-green-400',
            bar: 'from-green-500 to-green-600',
            label: 'Excellent'
        };
        if (score >= 60) return {
            badge: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
            text: 'text-yellow-700 dark:text-yellow-400',
            bar: 'from-yellow-500 to-yellow-600',
            label: 'Good'
        };
        return {
            badge: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
            text: 'text-red-700 dark:text-red-400',
            bar: 'from-red-500 to-red-600',
            label: 'Needs Work'
        };
    };

    return (
        <motion.div
            variants={cardVariants}
            whileHover="hover"
            className="rounded-xl border border-default shadow-sm hover:shadow-md transition-shadow duration-300 bg-surface-primary overflow-hidden"
        >
            <div className="p-6 space-y-6">
                {/* Header: Title and Score */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <h3 className="heading-lg text-primary truncate mb-2">
                            {title || 'Untitled Idea'}
                        </h3>
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold">
                                {industry}
                            </span>
                            <span className="text-xs text-muted label-sm">
                                {new Date(createdAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </span>
                        </div>
                    </div>

                    {/* Score Ring */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1, duration: 0.5 }}
                        className="shrink-0"
                    >
                        <ScoreRing score={avgScore} size={90} strokeWidth={7} label={getScoreColor(avgScore).label} />
                    </motion.div>
                </div>

                {/* Divider */}
                <div className="h-px bg-border-subtle" />

                {/* Description */}
                {description && (
                    <p className="body-md text-secondary line-clamp-2 leading-relaxed">
                        {description}
                    </p>
                )}

                {/* Score Breakdown Section */}
                <div className="space-y-4">
                    <h4 className="label-md text-primary flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Score Breakdown
                    </h4>

                    {/* Market Potential */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 }}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <label className="flex items-center gap-2 text-sm text-secondary">
                                <span>📈</span>
                                <span>Market Potential</span>
                            </label>
                            <span className={`font-bold text-sm ${getScoreColor(marketScore).text}`}>
                                {marketScore}/100
                            </span>
                        </div>
                        <div className="h-3 bg-surface-secondary rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${marketScore}%` }}
                                transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                                className={`h-full bg-gradient-to-r ${getScoreColor(marketScore).bar} rounded-full`}
                            />
                        </div>
                    </motion.div>

                    {/* Competition Score */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25 }}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <label className="flex items-center gap-2 text-sm text-secondary">
                                <span>⚔️</span>
                                <span>Low Competition</span>
                            </label>
                            <span className={`font-bold text-sm ${getScoreColor(100 - competitionScore).text}`}>
                                {100 - competitionScore}/100
                            </span>
                        </div>
                        <div className="h-3 bg-surface-secondary rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${100 - competitionScore}%` }}
                                transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                                className={`h-full bg-gradient-to-r ${getScoreColor(100 - competitionScore).bar} rounded-full`}
                            />
                        </div>
                    </motion.div>

                    {/* Feasibility Score */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.35 }}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <label className="flex items-center gap-2 text-sm text-secondary">
                                <span>⚙️</span>
                                <span>Feasibility</span>
                            </label>
                            <span className={`font-bold text-sm ${getScoreColor(feasibilityScore).text}`}>
                                {feasibilityScore}/100
                            </span>
                        </div>
                        <div className="h-3 bg-surface-secondary rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${feasibilityScore}%` }}
                                transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
                                className={`h-full bg-gradient-to-r ${getScoreColor(feasibilityScore).bar} rounded-full`}
                            />
                        </div>
                    </motion.div>
                </div>

                {/* Expand Analysis Button */}
                {analysisText && (
                    <>
                        <div className="h-px bg-border-subtle" />
                        <motion.button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="w-full py-2.5 px-3 rounded-lg text-sm font-semibold text-primary hover:bg-surface-secondary bg-surface-secondary/50 border border-default hover:border-primary/30 transition-all flex items-center justify-center gap-2"
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                        >
                            <span>
                                {isExpanded ? 'Hide' : 'Show'} Full Analysis
                            </span>
                            <motion.div
                                animate={{ rotate: isExpanded ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <ChevronDown className="w-4 h-4" />
                            </motion.div>
                        </motion.button>
                    </>
                )}

                {/* Expandable Analysis Section */}
                {analysisText && (
                    <motion.div
                        variants={expandVariants}
                        initial="collapsed"
                        animate={isExpanded ? 'expanded' : 'collapsed'}
                        className="overflow-hidden"
                    >
                        <div className="p-4 rounded-lg bg-surface-secondary border border-default">
                            <p className="text-sm leading-relaxed text-secondary whitespace-pre-wrap">
                                {analysisText}
                            </p>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 px-6 py-4 border-t border-default bg-surface-secondary/30">
                <button
                    onClick={() => onSelect?.(id)}
                    className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary/90 transition-colors duration-200 flex items-center justify-center gap-2"
                >
                    <ChevronRight className="w-4 h-4" />
                    <span className="hidden sm:inline">View Details</span>
                    <span className="sm:hidden">Details</span>
                </button>
                {onReanalyze && (
                    <button
                        onClick={() => onReanalyze(id)}
                        className="px-4 py-2 rounded-lg text-sm font-semibold text-yellow-700 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30 hover:bg-yellow-200 dark:hover:bg-yellow-900/50 border border-yellow-200 dark:border-yellow-800 transition-colors duration-200 flex items-center justify-center gap-1"
                        title="Re-analyze this idea"
                    >
                        <RotateCcw className="w-4 h-4" />
                        <span className="hidden sm:inline">Re-analyze</span>
                    </button>
                )}

                {onCompare && (
                    <button
                        onClick={() => onCompare(id)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 flex items-center justify-center gap-1 border ${isSelected
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                            : 'bg-surface-secondary text-secondary border-default hover:bg-surface-tertiary'
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
                        className="px-4 py-2 rounded-lg text-sm font-semibold text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 border border-red-200 dark:border-red-800 transition-colors duration-200 flex items-center justify-center"
                        title="Delete report"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}
            </div>
        </motion.div>
    );
};
