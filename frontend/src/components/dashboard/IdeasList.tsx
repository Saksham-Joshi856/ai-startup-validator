/**
 * IdeasList Component
 * Displays user's startup ideas fetched from /api/getIdeas
 * Click an idea to view its AI analysis
 */

'use client';

import { useState } from 'react';
import { useGetIdeas } from '@/hooks/useGetIdeas';
import { useGetAnalysis } from '@/hooks/useGetAnalysis';
import { ScoreIndicator } from './ScoreIndicator';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { Lightbulb, AlertCircle, TrendingUp, Users, Zap } from 'lucide-react';

export function IdeasList() {
    const { isLoading, error, ideas, count } = useGetIdeas();
    const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(null);
    const [selectedIdeaText, setSelectedIdeaText] = useState<string>('');
    const {
        isLoading: analysisLoading,
        error: analysisError,
        analysis,
    } = useGetAnalysis(selectedIdeaId);

    const handleIdeaClick = (ideaId: string, ideaText: string) => {
        setSelectedIdeaId(ideaId);
        setSelectedIdeaText(ideaText);
    };

    const handleCloseDialog = () => {
        setSelectedIdeaId(null);
        setSelectedIdeaText('');
    };

    // Loading state - show skeletons
    if (isLoading && ideas === null) {
        return (
            <div className="space-y-3">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <Card className="p-6 border-destructive/50 bg-destructive/5">
                <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-destructive">Error loading ideas</p>
                        <p className="text-xs text-muted-foreground mt-1">{error}</p>
                    </div>
                </div>
            </Card>
        );
    }

    // Empty state
    if (!ideas || ideas.length === 0) {
        return (
            <Card className="p-12 text-center border-dashed">
                <Lightbulb className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-muted-foreground font-medium">No ideas yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                    Submit your first startup idea above to get started
                </p>
            </Card>
        );
    }

    // Ideas list
    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-3"
            >
                <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-sm font-semibold text-foreground">
                        Your Ideas ({count})
                    </h3>
                </div>

                <div className="grid gap-3">
                    {ideas.map((idea, index) => (
                        <motion.div
                            key={idea.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                            <Card
                                className="p-4 hover:bg-accent/50 transition-colors cursor-pointer group"
                                onClick={() => handleIdeaClick(idea.id, idea.idea_text)}
                            >
                                <div className="space-y-2">
                                    {/* Idea Text */}
                                    <p className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                                        {idea.idea_text}
                                    </p>

                                    {/* Industry Badge & Timestamp */}
                                    <div className="flex items-center justify-between">
                                        <Badge variant="secondary" className="text-xs">
                                            {idea.industry}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(idea.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Analysis Detail Dialog */}
            <Dialog open={selectedIdeaId !== null} onOpenChange={handleCloseDialog}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Idea Analysis</DialogTitle>
                        <DialogDescription className="line-clamp-2">
                            {selectedIdeaText}
                        </DialogDescription>
                    </DialogHeader>

                    {/* Loading State */}
                    {analysisLoading && (
                        <div className="space-y-6 py-6">
                            <div>
                                <Skeleton className="h-6 w-32 mb-3" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <div>
                                <Skeleton className="h-6 w-32 mb-3" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <div>
                                <Skeleton className="h-6 w-32 mb-3" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <Skeleton className="h-32 w-full" />
                        </div>
                    )}

                    {/* Error State */}
                    {analysisError && !analysisLoading && (
                        <Card className="p-4 border-destructive/50 bg-destructive/5 mt-6">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-destructive">
                                        Error loading analysis
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {analysisError}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Analysis Content */}
                    {analysis && !analysisLoading && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-8 py-6"
                        >
                            {/* Score Indicators Stack */}
                            <div className="space-y-6 rounded-lg p-5 bg-muted/30 border border-border/50">
                                <div>
                                    <ScoreIndicator
                                        label="Market Potential"
                                        value={analysis.market_score}
                                        icon={<TrendingUp className="w-5 h-5" />}
                                        color="blue"
                                    />
                                </div>
                                <div className="border-t border-border/30 pt-6">
                                    <ScoreIndicator
                                        label="Competition"
                                        value={analysis.competition_score}
                                        icon={<Users className="w-5 h-5" />}
                                        color="purple"
                                    />
                                </div>
                                <div className="border-t border-border/30 pt-6">
                                    <ScoreIndicator
                                        label="Feasibility"
                                        value={analysis.feasibility_score}
                                        icon={<Zap className="w-5 h-5" />}
                                        color="green"
                                    />
                                </div>
                            </div>

                            {/* Analysis Text */}
                            <div className="space-y-2 border-t pt-6">
                                <h4 className="text-sm font-semibold text-foreground">
                                    Detailed Analysis
                                </h4>
                                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                    {analysis.analysis_text}
                                </p>
                            </div>
                        </motion.div>
                    )}
                </DialogContent>
            </Dialog >
        </>
    );
}
