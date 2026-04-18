/**
 * Form Validation Utilities
 * Provides real-time validation feedback and character counting
 */

// ============================================================================
// VALIDATION RULES
// ============================================================================

export interface ValidationResult {
    isValid: boolean;
    errors: string[];
    warnings?: string[];
}

export const ValidationRules = {
    // Text validation
    minLength: (value: string, min: number): boolean => value.length >= min,
    maxLength: (value: string, max: number): boolean => value.length <= max,
    notEmpty: (value: string): boolean => value.trim().length > 0,

    // Email validation
    email: (value: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    },

    // Password validation
    password: (value: string): boolean => {
        return (
            value.length >= 8 &&
            /[A-Z]/.test(value) &&
            /[a-z]/.test(value) &&
            /[0-9]/.test(value)
        );
    },

    // Phone validation
    phone: (value: string): boolean => {
        const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s]?[(]?[0-9]{1,4}[)]?[-\s]?[0-9]{1,9}$/;
        return phoneRegex.test(value);
    },

    // URL validation
    url: (value: string): boolean => {
        try {
            new URL(value);
            return true;
        } catch {
            return false;
        }
    },

    // Number validation
    number: (value: string): boolean => !isNaN(Number(value)),

    // Positive number validation
    positiveNumber: (value: string): boolean => {
        const num = Number(value);
        return !isNaN(num) && num > 0;
    },
};

// ============================================================================
// FIELD VALIDATORS
// ============================================================================

export function validateIdea(idea: string): ValidationResult {
    const errors: string[] = [];

    if (!ValidationRules.notEmpty(idea)) {
        errors.push("Idea description is required");
    }
    if (!ValidationRules.minLength(idea, 20)) {
        errors.push("Idea must be at least 20 characters long");
    }
    if (!ValidationRules.maxLength(idea, 5000)) {
        errors.push("Idea cannot exceed 5000 characters");
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
}

export function validateEmail(email: string): ValidationResult {
    const errors: string[] = [];

    if (!ValidationRules.notEmpty(email)) {
        errors.push("Email is required");
    }
    if (!ValidationRules.email(email)) {
        errors.push("Please enter a valid email address");
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
}

export function validatePassword(password: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!ValidationRules.notEmpty(password)) {
        errors.push("Password is required");
    }
    if (password.length < 8) {
        errors.push("Password must be at least 8 characters long");
    }
    if (!/[A-Z]/.test(password)) {
        warnings.push("Password should contain at least one uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
        warnings.push("Password should contain at least one lowercase letter");
    }
    if (!/[0-9]/.test(password)) {
        warnings.push("Password should contain at least one number");
    }

    return {
        isValid: errors.length === 0 && password.length >= 8,
        errors,
        warnings,
    };
}

export function validateIndustry(industry: string): ValidationResult {
    const errors: string[] = [];

    if (!ValidationRules.notEmpty(industry)) {
        errors.push("Industry selection is required");
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
}

export function validateForm(
    formData: Record<string, any>,
    rules: Record<string, (value: any) => ValidationResult>
): Record<string, ValidationResult> {
    const results: Record<string, ValidationResult> = {};

    for (const [field, validator] of Object.entries(rules)) {
        results[field] = validator(formData[field] || "");
    }

    return results;
}

// ============================================================================
// CHARACTER COUNTER
// ============================================================================

export interface CharacterCountState {
    current: number;
    max: number;
    remaining: number;
    percentage: number;
    isNearLimit: boolean;
}

export function getCharacterCountState(
    current: number,
    max: number,
    warningThreshold: number = 80
): CharacterCountState {
    const remaining = max - current;
    const percentage = (current / max) * 100;
    const isNearLimit = percentage >= warningThreshold;

    return {
        current,
        max,
        remaining,
        percentage,
        isNearLimit,
    };
}

export function getCharacterCountColor(state: CharacterCountState): string {
    if (state.percentage >= 100) return "text-red-500";
    if (state.isNearLimit) return "text-yellow-500";
    return "text-muted-foreground";
}

// ============================================================================
// FIELD STATE MANAGEMENT
// ============================================================================

export interface FieldState {
    value: string;
    isDirty: boolean;
    isValid: boolean;
    errors: string[];
    touched: boolean;
}

export const createFieldState = (initialValue = ""): FieldState => ({
    value: initialValue,
    isDirty: false,
    isValid: true,
    errors: [],
    touched: false,
});

export const updateFieldState = (
    state: FieldState,
    updates: Partial<FieldState>
): FieldState => ({
    ...state,
    ...updates,
});
