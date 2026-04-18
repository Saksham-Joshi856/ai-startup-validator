/**
 * Animated Interactive Components
 * Buttons, links, and other interactive elements with built-in hover animations
 */

import React from "react";
import { motion } from "framer-motion";
import {
    buttonHoverVariants,
    linkHoverVariants,
    iconRotateVariants,
} from "@/lib/animations";

interface AnimatedButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "danger" | "success";
    size?: "sm" | "md" | "lg";
    icon?: React.ReactNode;
    iconPosition?: "left" | "right";
    loading?: boolean;
    children: React.ReactNode;
}

/**
 * AnimatedButton - Button with hover animations
 */
export const AnimatedButton = React.forwardRef<
    HTMLButtonElement,
    AnimatedButtonProps
>(
    (
        {
            variant = "primary",
            size = "md",
            icon,
            iconPosition = "left",
            loading = false,
            children,
            className = "",
            disabled,
            ...props
        },
        ref
    ) => {
        const baseClasses = `
            inline-flex items-center justify-center gap-2
            font-medium rounded-lg transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
        `;

        const sizeClasses = {
            sm: "px-3 py-1.5 text-sm",
            md: "px-4 py-2 text-base",
            lg: "px-6 py-3 text-lg",
        };

        const variantClasses = {
            primary:
                "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-lg active:shadow-md",
            secondary:
                "bg-gradient-to-r from-slate-500 to-slate-600 text-white hover:shadow-lg active:shadow-md",
            outline:
                "border-2 border-primary text-primary hover:bg-primary/10 active:bg-primary/20",
            danger:
                "bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-lg active:shadow-md",
            success:
                "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:shadow-lg active:shadow-md",
        };

        return (
            <motion.button
                ref={ref}
                variants={buttonHoverVariants}
                whileHover={!disabled && !loading ? "hover" : {}}
                whileTap={!disabled && !loading ? "tap" : {}}
                className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]
                    } ${className}`}
                disabled={disabled || loading}
                {...props}
            >
                {loading ? (
                    <>
                        <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="inline-block"
                        >
                            ⏳
                        </motion.span>
                        <span>Loading...</span>
                    </>
                ) : (
                    <>
                        {icon && iconPosition === "left" && (
                            <motion.span
                                variants={iconRotateVariants}
                                whileHover="hover"
                            >
                                {icon}
                            </motion.span>
                        )}
                        <span>{children}</span>
                        {icon && iconPosition === "right" && (
                            <motion.span
                                variants={iconRotateVariants}
                                whileHover="hover"
                            >
                                {icon}
                            </motion.span>
                        )}
                    </>
                )}
            </motion.button>
        );
    }
);
AnimatedButton.displayName = "AnimatedButton";

interface AnimatedLinkProps
    extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    variant?: "default" | "underline";
    children: React.ReactNode;
}

/**
 * AnimatedLink - Link with hover animation
 */
export const AnimatedLink = React.forwardRef<
    HTMLAnchorElement,
    AnimatedLinkProps
>(({ variant = "default", children, className = "", ...props }, ref) => {
    return (
        <motion.a
            ref={ref}
            variants={linkHoverVariants}
            whileHover="hover"
            className={`
                text-primary hover:text-primary/80 transition-colors
                ${variant === "underline" ? "underline" : ""}
                ${className}
            `}
            {...props}
        >
            {children}
        </motion.a>
    );
});
AnimatedLink.displayName = "AnimatedLink";

interface AnimatedCardProps
    extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    clickable?: boolean;
    onClick?: () => void;
}

/**
 * AnimatedCard - Card with hover elevation
 */
export const AnimatedCard = React.forwardRef<
    HTMLDivElement,
    AnimatedCardProps
>(
    (
        { children, clickable = false, onClick, className = "", ...props },
        ref
    ) => {
        return (
            <motion.div
                ref={ref}
                whileHover={clickable ? { y: -4, boxShadow: "0 20px 25px rgba(0,0,0,0.1)" } : {}}
                whileTap={clickable ? { scale: 0.98 } : {}}
                onClick={onClick}
                className={`
                    bg-card rounded-lg border border-border transition-all duration-200
                    ${clickable ? "cursor-pointer" : ""}
                    ${className}
                `}
                {...props}
            >
                {children}
            </motion.div>
        );
    }
);
AnimatedCard.displayName = "AnimatedCard";

interface AnimatedListItemProps
    extends React.HTMLAttributes<HTMLLIElement> {
    children: React.ReactNode;
    index?: number;
}

/**
 * AnimatedListItem - List item with stagger animation
 */
export const AnimatedListItem = React.forwardRef<
    HTMLLIElement,
    AnimatedListItemProps
>(({ children, index = 0, className = "", ...props }, ref) => {
    return (
        <motion.li
            ref={ref}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`py-2 ${className}`}
            {...props}
        >
            {children}
        </motion.li>
    );
});
AnimatedListItem.displayName = "AnimatedListItem";

interface HoverGlowEffectProps {
    children: React.ReactNode;
    color?: "blue" | "emerald" | "red" | "yellow";
    intensity?: "low" | "medium" | "high";
    className?: string;
}

/**
 * HoverGlowEffect - Adds a glow effect on hover
 */
export const HoverGlowEffect = ({
    children,
    color = "blue",
    intensity = "medium",
    className = "",
}: HoverGlowEffectProps) => {
    const glowClasses = {
        blue: "hover:shadow-lg hover:shadow-blue-500/30",
        emerald: "hover:shadow-lg hover:shadow-emerald-500/30",
        red: "hover:shadow-lg hover:shadow-red-500/30",
        yellow: "hover:shadow-lg hover:shadow-yellow-500/30",
    };

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className={`transition-all duration-300 ${glowClasses[color]} ${className}`}
        >
            {children}
        </motion.div>
    );
};

// Export all components
export default {
    AnimatedButton,
    AnimatedLink,
    AnimatedCard,
    AnimatedListItem,
    HoverGlowEffect,
};
