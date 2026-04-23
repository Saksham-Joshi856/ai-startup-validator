/**
 * IdeaSubmissionForm Component
 * Collects startup idea submission and displays AI analysis results
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAnalyzeIdea } from '@/hooks/useAnalyzeIdea';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, CheckCircle2, Zap } from 'lucide-react';

// List of startup industries
const INDUSTRIES = [
    'EdTech',
    'FinTech',
    'HealthTech',
    'HR Tech',
    'AI/ML',
    'E-commerce',
    'SaaS',
    'Sustainability',
    'Travel & Tourism',
    'Real Estate',
    'Media & Entertainment',
    'Food & Beverage',
    'Supply Chain',
    'Manufacturing',
    'IoT',
    'Cybersecurity',
    'Blockchain',
    'Gaming',
    'Other',
];

interface ScoreBadgeProps {
    label: string;
    score: number;
    maxScore?: number;
}

const ScoreBadge = ({ label, score, maxScore = 100 }: ScoreBadgeProps) => {
    const percentage = (score / maxScore) * 100;
    let color = 'bg-red-500';
    if (percentage >= 70) color = 'bg-green-500';
    else if (percentage >= 50) color = 'bg-yellow-500';

    return (
        <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">{label}</span>
                <span className="text-lg font-bold text-foreground">{score}/100</span>
            </div>
            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className={`h-full ${color} rounded-full`}
                />
            </div>
        </div>
    );
};

export function IdeaSubmissionForm() {
    const [ideaText, setIdeaText] = useState('');
    const [selectedIndustry, setSelectedIndustry] = useState('');
    const { user } = useAuth();
    const { isLoading, error, data, analyzeIdea, reset } = useAnalyzeIdea();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!ideaText.trim() || !selectedIndustry) {
            console.warn('Form validation failed: missing idea text or industry');
            return;
        }

        if (!user?.id) {
            console.error('❌ User not authenticated - userId is missing');
            return;
        }

        console.log(`✅ [IdeaSubmissionForm] Submitting idea for analysis`);
        console.log(`   📝 User ID (from Supabase): ${user.id}`);
        console.log(`   💡 Idea Text: "${ideaText.substring(0, 60)}..."`);
        console.log(`   🏭 Industry: ${selectedIndustry}`);
        console.log(`   📤 API Endpoint: /api/analyzeIdea`);

        await analyzeIdea(user.id, ideaText, selectedIndustry);
    };

    const handleReset = () => {
        setIdeaText('');
        setSelectedIndustry('');
        reset();
    };

    return (
        <div className="space-y-6">
            {/* Form Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <Card className="p-6 border-primary/20 bg-card/50 backdrop-blur-sm">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                            <Zap className="w-5 h-5 text-primary" />
                            Submit Your Startup Idea
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            Get AI-powered analysis on market potential, competition, and feasibility
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Idea Textarea */}
                        <div className="space-y-2">
                            <label htmlFor="ideaText" className="text-sm font-medium text-foreground">
                                Your Startup Idea
                            </label>
                            <textarea
                                id="ideaText"
                                placeholder="Describe your startup idea in detail. What problem does it solve? Who is your target audience?"
                                value={ideaText}
                                onChange={(e) => setIdeaText(e.target.value)}
                                disabled={isLoading}
                                className="w-full h-32 px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                            <p className="text-xs text-muted-foreground">
                                {ideaText.length}/500 characters
                            </p>
                        </div>

                        {/* Industry Dropdown */}
                        <div className="space-y-2">
                            <label htmlFor="industry" className="text-sm font-medium text-foreground">
                                Industry Category
                            </label>
                            <select
                                id="industry"
                                value={selectedIndustry}
                                onChange={(e) => setSelectedIndustry(e.target.value)}
                                disabled={isLoading}
                                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <option value="">Select an industry...</option>
                                {INDUSTRIES.map((industry) => (
                                    <option key={industry} value={industry}>
                                        {industry}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 pt-4">
                            <Button
                                type="submit"
                                disabled={!ideaText.trim() || !selectedIndustry || isLoading}
                                className="flex-1 gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        <Zap className="w-4 h-4" />
                                        Analyze Idea
                                    </>
                                )}
                            </Button>
                            <Button
                                type="button"
                                onClick={handleReset}
                                disabled={isLoading}
                                variant="outline"
                            >
                                Clear
                            </Button>
                        </div>
                    </form>
                </Card>
            </motion.div>

            {/* Error Alert */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                </motion.div>
            )}

            {/* Results Card */}
            {data && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-4"
                >
                    {/* Header with success indicator */}
                    <div className="flex items-center gap-3 px-6 py-4 rounded-lg bg-primary/10 border border-primary/20">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                        <div>
                            <p className="font-semibold text-foreground">Analysis Complete!</p>
                            <p className="text-sm text-muted-foreground">
                                Here are the AI-generated insights for your idea
                            </p>
                        </div>
                    </div>

                    {/* Scores Grid */}
                    <Card className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <ScoreBadge
                                label="Market Score"
                                score={data.analysis.market_score}
                            />
                            <ScoreBadge
                                label="Competition Score"
                                score={data.analysis.competition_score}
                            />
                            <ScoreBadge
                                label="Feasibility Score"
                                score={data.analysis.feasibility_score}
                            />
                        </div>

                        {/* Overall Score */}
                        <div className="pt-4 border-t border-border">
                            <div className="flex justify-between items-center mb-3">
                                <p className="text-sm font-medium text-muted-foreground">Overall Viability</p>
                                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                                    {Math.round(
                                        (data.analysis.market_score +
                                            data.analysis.competition_score +
                                            data.analysis.feasibility_score) /
                                        3
                                    )}/100
                                </Badge>
                            </div>
                        </div>
                    </Card>

                    {/* Analysis Text */}
                    <Card className="p-6">
                        <h3 className="font-semibold text-foreground mb-3">Detailed Analysis</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                            {data.analysis.analysis_text}
                        </p>
                    </Card>

                    {/* Idea Details */}
                    <Card className="p-6 bg-secondary/20 border-secondary/30">
                        <h3 className="font-semibold text-foreground mb-3">Submitted Idea</h3>
                        <div className="space-y-2">
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Idea ID</p>
                                <p className="font-mono text-sm text-foreground break-all">
                                    {data.idea.id}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Industry</p>
                                <Badge variant="secondary">{data.idea.industry}</Badge>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Submitted</p>
                                <p className="text-sm text-foreground">
                                    {new Date(data.idea.created_at).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </Card>

                    {/* Submit Another */}
                    <Button onClick={handleReset} variant="outline" className="w-full">
                        Submit Another Idea
                    </Button>
                </motion.div>
            )}
        </div>
    );
}
