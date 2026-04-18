import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, Zap, TrendingUp, Users, Target, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useAnalyzeIdea } from "@/hooks/useAnalyzeIdea";
import { useAuth } from "@/hooks/useAuth";

const INDUSTRIES = [
    'EdTech', 'FinTech', 'HealthTech', 'HR Tech', 'AI/ML', 'E-commerce', 'SaaS', 'Sustainability',
    'Travel & Tourism', 'Real Estate', 'Media & Entertainment', 'Food & Beverage', 'Supply Chain',
    'Manufacturing', 'IoT', 'Cybersecurity', 'Blockchain', 'Gaming', 'Other',
];

// Loading steps
const ANALYSIS_STEPS = [
    { step: 1, message: "Analyzing market potential..." },
    { step: 2, message: "Evaluating competition landscape..." },
    { step: 3, message: "Calculating feasibility score..." },
    { step: 4, message: "Generating AI suggestions..." },
];

interface ScoreIndicatorProps {
    label: string;
    score: number;
    icon: React.ReactNode;
}

const ScoreIndicator = ({ label, score, icon }: ScoreIndicatorProps) => {
    const percentage = (score / 100) * 100;
    let color = "from-red-500 to-red-600";
    let bgColor = "bg-red-500/20";
    let textColor = "text-red-600";

    if (percentage >= 70) {
        color = "from-emerald-500 to-emerald-600";
        bgColor = "bg-emerald-500/20";
        textColor = "text-emerald-600";
    } else if (percentage >= 50) {
        color = "from-yellow-500 to-yellow-600";
        bgColor = "bg-yellow-500/20";
        textColor = "text-yellow-600";
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className={`rounded-lg p-4 ${bgColor} border border-current border-opacity-30`}
        >
            <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg bg-current bg-opacity-20 ${textColor}`}>{icon}</div>
                <div>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className={`text-2xl font-bold ${textColor}`}>{score}/100</p>
                </div>
            </div>
            <div className="w-full h-2 bg-black/10 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={`h-full bg-gradient-to-r ${color} rounded-full`}
                />
            </div>
        </motion.div>
    );
};

export const ValidateIdeaPage = () => {
    const [ideaText, setIdeaText] = useState("");
    const [selectedIndustry, setSelectedIndustry] = useState("");
    const [currentStep, setCurrentStep] = useState(0);
    const { user } = useAuth();
    const { isLoading, error, data, analyzeIdea, reset } = useAnalyzeIdea();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!ideaText.trim() || !selectedIndustry) return;
        if (!user?.id) {
            console.error("User not authenticated");
            return;
        }

        setCurrentStep(0);
        // Simulate step progression
        const stepInterval = setInterval(() => {
            setCurrentStep((prev) => {
                if (prev >= ANALYSIS_STEPS.length - 1) {
                    clearInterval(stepInterval);
                    return prev;
                }
                return prev + 1;
            });
        }, 1500);

        await analyzeIdea(user.id, ideaText, selectedIndustry);
    };

    const handleReset = () => {
        setIdeaText("");
        setSelectedIndustry("");
        setCurrentStep(0);
        reset();
    };

    const overallScore = data
        ? Math.round(
            (data.analysis.market_score + data.analysis.competition_score + data.analysis.feasibility_score) / 3
        )
        : 0;

    return (
        <>
            {/* Hero Section */}
            <div className="relative px-6 pt-6 pb-4">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative z-10"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <Lightbulb className="w-6 h-6 text-primary" />
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">Validate Your Idea</h1>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/20 ai-badge-glow">
                            AI Powered
                        </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Get AI-powered analysis on market potential, competition, and feasibility
                    </p>
                </motion.div>
            </div>

            {/* Content */}
            <div className="px-6 pb-8 space-y-6">
                {/* Form Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <Card className="p-6 border-primary/20 bg-card/50 backdrop-blur-sm">
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
                                <p className="text-xs text-muted-foreground">{ideaText.length}/500 characters</p>
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
                                <Button type="button" onClick={handleReset} disabled={isLoading} variant="outline">
                                    Clear
                                </Button>
                            </div>
                        </form>
                    </Card>
                </motion.div>

                {/* Loading Steps */}
                <AnimatePresence>
                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-4"
                        >
                            <div className="space-y-3">
                                {ANALYSIS_STEPS.map((item, index) => (
                                    <motion.div
                                        key={item.step}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.2 }}
                                        className={`flex items-center gap-3 p-3 rounded-lg transition-all ${index <= currentStep
                                                ? "bg-primary/10 border border-primary/30"
                                                : "bg-secondary/20 border border-secondary/30"
                                            }`}
                                    >
                                        {index < currentStep ? (
                                            <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                                        ) : index === currentStep ? (
                                            <Loader2 className="w-5 h-5 text-primary flex-shrink-0 animate-spin" />
                                        ) : (
                                            <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30 flex-shrink-0" />
                                        )}
                                        <span className={`text-sm font-medium ${index <= currentStep ? "text-foreground" : "text-muted-foreground"}`}>
                                            {item.message}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Error Alert */}
                {error && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    </motion.div>
                )}

                {/* Results */}
                {data && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="space-y-6"
                    >
                        {/* Success Header */}
                        <div className="flex items-center gap-3 px-6 py-4 rounded-lg bg-primary/10 border border-primary/20">
                            <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                            <div>
                                <p className="font-semibold text-foreground">Analysis Complete!</p>
                                <p className="text-sm text-muted-foreground">Your AI-powered insights are ready</p>
                            </div>
                        </div>

                        {/* Overall Score */}
                        <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Overall Viability Score</p>
                                    <p className="text-4xl font-bold text-foreground">{overallScore}</p>
                                    <p className="text-xs text-muted-foreground mt-2">
                                        {overallScore >= 70
                                            ? "🟢 Highly Viable"
                                            : overallScore >= 50
                                                ? "🟡 Moderately Viable"
                                                : "🔴 Needs Improvement"}
                                    </p>
                                </div>
                                <div className="text-5xl">/100</div>
                            </div>
                        </Card>

                        {/* Score Indicators Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <ScoreIndicator
                                label="Market Potential"
                                score={data.analysis.market_score}
                                icon={<TrendingUp className="w-5 h-5" />}
                            />
                            <ScoreIndicator
                                label="Competition Level"
                                score={data.analysis.competition_score}
                                icon={<Users className="w-5 h-5" />}
                            />
                            <ScoreIndicator
                                label="Feasibility"
                                score={data.analysis.feasibility_score}
                                icon={<Target className="w-5 h-5" />}
                            />
                        </div>

                        {/* Detailed Analysis Sections */}
                        <div className="space-y-4">
                            {/* Market Potential */}
                            <Card className="p-6 border-emerald-500/30 bg-emerald-500/5">
                                <div className="flex items-center gap-2 mb-3">
                                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                                    <h3 className="font-semibold text-foreground">Market Potential Analysis</h3>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {data.analysis.analysis_text
                                        .split("\n")
                                        .filter((line) => line.toLowerCase().includes("market"))
                                        .slice(0, 3)
                                        .join("\n") || data.analysis.analysis_text.split("\n").slice(0, 3).join("\n")}
                                </p>
                            </Card>

                            {/* Competition Analysis */}
                            <Card className="p-6 border-blue-500/30 bg-blue-500/5">
                                <div className="flex items-center gap-2 mb-3">
                                    <Users className="w-5 h-5 text-blue-600" />
                                    <h3 className="font-semibold text-foreground">Competition Landscape</h3>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {data.analysis.analysis_text
                                        .split("\n")
                                        .filter((line) => line.toLowerCase().includes("compet"))
                                        .slice(0, 3)
                                        .join("\n") || "Market analysis shows moderate competition levels with opportunities for differentiation."}
                                </p>
                            </Card>

                            {/* Feasibility Assessment */}
                            <Card className="p-6 border-purple-500/30 bg-purple-500/5">
                                <div className="flex items-center gap-2 mb-3">
                                    <Target className="w-5 h-5 text-purple-600" />
                                    <h3 className="font-semibold text-foreground">Feasibility Assessment</h3>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {data.analysis.analysis_text
                                        .split("\n")
                                        .filter((line) => line.toLowerCase().includes("feasib"))
                                        .slice(0, 3)
                                        .join("\n") || data.analysis.analysis_text.split("\n").slice(-3).join("\n")}
                                </p>
                            </Card>
                        </div>

                        {/* AI Suggestions */}
                        <Card className="p-6 border-amber-500/30 bg-amber-500/5">
                            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                                <Zap className="w-5 h-5 text-amber-600" />
                                AI Suggestions for Success
                            </h3>
                            <div className="space-y-3">
                                <div className="flex gap-3">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-600/20 flex items-center justify-center">
                                        <span className="text-xs font-bold text-amber-600">💡</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-foreground">Improve Your Idea</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Focus on unique value proposition and clear market differentiation. Consider addressing underserved segments.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-600/20 flex items-center justify-center">
                                        <span className="text-xs font-bold text-amber-600">👥</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-foreground">Target Audience Tips</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Define specific buyer personas and pain points. Build community engagement and validate assumptions with real users.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-600/20 flex items-center justify-center">
                                        <span className="text-xs font-bold text-amber-600">💰</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-foreground">Monetization Ideas</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Explore SaaS subscriptions, freemium models, or premium tiers. Consider strategic partnerships and revenue diversification.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Idea Details */}
                        <Card className="p-6 bg-secondary/20 border-secondary/30">
                            <h3 className="font-semibold text-foreground mb-4">Submission Details</h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">Industry</p>
                                    <Badge variant="secondary">{data.idea.industry}</Badge>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">Submitted</p>
                                    <p className="text-sm text-foreground">{new Date(data.idea.created_at).toLocaleString()}</p>
                                </div>
                            </div>
                        </Card>

                        {/* Action Button */}
                        <Button onClick={handleReset} className="w-full gap-2" size="lg">
                            <Zap className="w-4 h-4" />
                            Analyze Another Idea
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </motion.div>
                )}

                {/* Info Card */}
                {!data && !isLoading && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="glass-effect rounded-xl p-6 border border-primary/10"
                    >
                        <h3 className="font-semibold text-foreground mb-3">How AI Analysis Works</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex gap-2">
                                <span>✓</span>
                                <span>Analyzes market potential and TAM (Total Addressable Market)</span>
                            </li>
                            <li className="flex gap-2">
                                <span>✓</span>
                                <span>Evaluates competition and market saturation levels</span>
                            </li>
                            <li className="flex gap-2">
                                <span>✓</span>
                                <span>Calculates feasibility based on resources and timeline</span>
                            </li>
                            <li className="flex gap-2">
                                <span>✓</span>
                                <span>Provides actionable suggestions for improvement</span>
                            </li>
                        </ul>
                    </motion.div>
                )}
            </div>
        </>
    );
};

export default ValidateIdeaPage;
