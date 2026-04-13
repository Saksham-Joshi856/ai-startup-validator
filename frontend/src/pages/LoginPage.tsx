import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { signInWithGoogle } from "@/lib/auth"
import { debugOAuthSetup } from "@/lib/debugOAuth"
import { ParticleBackground } from "@/components/dashboard/ParticleBackground"
import { Chrome, Bug } from "lucide-react"

export default function LoginPage() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [debugging, setDebugging] = useState(false)

    const handleGoogleSignIn = async () => {
        try {
            setLoading(true)
            setError(null)
            const { error } = await signInWithGoogle()
            if (error) {
                setError(error.message)
                console.error("Google sign in error:", error)
            }
        } catch (err) {
            setError("An unexpected error occurred")
            console.error("Sign in exception:", err)
        } finally {
            setLoading(false)
        }
    }

    const handleDebug = async () => {
        setDebugging(true)
        await debugOAuthSetup()
        setDebugging(false)
    }

    return (
        <div className="relative flex items-center justify-center min-h-screen bg-background overflow-hidden">
            <ParticleBackground />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-md px-6"
            >
                {/* Gradient border card */}
                <div className="relative p-8 rounded-2xl border border-primary/20 bg-card/50 backdrop-blur-sm shadow-[0_0_40px_-4px_hsl(var(--glow-primary)/0.2)]">
                    {/* Animated gradient background */}
                    <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Header */}
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 mb-4 border border-primary/30"
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent" />
                        </motion.div>

                        <h1 className="text-3xl font-bold text-foreground mb-2">
                            Welcome to AI Hub
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Validate your startup ideas with AI-powered insights
                        </p>
                    </div>

                    {/* Features list */}
                    <div className="space-y-3 mb-8">
                        {[
                            "Real-time startup validation",
                            "Market opportunity analysis",
                            "AI-powered recommendations"
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + i * 0.1 }}
                                className="flex items-center gap-3"
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                <span className="text-sm text-foreground/80">{feature}</span>
                            </motion.div>
                        ))}
                    </div>

                    {/* Error message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm"
                        >
                            {error}
                        </motion.div>
                    )}

                    {/* Google Sign In Button */}
                    <motion.button
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                        className="relative w-full h-12 rounded-lg font-semibold text-sm transition-all duration-200 overflow-hidden group"
                    >
                        {/* Button background gradient */}
                        <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-100 group-hover:opacity-90 transition-opacity" />

                        {/* Content */}
                        <div className="relative h-full flex items-center justify-center gap-2 text-primary-foreground">
                            <Chrome className="w-5 h-5" />
                            {loading ? "Signing in..." : "Continue with Google"}
                        </div>

                        {/* Shimmer effect */}
                        <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-20 transition-opacity">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer" />
                        </div>
                    </motion.button>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border/50" />
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="px-2 bg-card text-muted-foreground">or continue as guest</span>
                        </div>
                    </div>

                    {/* Guest access note */}
                    <p className="text-xs text-center text-muted-foreground leading-relaxed">
                        By signing in, you agree to our{" "}
                        <a href="#" className="text-primary hover:underline">
                            Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="#" className="text-primary hover:underline">
                            Privacy Policy
                        </a>
                    </p>

                    {/* Debug Button - Hidden but accessible */}
                    <button
                        onClick={handleDebug}
                        disabled={debugging}
                        className="absolute bottom-4 right-4 text-xs px-2 py-1 rounded bg-muted/50 text-muted-foreground hover:bg-muted transition-colors flex items-center gap-1"
                        title="Open browser console (F12) to see debug output"
                    >
                        <Bug className="w-3 h-3" />
                        {debugging ? "Checking..." : "Debug"}
                    </button>
                </div>

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 text-center"
                >
                    <p className="text-xs text-muted-foreground">
                        Powered by{" "}
                        <span className="font-semibold text-foreground">OpenRouter AI</span>
                    </p>
                </motion.div>
            </motion.div>
        </div>
    )
}
