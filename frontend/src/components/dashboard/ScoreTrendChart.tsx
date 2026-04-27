import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface ScoreTrendChartProps {
    data: Array<{
        date: string;
        score: number;
        ideaTitle: string;
    }>;
}

const chartVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
        opacity: 1,
        y: 0,
        transition: { type: 'spring', stiffness: 100, damping: 15 },
    },
};

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-card border border-border/20 rounded-lg p-3 shadow-md">
                <p className="text-xs font-semibold text-foreground mb-1">
                    {data.date}
                </p>
                <p className="text-xs text-muted-foreground mb-2">
                    {data.ideaTitle}
                </p>
                <p className="text-sm font-bold text-primary">
                    Score: {data.score}
                </p>
            </div>
        );
    }
    return null;
};

export const ScoreTrendChart = ({ data }: ScoreTrendChartProps) => {
    if (!data || data.length < 2) {
        return (
            <motion.div
                variants={chartVariants}
                initial="hidden"
                animate="show"
                className="p-6 rounded-lg bg-card border border-border/20"
            >
                <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-foreground">Score Trend</h3>
                </div>
                <div className="text-center py-12">
                    <p className="text-sm text-muted-foreground">
                        Create multiple ideas to see your score trend
                    </p>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            variants={chartVariants}
            initial="hidden"
            animate="show"
            className="p-6 rounded-lg bg-card border border-border/20"
        >
            <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">Score Trend Over Time</h3>
            </div>

            <div className="w-full" style={{ height: 'clamp(250px, 60vw, 400px)' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.3)" vertical={false} />
                        <XAxis
                            dataKey="date"
                            stroke="hsl(var(--muted-foreground))"
                            style={{ fontSize: '12px' }}
                            tick={{ fill: 'hsl(var(--muted-foreground))' }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            domain={[0, 100]}
                            stroke="hsl(var(--muted-foreground))"
                            style={{ fontSize: '12px' }}
                            tick={{ fill: 'hsl(var(--muted-foreground))' }}
                            axisLine={false}
                            tickLine={false}
                            width={40}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                            type="monotone"
                            dataKey="score"
                            stroke="hsl(var(--primary))"
                            strokeWidth={2}
                            dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-4 p-3 rounded-lg bg-muted/30 border border-border/10">
                <p className="text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">Tip:</span> Track how your idea scores improve over time as you refine them.
                </p>
            </div>
        </motion.div>
    );
};
