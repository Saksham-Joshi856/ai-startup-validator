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
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 sm:p-6">
            <ParticleBackground />

            <div className="w-full max-w-md sm:max-w-lg relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6 sm:space-y-8"
                >
                    {/* Header */}
                    <div className="text-center space-y-1 sm:space-y-2">
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.1 }}
                            className="mb-3"
                        >
                            <div className="inline-block bg-gradient-to-br from-primary to-accent p-3 rounded-xl">
                                <span className="text-xl sm:text-2xl">✨</span>
                            </div>
                        </motion.div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                            {isSignUp ? "Create Account" : "Welcome Back"}
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-400 px-2">
                            {isSignUp
                                ? "Join us to validate your startup ideas with AI"
                                : "Sign in to your account to continue"}
                        </p>
                    </div>

                    {/* Form Card */}
                    <div className="rounded-xl sm:rounded-2xl border border-slate-700/50 bg-slate-800/40 backdrop-blur-lg p-4 sm:p-6 lg:p-8 space-y-4 shadow-2xl">
                        {/* Error Alert */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    className="p-3 sm:p-4 rounded-lg bg-red-500/15 border border-red-500/40 text-red-300 text-xs sm:text-sm"
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
                                    className="p-3 sm:p-4 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm"
                                >
                                    {success}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={handleEmailAuth} className="space-y-3 sm:space-y-4">
                            {/* Full Name - Sign Up Only */}
                            {isSignUp && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <label className="text-xs sm:text-sm font-medium text-slate-200 mb-2 block">
                                        Full Name
                                    </label>
                                    <Input
                                        type="text"
                                        placeholder="John Doe"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        disabled={loading}
                                        className="bg-slate-900/50 border-slate-700/50 text-white placeholder:text-slate-500 h-10 sm:h-11 text-sm"
                                    />
                                </motion.div>
                            )}

                            {/* Email */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 }}
                            >
                                <label className="text-xs sm:text-sm font-medium text-slate-200 mb-2 block">
                                    Email Address
                                </label>
                                <Input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={loading}
                                    className="bg-slate-900/50 border-slate-700/50 text-white placeholder:text-slate-500 h-10 sm:h-11 text-sm"
                                />
                            </motion.div>

                            {/* Password */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <label className="text-xs sm:text-sm font-medium text-slate-200 mb-2 block">
                                    Password
                                </label>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder={isSignUp ? "At least 6 characters" : "Enter your password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={loading}
                                        className="bg-slate-900/50 border-slate-700/50 text-white placeholder:text-slate-500 pr-10 h-10 sm:h-11 text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </motion.div>

                            {/* Submit Button */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.25 }}
                                className="pt-2"
                            >
                                <Button
                                    type="submit"
                                    disabled={loading || !isValidForm()}
                                    className="w-full mt-4 sm:mt-6 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white font-semibold h-11 sm:h-12 text-sm sm:text-base transition-all duration-300 hover:shadow-lg"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            <span>{isSignUp ? "Creating..." : "Signing in..."}</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>{isSignUp ? "Create Account" : "Sign In"}</span>
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </>
                                    )}
                                </Button>
                            </motion.div>
                        </form>

                        {/* Divider */}
                        <div className="relative my-4 sm:my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-700/30" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-slate-800/40 px-2 text-slate-500 font-medium">Or continue with</span>
                            </div>
                        </div>

                        {/* Google Sign In */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Button
                                type="button"
                                onClick={handleGoogleSignIn}
                                disabled={loading}
                                className="w-full border-slate-700/50 bg-slate-900/50 hover:bg-slate-900/80 text-slate-200 hover:text-white h-10 sm:h-11 text-sm sm:text-base transition-all duration-300"
                                variant="outline"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Connecting...
                                    </>
                                ) : (
                                    <>
                                        <Chrome className="w-4 h-4 mr-2" />
                                        Google
                                    </>
                                )}
                            </Button>
                        </motion.div>
                    </div>

                    {/* Toggle Sign Up / Sign In */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.35 }}
                        className="text-center text-xs sm:text-sm"
                    >
                        <span className="text-slate-400">
                            {isSignUp ? "Already have an account? " : "Don't have an account? "}
                        </span>
                        <button
                            type="button"
                            onClick={() => {
                                setIsSignUp(!isSignUp)
                                setError(null)
                                setSuccess(null)
                            }}
                            className="text-primary hover:text-accent hover:underline font-semibold transition-colors"
                        >
                            {isSignUp ? "Sign In" : "Sign Up"}
                        </button>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}
