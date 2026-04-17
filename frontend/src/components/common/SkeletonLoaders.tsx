import { motion } from "framer-motion";

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

export function TableSkeleton() {
    return (
        <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0.6 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="h-12 rounded-lg bg-muted"
                />
            ))}
        </div>
    );
}

export function StatSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0.6 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="h-32 rounded-lg bg-muted"
                />
            ))}
        </div>
    );
}
