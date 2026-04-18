import { motion } from 'framer-motion';
import {
    TrendingUp,
    Star,
    AlertCircle,
    Flame,
} from 'lucide-react';
import { PersonalizedInsights } from '@/hooks/usePersonalizedInsights';

interface PersonalizedInsightsCardProps {
    insights: PersonalizedInsights;
    loading?: boolean;
}

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
        opacity: 1,
        y: 0,
        transition: { type: 'spring', stiffness: 100, damping: 15 },
    },
};

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
};

export const PersonalizedInsightsCard = ({
    insights,
    loading = false,
}: PersonalizedInsightsCardProps) => {
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="mb-6"
        >
            {/* Section Header */}
            <div className="mb-4">
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Your Insights
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                    Personalized analysis of your startup ideas
                </p>
            </div>

            {/* Insights Grid */}
            <motion.div
                variants={containerVariants}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
                {/* Total Ideas Card */}
                <motion.div
                    variants={cardVariants}
                    className="p-5 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 hover:border-blue-500/40 transition-colors"
                >
                    <div className="flex items-start justify-between mb-3">
                        <div className="p-2 rounded-md bg-blue-500/10">
                            <Flame className="w-5 h-5 text-blue-400" />
                        </div>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-1">
                            Total Ideas
                        </p>
                        <div className="text-3xl font-black text-blue-400">
                            {insights.totalIdeas}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            {insights.totalIdeas === 0
                                ? 'Create your first idea'
                                : insights.totalIdeas === 1
                                    ? '1 idea analyzed'
                                    : `${insights.totalIdeas} ideas analyzed`}
                        </p>
                    </div>
                </motion.div>

                {/* Best Idea Card */}
                <motion.div
                    variants={cardVariants}
                    className={`p-5 rounded-lg border transition-colors ${insights.bestIdea
                            ? 'bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40'
                            : 'bg-gradient-to-br from-slate-700/30 to-slate-700/10 border-slate-600/20'
                        }`}
                >
                    <div className="flex items-start justify-between mb-3">
                        <div className={`p-2 rounded-md ${insights.bestIdea
                                ? 'bg-emerald-500/10'
                                : 'bg-slate-600/20'
                            }`}>
                            <Star className={`w-5 h-5 ${insights.bestIdea ? 'text-emerald-400' : 'text-slate-400'
                                }`} />
                        </div>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-1">
                            Best Idea
                        </p>
                        {insights.bestIdea ? (
                            <>
                                <div className="text-lg font-bold text-emerald-400 line-clamp-2 mb-2">
                                    {insights.bestIdea.title}
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground">
                                        {insights.bestIdea.industry}
                                    </span>
                                    <span className="text-sm font-bold text-emerald-400">
                                        {insights.bestIdea.score}
                                    </span>
                                </div>
                            </>
                        ) : (
                            <p className="text-xs text-muted-foreground">
                                No analyzed ideas yet
                            </p>
                        )}
                    </div>
                </motion.div>

                {/* Weakest Idea Card */}
                <motion.div
                    variants={cardVariants}
                    className={`p-5 rounded-lg border transition-colors ${insights.worstIdea
                            ? 'bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border-yellow-500/20 hover:border-yellow-500/40'
                            : 'bg-gradient-to-br from-slate-700/30 to-slate-700/10 border-slate-600/20'
                        }`}
                >
                    <div className="flex items-start justify-between mb-3">
                        <div className={`p-2 rounded-md ${insights.worstIdea
                                ? 'bg-yellow-500/10'
                                : 'bg-slate-600/20'
                            }`}>
                            <AlertCircle className={`w-5 h-5 ${insights.worstIdea ? 'text-yellow-400' : 'text-slate-400'
                                }`} />
                        </div>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-1">
                            Needs Work
                        </p>
                        {insights.worstIdea ? (
                            <>
                                <div className="text-lg font-bold text-yellow-400 line-clamp-2 mb-2">
                                    {insights.worstIdea.title}
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground">
                                        {insights.worstIdea.industry}
                                    </span>
                                    <span className="text-sm font-bold text-yellow-400">
                                        {insights.worstIdea.score}
                                    </span>
                                </div>
                            </>
                        ) : (
                            <p className="text-xs text-muted-foreground">
                                All ideas looking good!
                            </p>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};
