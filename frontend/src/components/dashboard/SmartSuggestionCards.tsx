import { motion } from 'framer-motion';
import {
    Lightbulb,
    TrendingUp,
    Target,
    Zap,
    CheckCircle,
    AlertCircle,
    Compass,
    BookOpen,
    BarChart3,
    ArrowRight,
} from 'lucide-react';
import { useSmartSuggestions } from '@/hooks/useSmartSuggestions';
import { useNavigate } from 'react-router-dom';

interface SmartSuggestionCardsProps {
    userId: string | null;
    onSuggestionClick?: (suggestion: string) => void;
}

const iconMap: Record<string, React.ReactNode> = {
    Lightbulb: <Lightbulb className="w-5 h-5" />,
    TrendingUp: <TrendingUp className="w-5 h-5" />,
    Target: <Target className="w-5 h-5" />,
    Zap: <Zap className="w-5 h-5" />,
    CheckCircle: <CheckCircle className="w-5 h-5" />,
    AlertCircle: <AlertCircle className="w-5 h-5" />,
    Compass: <Compass className="w-5 h-5" />,
    BookOpen: <BookOpen className="w-5 h-5" />,
    BarChart3: <BarChart3 className="w-5 h-5" />,
};

const typeStyles = {
    primary: {
        bg: 'bg-gradient-to-br from-primary/10 to-primary/5 hover:from-primary/15 hover:to-primary/10',
        border: 'border-primary/20 hover:border-primary/40',
        text: 'text-foreground',
        badge: 'bg-primary/10 text-primary border-primary/20',
        icon: 'text-primary',
    },
    secondary: {
        bg: 'bg-gradient-to-br from-blue-500/10 to-blue-500/5 hover:from-blue-500/15 hover:to-blue-500/10',
        border: 'border-blue-500/20 hover:border-blue-500/40',
        text: 'text-foreground',
        badge: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        icon: 'text-blue-500',
    },
    tertiary: {
        bg: 'bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 hover:from-emerald-500/15 hover:to-emerald-500/10',
        border: 'border-emerald-500/20 hover:border-emerald-500/40',
        text: 'text-foreground',
        badge: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
        icon: 'text-emerald-500',
    },
};

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
        opacity: 1,
        y: 0,
        transition: { type: 'spring', stiffness: 100, damping: 15 },
    },
    hover: {
        y: -4,
        transition: { type: 'spring', stiffness: 200, damping: 20 },
    },
};

export const SmartSuggestionCards = ({
    userId,
    onSuggestionClick,
}: SmartSuggestionCardsProps) => {
    const { suggestions, loading } = useSmartSuggestions(userId);
    const navigate = useNavigate();

    if (!suggestions || suggestions.length === 0) {
        return null;
    }

    const handleCardClick = (suggestion: string) => {
        if (onSuggestionClick) {
            onSuggestionClick(suggestion);
        } else {
            // Navigate to validate idea page if suggestion clicked
            navigate('/validate-idea');
        }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="mb-8"
        >
            {/* Section Header */}
            <div className="mb-4">
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary" />
                    Smart Suggestions
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                    Personalized recommendations to guide your next steps
                </p>
            </div>

            {/* Suggestions Grid */}
            <motion.div
                variants={containerVariants}
                className="grid grid-cols-1 md:grid-cols-3 gap-3"
            >
                {suggestions.map((suggestion, index) => {
                    const type = (suggestion.type || 'secondary') as keyof typeof typeStyles;
                    const styles = typeStyles[type];
                    const icon = iconMap[suggestion.icon] || iconMap.Lightbulb;

                    return (
                        <motion.button
                            key={index}
                            variants={cardVariants}
                            whileHover="hover"
                            onClick={() => handleCardClick(suggestion.text)}
                            disabled={loading}
                            className={`relative group p-4 rounded-lg border transition-all duration-200 text-left overflow-hidden ${styles.bg} ${styles.border} disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {/* Background gradient animation */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-5 transition-opacity duration-500" />

                            {/* Content */}
                            <div className="relative z-10">
                                {/* Icon + Badge */}
                                <div className="flex items-start justify-between mb-2">
                                    <div className={`p-2 rounded-md ${styles.badge}`}>{icon}</div>
                                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors opacity-0 group-hover:opacity-100" />
                                </div>

                                {/* Text */}
                                <p className={`font-medium text-sm leading-snug ${styles.text}`}>
                                    {suggestion.text}
                                </p>
                            </div>
                        </motion.button>
                    );
                })}
            </motion.div>
        </motion.div>
    );
};
