import IdeaSubmissionForm from '../components/IdeaSubmissionForm';
import '../components/IdeaSubmissionForm.css';

/**
 * IdeaSubmissionPage
 * 
 * Demo page showing how to use the IdeaSubmissionForm component
 */
export function IdeaSubmissionPage() {
    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', padding: '40px 20px' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                {/* Header Section */}
                <div style={{ textAlign: 'center', marginBottom: '50px', color: 'white' }}>
                    <h1 style={{ fontSize: '36px', marginBottom: '10px', fontWeight: '700' }}>
                        Startup Idea Validator
                    </h1>
                    <p style={{ fontSize: '16px', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '30px' }}>
                        Submit your startup idea and receive AI-powered analysis
                    </p>
                </div>

                {/* Form Component */}
                <IdeaSubmissionForm />

                {/* Info Section */}
                <div style={{ marginTop: '60px', color: 'white' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
                        {/* Card 1 */}
                        <div
                            style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '8px',
                                padding: '24px',
                            }}
                        >
                            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🎯</div>
                            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Smart Analysis</h3>
                            <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
                                Get intelligent feedback on your startup idea's potential and market fit
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div
                            style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '8px',
                                padding: '24px',
                            }}
                        >
                            <div style={{ fontSize: '32px', marginBottom: '12px' }}>⚡</div>
                            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Instant Results</h3>
                            <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
                                Receive analysis instantly after submitting your idea for quick iteration
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div
                            style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '8px',
                                padding: '24px',
                            }}
                        >
                            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔒</div>
                            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Secure & Private</h3>
                            <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
                                Your ideas are securely stored and only accessible to you
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default IdeaSubmissionPage;
