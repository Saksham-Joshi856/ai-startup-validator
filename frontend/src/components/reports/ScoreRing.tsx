import { motion } from 'framer-motion';

interface ScoreRingProps {
    score: number;      // 0-100
    size?: number;      // diameter in pixels
    strokeWidth?: number;
    label?: string;
}

export function ScoreRing({ score, size = 80, strokeWidth = 6, label }: ScoreRingProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    // Color based on score
    const getColor = (s: number) => {
        if (s >= 80) return { ring: '#10b981', bg: '#ecfdf5', text: '#059669' }; // Green
        if (s >= 60) return { ring: '#f59e0b', bg: '#fffbeb', text: '#d97706' }; // Yellow
        return { ring: '#ef4444', bg: '#fef2f2', text: '#dc2626' }; // Red
    };

    const colors = getColor(score);

    return (
        <div className="flex flex-col items-center gap-2">
            <motion.svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={colors.bg}
                    strokeWidth={strokeWidth}
                />

                {/* Progress circle */}
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={colors.ring}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    strokeLinecap="round"
                    style={{
                        transform: 'rotate(-90deg)',
                        transformOrigin: `${size / 2}px ${size / 2}px`,
                    }}
                />

                {/* Score text */}
                <text
                    x={size / 2}
                    y={size / 2 + 4}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="font-bold"
                    fontSize={size * 0.4}
                    fill={colors.text}
                >
                    {score}
                </text>
            </motion.svg>
            {label && <span className="text-xs font-semibold text-muted">{label}</span>}
        </div>
    );
}
