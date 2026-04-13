import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";
import { IdeaSubmissionForm } from "@/components/dashboard/IdeaSubmissionForm";

const Validate = () => {
    return (
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

            <div className="mt-8 mb-8">
                <IdeaSubmissionForm />
            </div>
        </div>
    );
};

export default Validate;
