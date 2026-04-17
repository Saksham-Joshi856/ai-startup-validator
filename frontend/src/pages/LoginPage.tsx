import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { signUp, signIn, signInWithGoogle } from "@/lib/auth"
import { supabase } from "@/lib/supabaseClient"
import { ParticleBackground } from "@/components/dashboard/ParticleBackground"
import { Chrome, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react"

export default function LoginPage() {
    const navigate = useNavigate()
    const [isSignUp, setIsSignUp] = useState(false)
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    // Form fields
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

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
                setTimeout(() => navigate("/"), 1500)
            } else {
                // Sign in
                const { data, error: signInError } = await signIn(email, password)

                if (signInError) {
                    setError("Invalid email or password")
                    setLoading(false)
                    return
                }

                setSuccess("Logged in! Redirecting to dashboard...")
                setTimeout(() => navigate("/"), 1500)
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
        <div className="relative flex items-center justify-center min-h-screen bg-background overflow-hidden">
            <ParticleBackground />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-md px-6"
            >
                {/* Main Card */}
                <div className="relative rounded-2xl border border-primary/20 bg-card/50 backdrop-blur-sm shadow-[0_0_40px_-4px_hsl(var(--glow-primary)/0.2)] overflow-hidden">
                    {/* Animated gradient background */}
                    <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />

                    <div className="p-8">
                        {/* Header */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-center mb-8"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                                className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 mb-4 border border-primary/30"
                            >
                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent" />
                            </motion.div>

                            <h1 className="text-3xl font-bold text-foreground mb-1">
                                {isSignUp ? "Create Account" : "Welcome Back"}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {isSignUp
                                    ? "Join us and start validating your ideas"
                                    : "Sign in to your account"}
                            </p>
                        </motion.div>

                        {/* Error Message */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm"
                                >
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Success Message */}
                        <AnimatePresence>
                            {success && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500 text-sm"
                                >
                                    ✓ {success}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Email/Password Form */}
                        <form onSubmit={handleEmailAuth} className="space-y-4 mb-6">
                            {/* Full Name - Only for Sign Up */}
                            <AnimatePresence mode="wait">
                                {isSignUp && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <label className="block text-sm font-medium text-foreground mb-2">
                                            Full Name
                                        </label>
                                        <Input
                                            type="text"
                                            placeholder="John Doe"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            disabled={loading}
                                            className="bg-background/50 border-primary/20 focus:border-primary/50"
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Email Address
                                </label>
                                <Input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={loading}
                                    className="bg-background/50 border-primary/20 focus:border-primary/50"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder={isSignUp ? "At least 6 characters" : "••••••••"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={loading}
                                        className="bg-background/50 border-primary/20 focus:border-primary/50 pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        disabled={loading}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground disabled:opacity-50"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                                {isSignUp && password && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {isValidPassword(password) ? "✓ Strong password" : "Minimum 6 characters"}
                                    </p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={!isValidForm() || loading}
                                className="w-full mt-6 bg-gradient-to-r from-primary to-accent hover:opacity-90 disabled:opacity-50"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        {isSignUp ? "Creating Account..." : "Signing In..."}
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
                        <div className="relative mb-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-primary/10" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-card/50 text-muted-foreground">OR</span>
                            </div>
                        </div>

                        {/* Google Button */}
                        <Button
                            onClick={handleGoogleSignIn}
                            disabled={loading}
                            variant="outline"
                            className="w-full border-primary/20 hover:bg-primary/5"
                        >
                            <Chrome className="w-4 h-4 mr-2" />
                            Continue with Google
                        </Button>

                        {/* Toggle Sign Up / Sign In */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-center mt-6 text-sm text-muted-foreground"
                        >
                            {isSignUp ? (
                                <>
                                    Already have an account?{" "}
                                    <button
                                        onClick={() => {
                                            setIsSignUp(false)
                                            setError(null)
                                            setSuccess(null)
                                            setFullName("")
                                            setEmail("")
                                            setPassword("")
                                        }}
                                        className="text-primary hover:underline font-medium"
                                    >
                                        Sign in
                                    </button>
                                </>
                            ) : (
                                <>
                                    Don't have an account?{" "}
                                    <button
                                        onClick={() => {
                                            setIsSignUp(true)
                                            setError(null)
                                            setSuccess(null)
                                            setEmail("")
                                            setPassword("")
                                        }}
                                        className="text-primary hover:underline font-medium"
                                    >
                                        Sign up
                                    </button>
                                </>
                            )}
                        </motion.div>
                    </div>
                </div>

                {/* Features Info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-8 grid grid-cols-3 gap-4 text-center text-xs text-muted-foreground"
                >
                    <div>✓ Real-time Validation</div>
                    <div>✓ AI-Powered</div>
                    <div>✓ Instant Results</div>
                </motion.div>
            </motion.div>
        </div>
    )
}
