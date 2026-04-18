/**
 * FormField Component
 * Provides real-time validation feedback with animations
 * Includes character counter and error messaging
 */

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle, Info } from "lucide-react";
import {
    validateIdea,
    validateEmail,
    validatePassword,
    validateIndustry,
    getCharacterCountState,
    getCharacterCountColor,
    ValidationResult,
} from "@/lib/formValidation";
import { validationVariants, checkmarkVariants } from "@/lib/animations";

interface FormFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    onBlur?: () => void;
    type?: "text" | "email" | "password" | "textarea" | "select";
    placeholder?: string;
    maxLength?: number;
    required?: boolean;
    disabled?: boolean;
    validationType?: "idea" | "email" | "password" | "industry" | "none";
    touched?: boolean;
    showCharacterCount?: boolean;
    className?: string;
    children?: React.ReactNode;
    validationHint?: string;
}

export function FormField({
    label,
    value,
    onChange,
    onBlur,
    type = "text",
    placeholder,
    maxLength,
    required = false,
    disabled = false,
    validationType = "none",
    touched = false,
    showCharacterCount = true,
    className = "",
    children,
    validationHint,
}: FormFieldProps) {
    const [validation, setValidation] = useState<ValidationResult | null>(null);

    const validateField = useCallback((val: string) => {
        let result: ValidationResult | null = null;

        switch (validationType) {
            case "idea":
                result = validateIdea(val);
                break;
            case "email":
                result = validateEmail(val);
                break;
            case "password":
                result = validatePassword(val);
                break;
            case "industry":
                result = validateIndustry(val);
                break;
            default:
                result = null;
        }

        setValidation(result);
        return result;
    }, [validationType]);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const newValue = e.target.value;
        onChange(newValue);

        if (touched) {
            validateField(newValue);
        }
    };

    const handleBlur = () => {
        validateField(value);
        onBlur?.();
    };

    const isValid =
        touched && validation ? validation.isValid : true;
    const hasErrors =
        touched && validation && validation.errors.length > 0;
    const charCountState = maxLength
        ? getCharacterCountState(value.length, maxLength)
        : null;

    const inputClasses = `
        w-full px-4 py-2 rounded-lg border transition-all duration-200
        ${disabled ? "bg-muted cursor-not-allowed opacity-60" : "bg-background"}
        ${hasErrors
            ? "border-red-500 focus:ring-2 focus:ring-red-500/50"
            : isValid && touched
                ? "border-emerald-500 focus:ring-2 focus:ring-emerald-500/50"
                : "border-muted-foreground/20 focus:ring-2 focus:ring-primary/50"
        }
        focus:outline-none focus:border-transparent
        text-foreground placeholder:text-muted-foreground
        ${className}
    `;

    return (
        <div className="space-y-2">
            {/* Label */}
            <label className="block text-sm font-medium text-foreground">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>

            {/* Input Field */}
            <motion.div
                animate={hasErrors ? "shake" : ""}
                variants={validationVariants}
                className="relative"
            >
                {type === "textarea" ? (
                    <textarea
                        value={value}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder={placeholder}
                        maxLength={maxLength}
                        disabled={disabled}
                        className={`resize-none ${inputClasses}`}
                        rows={4}
                    />
                ) : type === "select" ? (
                    <select
                        value={value}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={disabled}
                        className={inputClasses}
                    >
                        {children}
                    </select>
                ) : (
                    <input
                        type={type}
                        value={value}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder={placeholder}
                        maxLength={maxLength}
                        disabled={disabled}
                        className={inputClasses}
                    />
                )}

                {/* Validation Icons */}
                <AnimatePresence>
                    {touched && hasErrors && (
                        <motion.div
                            key="error-icon"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="absolute right-3 top-3"
                        >
                            <AlertCircle className="w-5 h-5 text-red-500" />
                        </motion.div>
                    )}
                    {touched && isValid && !hasErrors && (
                        <motion.div
                            key="success-icon"
                            variants={checkmarkVariants}
                            initial="hidden"
                            animate="show"
                            exit="hidden"
                            className="absolute right-3 top-3"
                        >
                            <CheckCircle className="w-5 h-5 text-emerald-500" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Character Counter */}
            {showCharacterCount && charCountState && (
                <div className={`text-xs ${getCharacterCountColor(charCountState)}`}>
                    {charCountState.current} / {charCountState.max} characters
                    {charCountState.isNearLimit && (
                        <span className="ml-2 opacity-70">
                            ({charCountState.remaining} remaining)
                        </span>
                    )}
                </div>
            )}

            {/* Error Messages */}
            <AnimatePresence>
                {hasErrors && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-1"
                    >
                        {validation.errors.map((error, idx) => (
                            <div
                                key={idx}
                                className="flex items-center gap-2 text-xs text-red-500"
                            >
                                <AlertCircle className="w-3 h-3 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Warnings */}
            <AnimatePresence>
                {validation?.warnings && validation.warnings.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-1"
                    >
                        {validation.warnings.map((warning, idx) => (
                            <div
                                key={idx}
                                className="flex items-center gap-2 text-xs text-yellow-500"
                            >
                                <Info className="w-3 h-3 flex-shrink-0" />
                                <span>{warning}</span>
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Validation Hint */}
            {validationHint && !hasErrors && !touched && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    {validationHint}
                </p>
            )}
        </div>
    );
}

export default FormField;
