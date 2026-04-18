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
            <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 shadow-lg">
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
                className="p-6 rounded-lg bg-gradient-to-br from-slate-900/50 to-slate-800/30 border border-slate-700/40 mb-6"
            >
                <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <h3 className="font-bold text-foreground">Score Trend</h3>
                </div>
                <div className="text-center py-8">
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
            className="p-6 rounded-lg bg-gradient-to-br from-slate-900/50 to-slate-800/30 border border-slate-700/40 mb-6"
        >
            <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-foreground">Score Trend Over Time</h3>
            </div>

            <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 116, 139, 0.2)" />
                        <XAxis
                            dataKey="date"
                            stroke="rgba(148, 163, 184, 0.5)"
                            style={{ fontSize: '12px' }}
                        />
                        <YAxis
                            domain={[0, 100]}
                            stroke="rgba(148, 163, 184, 0.5)"
                            style={{ fontSize: '12px' }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                            type="monotone"
                            dataKey="score"
                            stroke="#0ea5e9"
                            strokeWidth={3}
                            dot={{ fill: '#0ea5e9', r: 4 }}
                            activeDot={{ r: 6, fill: '#06b6d4' }}
                            isAnimationActive={true}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-4 p-3 rounded-md bg-slate-700/20 border border-slate-600/20">
                <p className="text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">Tip:</span> Track how your idea scores improve over time as you refine them. Click on any point to see details.
                </p>
            </div>
        </motion.div>
    );
};
