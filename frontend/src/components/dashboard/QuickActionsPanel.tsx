import { motion } from 'framer-motion';
import { Zap, Lightbulb, MessageSquare, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface QuickActionsPanelProps {
    onValidateClick?: () => void;
    onAdvisorClick?: () => void;
}

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.2 },
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

export const QuickActionsPanel = ({
    onValidateClick,
    onAdvisorClick,
}: QuickActionsPanelProps) => {
    const navigate = useNavigate();

    const handleValidateClick = () => {
        if (onValidateClick) {
            onValidateClick();
        } else {
            navigate('/validate-idea');
        }
    };

    const handleAdvisorClick = () => {
        if (onAdvisorClick) {
            onAdvisorClick();
        } else {
            navigate('/advisor');
        }
    };

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
                    <Zap className="w-5 h-5 text-primary" />
                    Quick Actions
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                    Get started with what you need
                </p>
            </div>

            {/* Actions Grid */}
            <motion.div
                variants={containerVariants}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
                {/* Validate New Idea */}
                <motion.button
                    variants={cardVariants}
                    whileHover="hover"
                    onClick={handleValidateClick}
                    className="relative group p-6 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 hover:border-primary/40 transition-all duration-300 overflow-hidden text-left"
                >
                    {/* Background gradient animation */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-5 transition-opacity duration-500" />

                    {/* Content */}
                    <div className="relative z-10">
                        {/* Icon */}
                        <div className="mb-4 inline-block p-3 rounded-lg bg-primary/10">
                            <Lightbulb className="w-6 h-6 text-primary" />
                        </div>

                        {/* Title & Description */}
                        <h3 className="font-bold text-foreground mb-2 text-lg">
                            Validate a New Idea
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Get AI-powered analysis of your latest startup concept
                        </p>

                        {/* CTA */}
                        <div className="flex items-center gap-2 text-sm font-semibold text-primary group-hover:gap-3 transition-all">
                            Start Validation
                            <ArrowRight className="w-4 h-4" />
                        </div>
                    </div>
                </motion.button>

                {/* Ask AI Advisor */}
                <motion.button
                    variants={cardVariants}
                    whileHover="hover"
                    onClick={handleAdvisorClick}
                    className="relative group p-6 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 overflow-hidden text-left"
                >
                    {/* Background gradient animation */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-5 transition-opacity duration-500" />

                    {/* Content */}
                    <div className="relative z-10">
                        {/* Icon */}
                        <div className="mb-4 inline-block p-3 rounded-lg bg-blue-500/10">
                            <MessageSquare className="w-6 h-6 text-blue-400" />
                        </div>

                        {/* Title & Description */}
                        <h3 className="font-bold text-foreground mb-2 text-lg">
                            Chat with AI Advisor
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Get personalized mentorship and strategic guidance
                        </p>

                        {/* CTA */}
                        <div className="flex items-center gap-2 text-sm font-semibold text-blue-400 group-hover:gap-3 transition-all">
                            Start Chat
                            <ArrowRight className="w-4 h-4" />
                        </div>
                    </div>
                </motion.button>
            </motion.div>
        </motion.div>
    );
};
