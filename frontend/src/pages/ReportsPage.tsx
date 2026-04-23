import { motion } from "framer-motion";
import { FileText, Lightbulb } from "lucide-react";
import { useState, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useGetIdeas, useGetAnalysis } from "@/hooks/useApiCalls";
import { useReanalyzeIdea } from "@/hooks/useReanalyzeIdea";
import { LoadingTimeout } from "@/components/common/LoadingTimeout";
import { CardSkeleton } from "@/components/common/SkeletonLoaders";
import { IdeaReportCard } from "@/components/reports/IdeaReportCard";
import { ReportFiltersPanel, ReportFilters } from "@/components/reports/ReportFiltersPanel";
import { CompareIdeasModal } from "@/components/reports/CompareIdeasModal";
import { useToast } from "@/hooks/use-toast";

export const ReportsPage = () => {
    const { user } = useAuth();
    const { ideas, loading, isTimeout, refetch } = useGetIdeas(user?.id || null);
    const { toast } = useToast();
    const { reanalyze, loading: reanalyzing } = useReanalyzeIdea();

    const [selectedIdea, setSelectedIdea] = useState<string | null>(null);
    const { analysis } = useGetAnalysis(selectedIdea);

    const [compareIds, setCompareIds] = useState<string[]>([]);
    const [filters, setFilters] = useState<ReportFilters>({
        industries: [],
        scoreRange: [0, 100],
        searchText: "",
    });

    // Get unique industries from ideas
    const uniqueIndustries = useMemo(() => {
        return Array.from(new Set(ideas.map((idea) => idea.industry))).sort();
    }, [ideas]);

    // Filter ideas based on selected filters
    const filteredIdeas = useMemo(() => {
        return ideas.filter((idea) => {
            // Search filter
            if (filters.searchText) {
                const searchLower = filters.searchText.toLowerCase();
                const ideaText = idea.idea_text || '';
                const industry = idea.industry || '';

                if (
                    !ideaText.toLowerCase().includes(searchLower) &&
                    !industry.toLowerCase().includes(searchLower)
                ) {
                    return false;
                }
            }

            // Industry filter
            if (filters.industries.length > 0 && !filters.industries.includes(idea.industry)) {
                return false;
            }

            // Score filter - would need analysis data, so skip for now
            return true;
        });
    }, [ideas, filters]);

    // Get ideas for comparison modal
    const compareIdeas = useMemo(() => {
        return ideas
            .filter((idea) => compareIds.includes(idea.id))
            .map((idea) => ({
                id: idea.id,
                title: idea.idea_text || "Untitled",
                industry: idea.industry,
                marketScore: idea.analysis?.market_score || 0,
                competitionScore: idea.analysis?.competition_score || 0,
                feasibilityScore: idea.analysis?.feasibility_score || 0,
            }));
    }, [ideas, compareIds]);

    // Handle re-analyze
    const handleReanalyze = async (ideaId: string) => {
        if (!user?.id) return;

        const idea = ideas.find((i) => i.id === ideaId);
        if (!idea) return;

        const ideaTitle = idea.idea_text || "your idea";
        console.log(`🔄 [ReportsPage] Re-analyzing idea:`, ideaId);
        console.log(`   Idea: "${ideaTitle.substring(0, 60)}..."`);

        toast({
            title: "Re-analyzing...",
            description: `Re-analyzing "${ideaTitle.substring(0, 60)}..."`,
        });

        const success = await reanalyze(ideaId, user.id);

        if (success) {
            console.log(`✅ [ReportsPage] Re-analysis completed for idea:`, ideaId);
            toast({
                title: "Analysis Complete",
                description: `Analysis updated successfully`,
            });
            // Refresh the ideas list
            refetch();
        } else {
            console.error(`❌ [ReportsPage] Re-analysis failed for idea:`, ideaId);
            toast({
                title: "Re-analysis Failed",
                description: "Something went wrong. Please try again.",
                variant: "destructive",
            });
        }
    };

    // Handle compare toggle
    const handleCompareToggle = (ideaId: string) => {
        if (compareIds.includes(ideaId)) {
            setCompareIds(compareIds.filter((id) => id !== ideaId));
        } else if (compareIds.length < 2) {
            setCompareIds([...compareIds, ideaId]);
        } else {
            toast({
                title: "Max 2 ideas",
                description: "You can compare up to 2 ideas at a time",
                variant: "destructive",
            });
        }
    };

    // Handle delete
    const handleDelete = (ideaId: string) => {
        const idea = ideas.find((i) => i.id === ideaId);
        const ideaTitle = idea?.idea_text || "this idea";
        console.log(`🗑️ [ReportsPage] Delete requested for idea:`, ideaId);
        toast({
            title: "Delete idea",
            description: `Delete "${ideaTitle.substring(0, 50)}..."?`,
        });
        // TODO: Add delete API call here
    };

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
                            {filteredIdeas.length} Reports
                        </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        View, filter, compare, and re-analyze your startup validation reports
                    </p>
                </motion.div>
            </div>

            {/* Reports Grid */}
            <div className="px-6 pb-8">
                {/* Filters */}
                {ideas.length > 0 && (
                    <ReportFiltersPanel
                        industries={uniqueIndustries}
                        filters={filters}
                        onFiltersChange={setFilters}
                        onClearFilters={() => setFilters({
                            industries: [],
                            scoreRange: [0, 100],
                            searchText: "",
                        })}
                    />
                )}

                {/* Reports Grid */}
                {loading && !ideas.length ? (
                    <CardSkeleton />
                ) : filteredIdeas.length > 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1, duration: 0.5 }}
                        className="grid gap-4 md:grid-cols-2"
                    >
                        {filteredIdeas.map((idea, i) => (
                            <motion.div
                                key={idea.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.05 + i * 0.05 }}
                            >
                                <IdeaReportCard
                                    id={idea.id}
                                    title={idea.idea_text || "Untitled Idea"}
                                    industry={idea.industry}
                                    description={idea.idea_text}
                                    marketScore={idea.analysis?.market_score || 0}
                                    competitionScore={idea.analysis?.competition_score || 0}
                                    feasibilityScore={idea.analysis?.feasibility_score || 0}
                                    createdAt={idea.created_at || new Date().toISOString()}
                                    analysisText={idea.analysis?.analysis_text}
                                    isSelected={compareIds.includes(idea.id)}
                                    onSelect={setSelectedIdea}
                                    onReanalyze={handleReanalyze}
                                    onDelete={handleDelete}
                                    onCompare={handleCompareToggle}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                ) : ideas.length > 0 ? (
                    /* No results */
                    <div className="glass-effect rounded-xl p-12 border border-primary/10 text-center">
                        <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                        <h3 className="font-semibold text-foreground mb-2">No Reports Match Filters</h3>
                        <p className="text-sm text-muted-foreground">
                            Try adjusting your filters or search query
                        </p>
                    </div>
                ) : (
                    /* Empty State */
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col items-center justify-center py-16"
                    >
                        <div className="text-center max-w-md">
                            <motion.div
                                animate={{ y: [0, -8, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="mb-6"
                            >
                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/30">
                                    <FileText className="w-10 h-10 text-primary/60" />
                                </div>
                            </motion.div>

                            <h2 className="text-2xl font-bold text-foreground mb-2">No Ideas Yet</h2>
                            <p className="text-sm text-muted-foreground mb-6">
                                Validate your first startup idea to generate AI-powered reports and insights.
                            </p>

                            <motion.a
                                href="/validate"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-primary to-primary/80 text-foreground font-semibold hover:from-primary/90 hover:to-primary/70 transition-all"
                            >
                                <Lightbulb className="w-5 h-5" />
                                Create Your First Idea
                            </motion.a>
                        </div>
                    </motion.div>
                )}

                {/* Compare Modal */}
                <CompareIdeasModal
                    ideas={compareIdeas}
                    isOpen={compareIds.length === 2}
                    onClose={() => setCompareIds([])}
                />
            </div>
        </>
    );
};

export default ReportsPage;
