/**
 * PageTransition Component
 * Wraps page components for smooth animated transitions
 * Provides consistent page entry/exit animations
 */

import { motion } from "framer-motion";
import React from "react";
import { pageVariants } from "@/lib/animations";

interface PageTransitionProps {
    children: React.ReactNode;
    className?: string;
}

export function PageTransition({
    children,
    className = "",
}: PageTransitionProps) {
    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={`w-full ${className}`}
        >
            {children}
        </motion.div>
    );
}

export default PageTransition;
