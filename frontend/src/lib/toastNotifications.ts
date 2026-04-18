/**
 * Toast Notification Utilities
 * Provides easy-to-use toast notifications for success, error, warning, and info
 */

import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, CheckCircle, AlertTriangle, Info } from "lucide-react";

// ============================================================================
// TOAST INSTANCE MANAGER
// ============================================================================

let toastInstance: ReturnType<typeof useToast> | null = null;

export const setToastInstance = (toast: ReturnType<typeof useToast>) => {
    toastInstance = toast;
};

export const getToastInstance = () => {
    if (!toastInstance) {
        console.warn(
            "Toast instance not initialized. Make sure ToastProvider is set up."
        );
    }
    return toastInstance;
};

// ============================================================================
// TOAST NOTIFICATION FUNCTIONS
// ============================================================================

export interface ToastOptions {
    title?: string;
    description?: string;
    duration?: number;
    action?: any;
}

/**
 * Show success toast notification
 */
export function showSuccessToast(
    title: string = "Success",
    options?: Omit<ToastOptions, "title">
) {
    const toast = getToastInstance();
    if (!toast) return;

    toast({
        title,
        description: options?.description,
        duration: options?.duration || 4000,
        className: "bg-emerald-600 text-white border-emerald-700",
    });
}

/**
 * Show error toast notification
 */
export function showErrorToast(
    title: string = "Error",
    options?: Omit<ToastOptions, "title">
) {
    const toast = getToastInstance();
    if (!toast) return;

    toast({
        title,
        description: options?.description,
        duration: options?.duration || 5000,
        className: "bg-red-600 text-white border-red-700",
    });
}

/**
 * Show warning toast notification
 */
export function showWarningToast(
    title: string = "Warning",
    options?: Omit<ToastOptions, "title">
) {
    const toast = getToastInstance();
    if (!toast) return;

    toast({
        title,
        description: options?.description,
        duration: options?.duration || 4000,
        className: "bg-yellow-600 text-white border-yellow-700",
    });
}

/**
 * Show info toast notification
 */
export function showInfoToast(
    title: string = "Info",
    options?: Omit<ToastOptions, "title">
) {
    const toast = getToastInstance();
    if (!toast) return;

    toast({
        title,
        description: options?.description,
        duration: options?.duration || 4000,
        className: "bg-blue-600 text-white border-blue-700",
    });
}

/**
 * Show loading toast notification (no auto-close)
 */
export function showLoadingToast(
    title: string = "Loading",
    options?: Omit<ToastOptions, "title">
) {
    const toast = getToastInstance();
    if (!toast) return;

    toast({
        title,
        description: options?.description,
        duration: Infinity,
        className: "bg-slate-600 text-white border-slate-700",
    });
}

// ============================================================================
// HOOK: useToastNotifications
// ============================================================================

export function useToastNotifications() {
    const { toast } = useToast();

    // Set the global instance
    React.useEffect(() => {
        setToastInstance({ toast } as any);
    }, [toast]);

    return {
        success: (title: string, options?: Omit<ToastOptions, "title">) => {
            showSuccessToast(title, options);
        },
        error: (title: string, options?: Omit<ToastOptions, "title">) => {
            showErrorToast(title, options);
        },
        warning: (title: string, options?: Omit<ToastOptions, "title">) => {
            showWarningToast(title, options);
        },
        info: (title: string, options?: Omit<ToastOptions, "title">) => {
            showInfoToast(title, options);
        },
        loading: (title: string, options?: Omit<ToastOptions, "title">) => {
            showLoadingToast(title, options);
        },
    };
}

// Add React import for useEffect
import React from "react";
