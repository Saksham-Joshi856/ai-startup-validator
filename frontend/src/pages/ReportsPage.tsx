import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useGetIdeas, useGetAnalysis } from "@/hooks/useApiCalls";
import { LoadingTimeout } from "@/components/common/LoadingTimeout";
import { CardSkeleton } from "@/components/common/SkeletonLoaders";

export const ReportsPage = () => {
    const { user } = useAuth();
    const { ideas, loading, isTimeout } = useGetIdeas(user?.id || null);
    const [selectedIdea, setSelectedIdea] = useState<string | null>(null);
    const { analysis } = useGetAnalysis(selectedIdea);

    return (
        <>
            {/* Loading Timeout Message */}
            <LoadingTimeout isVisible={isTimeout && loading} />

            {/* Hero Section */}
            <div className="relative px-6 pt-6 pb-2">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="relative z-10"
                >
                    <div className="flex items-center gap-3 mb-1">
                        <FileText className="w-6 h-6 text-primary" />
                        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">My Reports</h1>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/20">
                            {ideas.length} Reports
                        </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        View and manage all your startup validation reports
                    </p>
                </motion.div>
            </div>

            {/* Reports Grid */}
            <div className="px-6 pb-8">
                {loading && !ideas.length ? (
                    <CardSkeleton />
                ) : ideas.length > 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1, duration: 0.5 }}
                        className="grid gap-4"
                    >
                        {ideas.map((idea, i) => (
                            <motion.div
                                key={idea.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + i * 0.05 }}
                                onClick={() => setSelectedIdea(idea.id)}
                                className="glass-effect rounded-xl p-6 border border-primary/10 hover:border-primary/20 transition-all duration-300 cursor-pointer hover:shadow-lg"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-foreground mb-1">{idea.title || idea.idea_text || "Untitled Idea"}</h3>
                                        <p className="text-sm text-muted-foreground">{idea.created_at ? new Date(idea.created_at).toLocaleDateString() : "Date unknown"}</p>
                                        <p className="text-xs text-muted-foreground mt-1">Industry: {idea.industry}</p>
                                    </div>
                                    <div className="text-right">
                                        {analysis && (
                                            <>
                                                <div className="text-2xl font-bold text-primary mb-1">
                                                    {(((analysis.market_score || 0) + (analysis.competition_score || 0) + (analysis.feasibility_score || 0)) / 3.0).toFixed(1)}
                                                </div>
                                                <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-green-500/20 text-green-600">
                                                    Analyzed
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    /* Empty State */
                    <div className="glass-effect rounded-xl p-12 border border-primary/10 text-center">
                        <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                        <h3 className="font-semibold text-foreground mb-2">No Reports Yet</h3>
                        <p className="text-sm text-muted-foreground">
                            Create and validate ideas to generate reports
                        </p>
                    </div>
                )}
            </div>
        </>
    );
};

export default ReportsPage;
