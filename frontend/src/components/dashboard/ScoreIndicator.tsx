/**
 * ScoreIndicator Component
 * Displays a linear progress bar with score out of 10
 * Shows score label, value, and progress visualization
 */

import { ReactNode } from 'react';
import { Progress } from '@/components/ui/progress';

interface ScoreIndicatorProps {
    label: string;
    value: number; // 0-100 scale from API
    icon: ReactNode;
    color: 'blue' | 'purple' | 'green' | 'amber' | 'red';
}

export function ScoreIndicator({ label, value, icon, color }: ScoreIndicatorProps) {
    // Convert from 0-100 to 0-10 scale
    const displayValue = (value / 100) * 10;

    // Color mapping for progress bar and text
    const colorMap = {
        blue: {
            bar: 'bg-blue-500',
            badge: 'bg-blue-100 text-blue-800',
            icon: '#3b82f6',
        },
        purple: {
            bar: 'bg-purple-500',
            badge: 'bg-purple-100 text-purple-800',
            icon: '#a855f7',
        },
        green: {
            bar: 'bg-green-500',
            badge: 'bg-green-100 text-green-800',
            icon: '#22c55e',
        },
        amber: {
            bar: 'bg-amber-500',
            badge: 'bg-amber-100 text-amber-800',
            icon: '#f59e0b',
        },
        red: {
            bar: 'bg-red-500',
            badge: 'bg-red-100 text-red-800',
            icon: '#ef4444',
        },
    };

    const colors = colorMap[color];

    return (
        <div className="space-y-3">
            {/* Header with Icon and Label */}
            <div className="flex items-center gap-3">
                <div className="text-lg opacity-80">{icon}</div>
                <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">{label}</p>
                </div>
                <div className={`px-2.5 py-1 rounded-full text-xs font-bold ${colors.badge}`}>
                    {displayValue.toFixed(1)}/10
                </div>
            </div>

            {/* Progress Bar */}
            <div className="overflow-hidden rounded-full bg-secondary/40 h-2">
                <div
                    className={`h-full ${colors.bar} transition-all duration-500`}
                    style={{ width: `${value}%` }}
                />
            </div>
        </div>
    );
}
