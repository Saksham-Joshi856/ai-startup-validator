import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp } from 'lucide-react';
import { ScoreIndicator } from '@/components/dashboard/ScoreIndicator';

export interface IdeaComparisonData {
    id: string;
    title: string;
    industry: string;
    marketScore: number;
    competitionScore: number;
    feasibilityScore: number;
}

interface CompareIdeasModalProps {
    ideas: IdeaComparisonData[];
    isOpen: boolean;
    onClose: () => void;
}

const getScoreComparison = (score: number, otherScore: number) => {
    const diff = score - otherScore;
    if (Math.abs(diff) < 5) return 'same';
    return diff > 0 ? 'higher' : 'lower';
};

export const CompareIdeasModal = ({
    ideas,
    isOpen,
    onClose,
}: CompareIdeasModalProps) => {
    if (ideas.length < 2) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.95 }}
                        className="relative bg-slate-900 rounded-t-2xl md:rounded-2xl border border-slate-700/40 w-full md:max-w-3xl max-h-[90vh] overflow-y-auto"
                    >
                        {/* Header */}
                        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-slate-700/40 bg-slate-900/95 backdrop-blur">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-primary" />
                                <h2 className="text-xl font-bold text-foreground">
                                    Compare Ideas
                                </h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-lg hover:bg-slate-700/50 transition-colors"
                            >
                                <X className="w-5 h-5 text-muted-foreground" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            {/* Metrics Comparison */}
                            <div className="space-y-6">
                                {/* Market Score */}
                                <div className="p-4 rounded-lg bg-slate-800/40 border border-slate-700/40">
                                    <h3 className="text-sm font-semibold text-muted-foreground mb-4">
                                        Market Potential Score
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {ideas.map((idea) => (
                                            <div key={idea.id} className="space-y-2">
                                                <p className="text-sm font-medium text-foreground">
                                                    {idea.title}
                                                </p>
                                                <ScoreIndicator
                                                    label="Market"
                                                    score={idea.marketScore}
                                                    size="lg"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    {ideas.length === 2 && (
                                        <div className="mt-3 p-2 rounded bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300">
                                            💡 {ideas[0].marketScore > ideas[1].marketScore
                                                ? ideas[0].title
                                                : ideas[1].title} has stronger market potential
                                        </div>
                                    )}
                                </div>

                                {/* Competition Score */}
                                <div className="p-4 rounded-lg bg-slate-800/40 border border-slate-700/40">
                                    <h3 className="text-sm font-semibold text-muted-foreground mb-4">
                                        Competition Level (Lower is Better)
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {ideas.map((idea) => (
                                            <div key={idea.id} className="space-y-2">
                                                <p className="text-sm font-medium text-foreground">
                                                    {idea.title}
                                                </p>
                                                <ScoreIndicator
                                                    label="Less Competitive"
                                                    score={100 - idea.competitionScore}
                                                    size="lg"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    {ideas.length === 2 && (
                                        <div className="mt-3 p-2 rounded bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
                                            ✨ {ideas[0].competitionScore < ideas[1].competitionScore
                                                ? ideas[0].title
                                                : ideas[1].title} faces less competition
                                        </div>
                                    )}
                                </div>

                                {/* Feasibility Score */}
                                <div className="p-4 rounded-lg bg-slate-800/40 border border-slate-700/40">
                                    <h3 className="text-sm font-semibold text-muted-foreground mb-4">
                                        Feasibility Score
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {ideas.map((idea) => (
                                            <div key={idea.id} className="space-y-2">
                                                <p className="text-sm font-medium text-foreground">
                                                    {idea.title}
                                                </p>
                                                <ScoreIndicator
                                                    label="Feasibility"
                                                    score={idea.feasibilityScore}
                                                    size="lg"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    {ideas.length === 2 && (
                                        <div className="mt-3 p-2 rounded bg-yellow-500/10 border border-yellow-500/20 text-xs text-yellow-300">
                                            🚀 {ideas[0].feasibilityScore > ideas[1].feasibilityScore
                                                ? ideas[0].title
                                                : ideas[1].title} is more feasible to build
                                        </div>
                                    )}
                                </div>

                                {/* Summary */}
                                <div className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
                                    <h3 className="text-sm font-semibold text-primary mb-2">
                                        Overall Assessment
                                    </h3>
                                    <p className="text-xs text-foreground leading-relaxed">
                                        Based on market potential, competition, and feasibility:
                                    </p>
                                    <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                                        <li>
                                            • <span className="font-semibold">{ideas[0].title}</span> is{' '}
                                            {getScoreComparison(
                                                (ideas[0].marketScore +
                                                    (100 - ideas[0].competitionScore) +
                                                    ideas[0].feasibilityScore) /
                                                3,
                                                (ideas[1].marketScore +
                                                    (100 - ideas[1].competitionScore) +
                                                    ideas[1].feasibilityScore) /
                                                3
                                            ) === 'higher'
                                                ? '🔥 a stronger overall opportunity'
                                                : getScoreComparison(
                                                    (ideas[0].marketScore +
                                                        (100 - ideas[0].competitionScore) +
                                                        ideas[0].feasibilityScore) /
                                                    3,
                                                    (ideas[1].marketScore +
                                                        (100 - ideas[1].competitionScore) +
                                                        ideas[1].feasibilityScore) /
                                                    3
                                                ) === 'lower'
                                                    ? 'less competitive overall'
                                                    : 'comparably competitive'}
                                        </li>
                                        <li>
                                            • <span className="font-semibold">{ideas[1].title}</span> is{' '}
                                            {getScoreComparison(
                                                (ideas[1].marketScore +
                                                    (100 - ideas[1].competitionScore) +
                                                    ideas[1].feasibilityScore) /
                                                3,
                                                (ideas[0].marketScore +
                                                    (100 - ideas[0].competitionScore) +
                                                    ideas[0].feasibilityScore) /
                                                3
                                            ) === 'higher'
                                                ? '🔥 a stronger overall opportunity'
                                                : getScoreComparison(
                                                    (ideas[1].marketScore +
                                                        (100 - ideas[1].competitionScore) +
                                                        ideas[1].feasibilityScore) /
                                                    3,
                                                    (ideas[0].marketScore +
                                                        (100 - ideas[0].competitionScore) +
                                                        ideas[0].feasibilityScore) /
                                                    3
                                                ) === 'lower'
                                                    ? 'less competitive overall'
                                                    : 'comparably competitive'}
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="w-full mt-6 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-medium transition-colors"
                            >
                                Close Comparison
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
