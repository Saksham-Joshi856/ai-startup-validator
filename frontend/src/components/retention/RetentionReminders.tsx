/**
 * Retention Reminders Component
 * Shows personalized reminders to improve engagement
 */

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    TrendingUp,
    Lightbulb,
    MessageSquare,
    Play,
    AlertCircle,
    ChevronRight,
    X,
} from "lucide-react";
import { useRetentionSuggestions } from "@/hooks/useRetention";
import { useNavigate } from "react-router-dom";
import { cardVariants, containerVariants } from "@/lib/animations";
import { CardSkeleton } from "@/components/common/SkeletonLoaders";

interface RetentionRemindersProps {
    userId: string | null;
    maxSuggestions?: number;
}

const iconMap: Record<string, React.ReactNode> = {
    TrendingUp: <TrendingUp className="w-5 h-5" />,
    Lightbulb: <Lightbulb className="w-5 h-5" />,
    MessageSquare: <MessageSquare className="w-5 h-5" />,
    Play: <Play className="w-5 h-5" />,
    AlertCircle: <AlertCircle className="w-5 h-5" />,
};

export function RetentionReminders({
    userId,
    maxSuggestions = 3,
}: RetentionRemindersProps) {
    const navigate = useNavigate();
    const { suggestions, loading } = useRetentionSuggestions(userId);
    const [dismissed, setDismissed] = React.useState<Set<string>>(new Set());

    if (loading) {
        return <CardSkeleton />;
    }

    const visibleSuggestions = suggestions
        .filter((s) => !dismissed.has(s.type))
        .slice(0, maxSuggestions);

    if (visibleSuggestions.length === 0) {
        return null;
    }

    const handleDismiss = (type: string) => {
        setDismissed((prev) => new Set([...prev, type]));
    };

    const handleAction = (url: string) => {
        navigate(url);
    };

    const getPriorityColor = (priority: "high" | "medium" | "low") => {
        switch (priority) {
            case "high":
                return "border-red-500/30 bg-red-500/5";
            case "medium":
                return "border-yellow-500/30 bg-yellow-500/5";
            case "low":
                return "border-blue-500/30 bg-blue-500/5";
        }
    };

    const getPriorityBadgeColor = (priority: "high" | "medium" | "low") => {
        switch (priority) {
            case "high":
                return "bg-red-500/20 text-red-400";
            case "medium":
                return "bg-yellow-500/20 text-yellow-400";
            case "low":
                return "bg-blue-500/20 text-blue-400";
        }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-3 mb-6"
        >
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-primary" />
                Engagement Tips
            </h3>

            <AnimatePresence mode="popLayout">
                {visibleSuggestions.map((suggestion) => (
                    <motion.div
                        key={suggestion.type}
                        variants={cardVariants}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className={`p-4 rounded-lg border ${getPriorityColor(
                            suggestion.priority
                        )} hover:shadow-md transition-all duration-200`}
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3 flex-1">
                                <div className="p-2 rounded-lg bg-muted mt-0.5">
                                    {iconMap[suggestion.icon] || (
                                        <Lightbulb className="w-4 h-4" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="text-sm font-semibold text-foreground">
                                            {suggestion.title}
                                        </p>
                                        <span
                                            className={`text-xs px-2 py-0.5 rounded ${getPriorityBadgeColor(
                                                suggestion.priority
                                            )}`}
                                        >
                                            {suggestion.priority}
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {suggestion.description}
                                    </p>
                                </div>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleDismiss(suggestion.type)}
                                className="p-1 text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                            >
                                <X className="w-4 h-4" />
                            </motion.button>
                        </div>

                        <motion.button
                            whileHover={{ x: 4 }}
                            onClick={() => handleAction(suggestion.actionUrl)}
                            className="mt-3 w-full flex items-center justify-between px-3 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-xs font-medium transition-colors"
                        >
                            <span>{suggestion.actionText}</span>
                            <ChevronRight className="w-3 h-3" />
                        </motion.button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </motion.div>
    );
}

export default RetentionReminders;
