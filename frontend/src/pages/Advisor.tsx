import { motion } from "framer-motion";
import { Bot } from "lucide-react";

const Advisor = () => {
    return (
        <div className="relative px-6 pt-6 pb-2">
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10"
            >
                <div className="flex items-center gap-3 mb-1">
                    <Bot className="w-6 h-6 text-primary" />
                    <h1 className="text-2xl font-extrabold text-foreground tracking-tight">AI Advisor</h1>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/20 ai-badge-glow">
                        AI Powered
                    </span>
                </div>
                <p className="text-sm text-muted-foreground">
                    Get personalized AI-powered advice for your startup ideas
                </p>
            </motion.div>

            <div className="mt-8">
                <div className="glass-effect rounded-xl p-8 border border-accent/10">
                    <div className="flex flex-col items-center justify-center text-center space-y-4">
                        <Bot className="w-12 h-12 text-accent/50" />
                        <h3 className="font-semibold text-foreground">Chat with AI Advisor</h3>
                        <p className="text-sm text-muted-foreground max-w-md">
                            Get personalized recommendations and insights about your startup ideas from our AI advisor
                        </p>
                        <button className="mt-4 px-6 py-2 rounded-lg bg-accent/20 text-accent font-medium hover:bg-accent/30 transition-colors">
                            Start Conversation
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Advisor;
