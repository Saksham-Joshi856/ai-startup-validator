import { motion } from "framer-motion";

// ============================================================================
// MAIN LOADING FALLBACK
// ============================================================================

export function SuspenseFallback() {
    return (
        <div className="flex items-center justify-center min-h-96">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
            />
        </div>
    );
}

// ============================================================================
// CARD SKELETONS
// ============================================================================

export function CardSkeleton() {
    return (
        <div className="space-y-4">
            {[1, 2, 3].map((i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0.6 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="h-24 rounded-lg bg-muted"
                />
            ))}
        </div>
    );
}

export function SingleCardSkeleton() {
    return (
        <motion.div
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="h-48 rounded-lg bg-muted"
        />
    );
}

export function GridCardSkeleton({ columns = 3, count = 6 }) {
    return (
        <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-4`}>
            {Array.from({ length: count }).map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0.6 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                    className="h-40 rounded-lg bg-muted"
                />
            ))}
        </div>
    );
}

// ============================================================================
// FORM SKELETONS
// ============================================================================

export function FormSkeleton() {
    return (
        <div className="space-y-5 w-full max-w-xl">
            {/* Input field skeleton */}
            <div className="space-y-2">
                <motion.div
                    initial={{ opacity: 0.6 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="h-4 w-24 rounded-md bg-muted"
                />
                <motion.div
                    initial={{ opacity: 0.6 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.1 }}
                    className="h-10 w-full rounded-lg bg-muted"
                />
            </div>

            {/* Textarea skeleton */}
            <div className="space-y-2">
                <motion.div
                    initial={{ opacity: 0.6 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                    className="h-4 w-24 rounded-md bg-muted"
                />
                <motion.div
                    initial={{ opacity: 0.6 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                    className="h-24 w-full rounded-lg bg-muted"
                />
            </div>

            {/* Select field skeleton */}
            <div className="space-y-2">
                <motion.div
                    initial={{ opacity: 0.6 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                    className="h-4 w-32 rounded-md bg-muted"
                />
                <motion.div
                    initial={{ opacity: 0.6 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                    className="h-10 w-full rounded-lg bg-muted"
                />
            </div>

            {/* Button skeleton */}
            <motion.div
                initial={{ opacity: 0.6 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
                className="h-10 w-32 rounded-lg bg-muted"
            />
        </div>
    );
}

// ============================================================================
// TABLE SKELETONS
// ============================================================================

export function TableSkeleton() {
    return (
        <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0.6 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                    className="h-12 rounded-lg bg-muted"
                />
            ))}
        </div>
    );
}

export function AdvancedTableSkeleton() {
    return (
        <div className="space-y-2">
            {/* Header skeleton */}
            <motion.div
                initial={{ opacity: 0.6 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="h-10 rounded-lg bg-muted"
            />
            {/* Row skeletons */}
            {[1, 2, 3, 4].map((i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0.6 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                    className="h-12 rounded-lg bg-muted"
                />
            ))}
        </div>
    );
}

// ============================================================================
// STATISTICS SKELETONS
// ============================================================================

export function StatSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0.6 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                    className="h-32 rounded-lg bg-muted"
                />
            ))}
        </div>
    );
}

export function InsightCardSkeleton() {
    return (
        <div className="space-y-3">
            <motion.div
                initial={{ opacity: 0.6 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="h-6 w-24 rounded-md bg-muted"
            />
            <motion.div
                initial={{ opacity: 0.6 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.1 }}
                className="h-8 w-16 rounded-md bg-muted"
            />
        </div>
    );
}

// ============================================================================
// CHART SKELETONS
// ============================================================================

export function ChartSkeleton() {
    return (
        <div className="space-y-4">
            {/* Chart title skeleton */}
            <motion.div
                initial={{ opacity: 0.6 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="h-6 w-40 rounded-md bg-muted"
            />
            {/* Chart area skeleton */}
            <motion.div
                initial={{ opacity: 0.6 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.1 }}
                className="h-64 w-full rounded-lg bg-muted"
            />
        </div>
    );
}

// ============================================================================
// LIST SKELETONS
// ============================================================================

export function ListItemSkeleton({ count = 3 }) {
    return (
        <div className="space-y-3">
            {Array.from({ length: count }).map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0.6 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                    className="h-16 rounded-lg bg-muted"
                />
            ))}
        </div>
    );
}

// ============================================================================
// CONTENT SKELETONS
// ============================================================================

export function TextSkeleton({ lines = 3 }) {
    return (
        <div className="space-y-3">
            {Array.from({ length: lines }).map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0.6 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                    className={`h-4 rounded-md bg-muted ${i === lines - 1 ? "w-3/4" : "w-full"}`}
                />
            ))}
        </div>
    );
}

export function UserProfileSkeleton() {
    return (
        <div className="space-y-4">
            {/* Avatar skeleton */}
            <motion.div
                initial={{ opacity: 0.6 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-16 h-16 rounded-full bg-muted"
            />
            {/* Name skeleton */}
            <motion.div
                initial={{ opacity: 0.6 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.1 }}
                className="h-4 w-32 rounded-md bg-muted"
            />
            {/* Email skeleton */}
            <motion.div
                initial={{ opacity: 0.6 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                className="h-4 w-40 rounded-md bg-muted"
            />
        </div>
    );
}
