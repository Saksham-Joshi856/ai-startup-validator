import { useState } from 'react';
import { useCreateIdea } from '../hooks/useCreateIdea';

/**
 * IdeaSubmissionForm Component
 * 
 * A form component for submitting startup ideas for analysis.
 * Includes validation, loading state, and success/error messages.
 */
export function IdeaSubmissionForm() {
    // Form state
    const [ideaText, setIdeaText] = useState('');
    const [industry, setIndustry] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // API hook
    const { createIdea, isLoading, error } = useCreateIdea();

    // Industry options
    const industries = [
        { value: '', label: 'Select an industry...' },
        { value: 'Technology', label: 'Technology' },
        { value: 'Healthcare', label: 'Healthcare' },
        { value: 'Finance', label: 'Finance' },
        { value: 'E-commerce', label: 'E-commerce' },
        { value: 'Education', label: 'Education' },
        { value: 'Supply Chain', label: 'Supply Chain' },
        { value: 'Real Estate', label: 'Real Estate' },
        { value: 'Entertainment', label: 'Entertainment' },
        { value: 'Energy', label: 'Energy' },
        { value: 'Manufacturing', label: 'Manufacturing' },
        { value: 'Agriculture', label: 'Agriculture' },
        { value: 'Transportation', label: 'Transportation' },
        { value: 'Hospitality', label: 'Hospitality' },
        { value: 'Other', label: 'Other' },
    ];

    /**
     * Handle form submission
     */
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Reset previous messages
        setSuccessMessage('');

        // Call the API
        const result = await createIdea(ideaText, industry);

        if (result.success) {
            // Show success message
            setSuccessMessage(
                `✅ Idea submitted successfully! Your idea is being analyzed.`
            );

            // Clear form
            setIdeaText('');
            setIndustry('');

            // Auto-hide success message after 5 seconds
            setTimeout(() => {
                setSuccessMessage('');
            }, 5000);
        }
        // Error is handled by the hook and displayed via `error` state
    };

    /**
     * Handle textarea change
     */
    const handleIdeaTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setIdeaText(e.target.value);
    };

    /**
     * Handle industry select change
     */
    const handleIndustryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setIndustry(e.target.value);
    };

    return (
        <div className="idea-submission-form-container">
            <div className="idea-submission-form">
                <h2>Submit Your Startup Idea</h2>
                <p className="form-description">
                    Describe your startup idea and we'll analyze it for you.
                </p>

                <form onSubmit={handleSubmit}>
                    {/* Idea Text Textarea */}
                    <div className="form-group">
                        <label htmlFor="ideaText">Your Idea *</label>
                        <textarea
                            id="ideaText"
                            name="ideaText"
                            placeholder="Describe your startup idea in detail... (minimum 20 characters)"
                            value={ideaText}
                            onChange={handleIdeaTextChange}
                            required
                            minLength={20}
                            maxLength={5000}
                            rows={6}
                            disabled={isLoading}
                            className="textarea-input"
                        />
                        <div className="character-count">
                            {ideaText.length}/5000 characters
                        </div>
                    </div>

                    {/* Industry Select */}
                    <div className="form-group">
                        <label htmlFor="industry">Industry *</label>
                        <select
                            id="industry"
                            name="industry"
                            value={industry}
                            onChange={handleIndustryChange}
                            required
                            disabled={isLoading}
                            className="select-input"
                        >
                            {industries.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="message error-message">
                            <span className="icon">❌</span>
                            <span className="text">{error}</span>
                        </div>
                    )}

                    {/* Success Message */}
                    {successMessage && (
                        <div className="message success-message">
                            <span className="icon">✅</span>
                            <span className="text">{successMessage}</span>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading || !ideaText || !industry}
                        className="submit-button"
                    >
                        {isLoading ? (
                            <>
                                <span className="spinner">⏳</span>
                                <span>Analyzing...</span>
                            </>
                        ) : (
                            <>
                                <span className="icon">🚀</span>
                                <span>Analyze Idea</span>
                            </>
                        )}
                    </button>
                </form>

                <div className="form-note">
                    <p>
                        💡 <strong>Tip:</strong> Be specific about your idea, target market,
                        and unique value proposition for better analysis.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default IdeaSubmissionForm;
