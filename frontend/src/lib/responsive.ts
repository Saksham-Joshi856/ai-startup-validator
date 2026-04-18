/**
 * Responsive Design Utilities
 * Helps manage responsive layouts and mobile-first design
 */

// ============================================================================
// BREAKPOINTS
// ============================================================================

export const BREAKPOINTS = {
    xs: 0,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    "2xl": 1536,
} as const;

export type BreakpointKey = keyof typeof BREAKPOINTS;

// ============================================================================
// MEDIA QUERY HOOKS
// ============================================================================

import { useEffect, useState } from "react";

/**
 * Hook to detect if screen is at or above a breakpoint
 */
export function useMediaQuery(breakpoint: BreakpointKey | number): boolean {
    const [isMatch, setIsMatch] = useState(false);

    useEffect(() => {
        const breakpointValue =
            typeof breakpoint === "string"
                ? BREAKPOINTS[breakpoint]
                : breakpoint;

        const mediaQuery = window.matchMedia(
            `(min-width: ${breakpointValue}px)`
        );

        // Set initial value
        setIsMatch(mediaQuery.matches);

        // Create listener
        const handleChange = (e: MediaQueryListEvent) => {
            setIsMatch(e.matches);
        };

        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, [breakpoint]);

    return isMatch;
}

/**
 * Hook to detect if screen is below a breakpoint
 */
export function useMediaQueryBelow(breakpoint: BreakpointKey | number): boolean {
    const [isMatch, setIsMatch] = useState(false);

    useEffect(() => {
        const breakpointValue =
            typeof breakpoint === "string"
                ? BREAKPOINTS[breakpoint]
                : breakpoint;

        const mediaQuery = window.matchMedia(
            `(max-width: ${breakpointValue - 1}px)`
        );

        setIsMatch(mediaQuery.matches);

        const handleChange = (e: MediaQueryListEvent) => {
            setIsMatch(e.matches);
        };

        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, [breakpoint]);

    return isMatch;
}

/**
 * Commonly used responsive hooks
 */
export function useIsMobile(): boolean {
    return useMediaQueryBelow("md");
}

export function useIsTablet(): boolean {
    const isMobile = useMediaQueryBelow("lg");
    const isAboveSm = useMediaQuery("sm");
    return isMobile && isAboveSm;
}

export function useIsDesktop(): boolean {
    return useMediaQuery("lg");
}

// ============================================================================
// RESPONSIVE UTILITY FUNCTIONS
// ============================================================================

/**
 * Get responsive value based on screen size
 */
export function getResponsiveValue<T>(
    mobileValue: T,
    tabletValue?: T,
    desktopValue?: T
): T {
    if (typeof window === "undefined") return mobileValue;

    const width = window.innerWidth;

    if (width < BREAKPOINTS.md) {
        return mobileValue;
    } else if (width < BREAKPOINTS.lg && tabletValue) {
        return tabletValue;
    } else if (desktopValue) {
        return desktopValue;
    }

    return mobileValue;
}

/**
 * Get responsive grid columns
 */
export function getResponsiveGridCols(
    mobile: number = 1,
    tablet?: number,
    desktop?: number
): string {
    tablet = tablet || mobile;
    desktop = desktop || tablet;

    return `grid-cols-${mobile} md:grid-cols-${tablet} lg:grid-cols-${desktop}`;
}

/**
 * Get responsive padding
 */
export function getResponsivePadding(
    mobile: "2" | "3" | "4" | "6" | "8" = "4",
    tablet?: "2" | "3" | "4" | "6" | "8",
    desktop?: "2" | "3" | "4" | "6" | "8"
): string {
    tablet = tablet || mobile;
    desktop = desktop || tablet;

    return `p-${mobile} md:p-${tablet} lg:p-${desktop}`;
}

/**
 * Get responsive gap
 */
export function getResponsiveGap(
    mobile: "2" | "3" | "4" | "6" | "8" = "4",
    tablet?: "2" | "3" | "4" | "6" | "8",
    desktop?: "2" | "3" | "4" | "6" | "8"
): string {
    tablet = tablet || mobile;
    desktop = desktop || tablet;

    return `gap-${mobile} md:gap-${tablet} lg:gap-${desktop}`;
}

// ============================================================================
// RESPONSIVE LAYOUT COMPONENTS
// ============================================================================

import React from "react";

interface ResponsiveGridProps {
    children: React.ReactNode;
    cols?: { mobile: number; tablet?: number; desktop?: number };
    gap?: { mobile: number; tablet?: number; desktop?: number };
    className?: string;
}

/**
 * ResponsiveGrid - Automatically responsive grid
 */
export const ResponsiveGrid = React.forwardRef<
    HTMLDivElement,
    ResponsiveGridProps
>(
    (
        {
            children,
            cols = { mobile: 1, tablet: 2, desktop: 3 },
            gap = { mobile: 4, tablet: 4, desktop: 6 },
            className = "",
        },
        ref
    ) => {
        return (
            <div
                ref= { ref }
        className = {`
                    grid
                    gap-${gap.mobile}
                    md:gap-${gap.tablet}
                    lg:gap-${gap.desktop}
                    grid-cols-${cols.mobile}
                    md:grid-cols-${cols.tablet}
                    lg:grid-cols-${cols.desktop}
                    ${className}
                `}
            >
    { children }
    </div>
);
    }
);
ResponsiveGrid.displayName = "ResponsiveGrid";

interface ResponsiveContainerProps {
    children: React.ReactNode;
    size?: "sm" | "md" | "lg" | "xl" | "full";
    className?: string;
}

/**
 * ResponsiveContainer - Responsive container with max-width
 */
export const ResponsiveContainer = React.forwardRef<
    HTMLDivElement,
    ResponsiveContainerProps
>(({ children, size = "lg", className = "" }, ref) => {
    const sizeClasses = {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        full: "max-w-full",
    };

    return (
        <div
            ref= { ref }
    className = {`
                mx-auto w-full
                px-4 sm:px-6 lg:px-8
                ${sizeClasses[size]}
                ${className}
            `}
        >
    { children }
    </div>
);
});
ResponsiveContainer.displayName = "ResponsiveContainer";

interface ResponsiveStackProps {
    children: React.ReactNode;
    direction?: { mobile: "row" | "col"; desktop: "row" | "col" };
    gap?: number;
    className?: string;
}

/**
 * ResponsiveStack - Stack that changes direction on mobile
 */
export const ResponsiveStack = React.forwardRef<
    HTMLDivElement,
    ResponsiveStackProps
>(
    (
        {
            children,
            direction = { mobile: "col", desktop: "row" },
            gap = 4,
            className = "",
        },
        ref
    ) => {
        const mobileDir =
            direction.mobile === "row" ? "flex-row" : "flex-col";
        const desktopDir =
            direction.desktop === "row" ? "lg:flex-row" : "lg:flex-col";

        return (
            <div
                ref= { ref }
        className = {`
                    flex
                    ${mobileDir}
                    ${desktopDir}
                    gap-${gap}
                    ${className}
                `}
            >
    { children }
    </div>
);
    }
);
ResponsiveStack.displayName = "ResponsiveStack";

// ============================================================================
// RESPONSIVE TEXT UTILITIES
// ============================================================================

/**
 * Get responsive font size class
 */
export function getResponsiveFontSize(
    mobile: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" = "base",
    tablet?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl",
    desktop?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl"
): string {
    tablet = tablet || mobile;
    desktop = desktop || tablet;

    return `text-${mobile} md:text-${tablet} lg:text-${desktop}`;
}

/**
 * Truncate text responsively
 */
export function getTruncateClasses(
    lines: { mobile: number; desktop: number } = { mobile: 1, desktop: 2 }
): string {
    if (lines.mobile === 1) {
        return `line-clamp-1 lg:line-clamp-${lines.desktop}`;
    }
    return `line-clamp-${lines.mobile} lg:line-clamp-${lines.desktop}`;
}
