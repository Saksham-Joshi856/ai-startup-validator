import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

interface LoadingTimeoutProps {
    isVisible: boolean;
}

export function LoadingTimeout({ isVisible }: LoadingTimeoutProps) {
    if (!isVisible) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 flex items-center gap-3 max-w-sm"
        >
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <p className="text-sm text-amber-800 font-medium">
                🌙 Server is waking up... This may take a moment
            </p>
        </motion.div>
    );
}
