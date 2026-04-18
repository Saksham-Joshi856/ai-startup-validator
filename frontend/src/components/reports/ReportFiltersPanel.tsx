import { motion } from 'framer-motion';
import { Filter, X } from 'lucide-react';
import { useState } from 'react';

export interface ReportFilters {
    industries: string[];
    scoreRange: [number, number];
    searchText: string;
}

interface ReportFiltersPanelProps {
    industries: string[];
    filters: ReportFilters;
    onFiltersChange: (filters: ReportFilters) => void;
    onClearFilters: () => void;
}

const scorePresets = [
    { label: 'All Scores', value: [0, 100] },
    { label: 'High (70+)', value: [70, 100] },
    { label: 'Medium (50-69)', value: [50, 69] },
    { label: 'Low (<50)', value: [0, 49] },
];

export const ReportFiltersPanel = ({
    industries,
    filters,
    onFiltersChange,
    onClearFilters,
}: ReportFiltersPanelProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleIndustry = (industry: string) => {
        const updated = filters.industries.includes(industry)
            ? filters.industries.filter((i) => i !== industry)
            : [...filters.industries, industry];

        onFiltersChange({ ...filters, industries: updated });
    };

    const setScoreRange = (range: [number, number]) => {
        onFiltersChange({ ...filters, scoreRange: range });
    };

    const handleSearchChange = (text: string) => {
        onFiltersChange({ ...filters, searchText: text });
    };

    const hasActiveFilters =
        filters.industries.length > 0 ||
        filters.scoreRange[0] !== 0 ||
        filters.scoreRange[1] !== 100 ||
        filters.searchText.length > 0;

    return (
        <div className="mb-6">
            {/* Filter Toggle Button */}
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 border border-slate-600/30 text-foreground transition-all duration-200"
                >
                    <Filter className="w-4 h-4" />
                    <span className="text-sm font-medium">Filters</span>
                    {hasActiveFilters && (
                        <span className="ml-2 px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-semibold">
                            Active
                        </span>
                    )}
                </button>

                {hasActiveFilters && (
                    <button
                        onClick={onClearFilters}
                        className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X className="w-3 h-3" />
                        Clear all
                    </button>
                )}
            </div>

            {/* Filter Panel */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                >
                    <div className="p-4 rounded-lg bg-slate-800/40 border border-slate-700/40 space-y-4">
                        {/* Search */}
                        <div>
                            <label className="text-xs font-semibold text-muted-foreground mb-2 block">
                                Search
                            </label>
                            <input
                                type="text"
                                placeholder="Search ideas..."
                                value={filters.searchText}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                className="w-full px-3 py-2 rounded-md bg-slate-700/50 border border-slate-600/30 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                            />
                        </div>

                        {/* Industry Filter */}
                        <div>
                            <label className="text-xs font-semibold text-muted-foreground mb-2 block">
                                Industry
                            </label>
                            <div className="space-y-2">
                                {industries.map((industry) => (
                                    <label
                                        key={industry}
                                        className="flex items-center gap-2 cursor-pointer group"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={filters.industries.includes(industry)}
                                            onChange={() => toggleIndustry(industry)}
                                            className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-primary cursor-pointer"
                                        />
                                        <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                                            {industry}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Score Range Filter */}
                        <div>
                            <label className="text-xs font-semibold text-muted-foreground mb-2 block">
                                Score Range
                            </label>
                            <div className="space-y-2">
                                {scorePresets.map((preset) => (
                                    <button
                                        key={preset.label}
                                        onClick={() => setScoreRange(preset.value as [number, number])}
                                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-200 ${JSON.stringify(filters.scoreRange) === JSON.stringify(preset.value)
                                                ? 'bg-primary/20 text-primary border border-primary/40'
                                                : 'bg-slate-700/30 text-foreground hover:bg-slate-700/50 border border-slate-600/30'
                                            }`}
                                    >
                                        {preset.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};
