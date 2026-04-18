/**
 * Animation Utilities
 * Reusable animation variants for Framer Motion across the app
 * Creates a consistent, premium feel with smooth transitions
 */

// ============================================================================
// PAGE TRANSITIONS
// ============================================================================

export const pageVariants = {
    initial: { opacity: 0, y: 10 },
    animate: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3, ease: "easeInOut" },
    },
    exit: {
        opacity: 0,
        y: -10,
        transition: { duration: 0.2, ease: "easeInOut" },
    },
};

export const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1,
        },
    },
};

// ============================================================================
// CARD & ELEMENT ANIMATIONS
// ============================================================================

export const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15,
            duration: 0.4,
        },
    },
    whileHover: {
        scale: 1.02,
        transition: { type: "spring", stiffness: 300, damping: 10 },
    },
};

export const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    show: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.3, ease: "easeOut" },
    },
};

// ============================================================================
// BUTTON & INTERACTIVE ANIMATIONS
// ============================================================================

export const buttonHoverVariants = {
    hover: {
        scale: 1.05,
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
        transition: { type: "spring", stiffness: 300, damping: 10 },
    },
    tap: {
        scale: 0.98,
        transition: { type: "spring", stiffness: 400, damping: 15 },
    },
};

export const iconRotateVariants = {
    hover: {
        rotate: 10,
        transition: { type: "spring", stiffness: 300, damping: 10 },
    },
};

export const linkHoverVariants = {
    hover: {
        x: 4,
        transition: { type: "spring", stiffness: 300, damping: 10 },
    },
};

// ============================================================================
// LOADING & SKELETON ANIMATIONS
// ============================================================================

export const pulseVariants = {
    pulse: {
        opacity: [0.6, 1, 0.6],
        transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
    },
};

export const shimmerVariants = {
    shimmer: {
        backgroundPosition: ["200% 0", "-200% 0"],
        transition: { duration: 2, repeat: Infinity, ease: "linear" },
    },
};

export const spinnerVariants = {
    spin: {
        rotate: 360,
        transition: { duration: 1.5, repeat: Infinity, ease: "linear" },
    },
};

// ============================================================================
// NOTIFICATION ANIMATIONS
// ============================================================================

export const toastVariants = {
    initial: { opacity: 0, y: -20, x: 100 },
    animate: {
        opacity: 1,
        y: 0,
        x: 0,
        transition: { type: "spring", stiffness: 300, damping: 20 },
    },
    exit: {
        opacity: 0,
        y: -20,
        x: 100,
        transition: { duration: 0.2, ease: "easeInOut" },
    },
};

export const errorVariants = {
    shake: {
        x: [-5, 5, -5, 5, 0],
        transition: { duration: 0.4, ease: "easeInOut" },
    },
};

// ============================================================================
// FORM ANIMATIONS
// ============================================================================

export const inputFocusVariants = {
    focus: {
        boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
        transition: { duration: 0.2 },
    },
};

export const validationVariants = {
    invalid: {
        x: [-2, 2, -2, 0],
        transition: { duration: 0.3, ease: "easeInOut" },
    },
};

export const checkmarkVariants = {
    hidden: { scale: 0, opacity: 0 },
    show: {
        scale: 1,
        opacity: 1,
        transition: { type: "spring", stiffness: 300, damping: 10 },
    },
};

// ============================================================================
// DROPDOWN & MENU ANIMATIONS
// ============================================================================

export const dropdownVariants = {
    hidden: {
        opacity: 0,
        scale: 0.95,
        y: -10,
    },
    show: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 20,
        },
    },
};

export const menuItemVariants = {
    hidden: { opacity: 0, x: -5 },
    show: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.2, ease: "easeOut" },
    },
    hover: {
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        paddingLeft: "8px",
        transition: { duration: 0.2 },
    },
};

// ============================================================================
// TEXT & CONTENT ANIMATIONS
// ============================================================================

export const textRevealVariants = {
    hidden: { opacity: 0, y: 5 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3, ease: "easeOut" },
    },
};

export const fadeInVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { duration: 0.4, ease: "easeInOut" },
    },
};

// ============================================================================
// STAGGER ANIMATIONS (for lists)
// ============================================================================

export const staggerContainer = (staggerChildren = 0.1, delayChildren = 0) => ({
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren,
            delayChildren,
        },
    },
});

export const staggerItem = (duration = 0.3) => ({
    hidden: { opacity: 0, y: 10 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration, ease: "easeOut" },
    },
});

// ============================================================================
// RESPONSIVE TRANSITION REDUCER
// ============================================================================

/**
 * Reduces animation duration on mobile devices for better performance
 */
export const getDuration = (desktop: number, mobile?: number): number => {
    if (typeof window === "undefined") return desktop;
    return window.innerWidth < 768 ? (mobile || desktop * 0.7) : desktop;
};
