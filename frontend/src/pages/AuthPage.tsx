import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { signUp, signIn, signInWithGoogle } from "@/lib/auth"
import { ParticleBackground } from "@/components/dashboard/ParticleBackground"
import { Chrome, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react"

export default function AuthPage() {
    const [isSignUp, setIsSignUp] = useState(false)
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    // Form fields
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    // Log that AuthPage is active
    console.log("AUTH PAGE ACTIVE")

    // Validation
    const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    const isValidPassword = (password: string) => password.length >= 6
    const isValidForm = () => {
        if (isSignUp) {
            return fullName.trim() && isValidEmail(email) && isValidPassword(password)
        }
        return isValidEmail(email) && password.length > 0
    }

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setSuccess(null)

        if (!isValidForm()) {
            if (!isValidEmail(email)) {
                setError("Please enter a valid email address")
            } else if (!isValidPassword(password)) {
                setError("Password must be at least 6 characters")
            } else if (isSignUp && !fullName.trim()) {
                setError("Please enter your full name")
            }
            return
        }

        setLoading(true)

        try {
            if (isSignUp) {
                // Sign up
                const { data, error: signUpError } = await signUp(email, password, fullName)

                if (signUpError) {
                    if (signUpError.message?.includes("already registered")) {
                        setError("This email is already registered. Try signing in instead.")
                    } else {
                        setError(signUpError.message || "Failed to create account")
                    }
                    setLoading(false)
                    return
                }

                setSuccess("Account created! Redirecting to dashboard...")
                setTimeout(() => window.location.href = "/", 1500)
            } else {
                // Sign in
                const { data, error: signInError } = await signIn(email, password)

                if (signInError) {
                    setError("Invalid email or password")
                    setLoading(false)
                    return
                }

                setSuccess("Logged in! Redirecting to dashboard...")
                setTimeout(() => window.location.href = "/", 1500)
            }
        } catch (err) {
            setError("An unexpected error occurred. Please try again.")
            setLoading(false)
        }
    }

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
            setError("Failed to sign in with Google")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <ParticleBackground />

            <div className="w-full max-w-md relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-8"
                >
                    {/* Header */}
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold text-foreground">
                            {isSignUp ? "Create Account" : "Welcome Back"}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {isSignUp
                                ? "Join us to validate your startup ideas"
                                : "Sign in to your account to continue"}
                        </p>
                    </div>

                    {/* Form Card */}
                    <div className="rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm p-6 space-y-4">
                        {/* Error Alert */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    className="p-3 rounded-md bg-destructive/10 border border-destructive/30 text-destructive text-sm"
                                >
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Success Alert */}
                        <AnimatePresence>
                            {success && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    className="p-3 rounded-md bg-green-500/10 border border-green-500/30 text-green-600 text-sm"
                                >
                                    {success}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={handleEmailAuth} className="space-y-3">
                            {/* Full Name - Sign Up Only */}
                            {isSignUp && (
                                <div>
                                    <label className="text-sm font-medium text-foreground mb-1.5 block">
                                        Full Name
                                    </label>
                                    <Input
                                        type="text"
                                        placeholder="John Doe"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        disabled={loading}
                                        className="bg-background/50 border-border/50"
                                    />
                                </div>
                            )}

                            {/* Email */}
                            <div>
                                <label className="text-sm font-medium text-foreground mb-1.5 block">
                                    Email Address
                                </label>
                                <Input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={loading}
                                    className="bg-background/50 border-border/50"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="text-sm font-medium text-foreground mb-1.5 block">
                                    Password
                                </label>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder={isSignUp ? "At least 6 characters" : "Enter your password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={loading}
                                        className="bg-background/50 border-border/50 pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={loading || !isValidForm()}
                                className="w-full mt-6 bg-primary hover:bg-primary/90"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        {isSignUp ? "Creating account..." : "Signing in..."}
                                    </>
                                ) : (
                                    <>
                                        {isSignUp ? "Create Account" : "Sign In"}
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </>
                                )}
                            </Button>
                        </form>

                        {/* Divider */}
                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-border/30" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card/50 px-2 text-muted-foreground">Or</span>
                            </div>
                        </div>

                        {/* Google Sign In */}
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleGoogleSignIn}
                            disabled={loading}
                            className="w-full border-border/50 bg-background/50"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Connecting...
                                </>
                            ) : (
                                <>
                                    <Chrome className="w-4 h-4 mr-2" />
                                    Continue with Google
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Toggle Sign Up / Sign In */}
                    <div className="text-center text-sm">
                        <span className="text-muted-foreground">
                            {isSignUp ? "Already have an account? " : "Don't have an account? "}
                        </span>
                        <button
                            type="button"
                            onClick={() => {
                                setIsSignUp(!isSignUp)
                                setError(null)
                                setSuccess(null)
                            }}
                            className="text-primary hover:underline font-medium"
                        >
                            {isSignUp ? "Sign In" : "Sign Up"}
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
