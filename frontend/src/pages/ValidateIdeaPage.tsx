import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";
import { IdeaSubmissionForm } from "@/components/dashboard/IdeaSubmissionForm";

export const ValidateIdeaPage = () => {
    return (
        <>
            {/* Hero Section */}
            <div className="relative px-6 pt-6 pb-2">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="relative z-10"
                >
                    <div className="flex items-center gap-3 mb-1">
                        <Lightbulb className="w-6 h-6 text-primary" />
                        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Validate Your Idea</h1>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/20 ai-badge-glow">
                            New Feature
                        </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Get AI-powered validation and market insights for your startup idea
                    </p>
                </motion.div>
            </div>

            {/* Content */}
            <div className="px-6 pb-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="mb-8"
                >
                    <IdeaSubmissionForm />
                </motion.div>

                {/* Info Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="glass-effect rounded-xl p-6 border border-primary/10"
                >
                    <h3 className="font-semibold text-foreground mb-2">How It Works</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>✓ Describe your startup idea in detail</li>
                        <li>✓ Select the industry category</li>
                        <li>✓ Get instant AI analysis with scores</li>
                        <li>✓ Receive actionable insights</li>
                    </ul>
                </motion.div>
            </div>
        </>
    );
};

export default ValidateIdeaPage;
