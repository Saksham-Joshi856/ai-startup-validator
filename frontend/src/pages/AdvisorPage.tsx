import { motion } from "framer-motion";
import { Bot, Send, Loader2, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useAIAdvisor } from "@/hooks/useApiCalls";

export const AdvisorPage = () => {
    const { user } = useAuth();
    const { sendMessage, loading, error } = useAIAdvisor();
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hello! I'm your AI Advisor. I can help you analyze startup ideas, market opportunities, and provide personalized recommendations. What would you like to discuss?",
            sender: "ai",
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState("");

    const handleSendMessage = async () => {
        if (!input.trim() || !user?.id) return;

        console.log('📤 [AdvisorPage] Sending message...');

        // Add user message
        const userMessage = {
            id: messages.length + 1,
            text: input,
            sender: "user" as const,
            timestamp: new Date(),
        };
        setMessages([...messages, userMessage]);
        const userInput = input;
        setInput("");

        // Get AI response
        const aiResponse = await sendMessage(user.id, userInput);
        if (aiResponse) {
            console.log('📥 [AdvisorPage] Received AI response');
            const aiMessage = {
                id: messages.length + 2,
                text: aiResponse,
                sender: "ai" as const,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, aiMessage]);
        } else {
            console.warn('⚠️  [AdvisorPage] No response from AI');
            // Optionally show error message in chat
            if (error) {
                const errorMessage = {
                    id: messages.length + 2,
                    text: error || "AI is unavailable, try again",
                    sender: "ai" as const,
                    timestamp: new Date(),
                };
                setMessages((prev) => [...prev, errorMessage]);
            }
        }
    };

    return (
        <>
            {/* Hero Section */}
            <div className="relative px-6 pt-6 pb-2">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="relative z-10"
                >
                    <div className="flex items-center gap-3 mb-1">
                        <Bot className="w-6 h-6 text-primary" />
                        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">AI Advisor</h1>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/20 ai-badge-glow">
                            AI Powered
                        </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Get personalized AI-powered advice for your startup ideas
                    </p>
                </motion.div>
            </div>

            {/* Chat Container */}
            <div className="px-6 pb-8 h-[calc(100%-120px)] flex flex-col">
                <div className="flex-1 mb-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1, duration: 0.5 }}
                        className="glass-effect rounded-xl border border-accent/10 p-4 h-full flex flex-col"
                    >
                        {/* Error Banner */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-2"
                            >
                                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                                <p className="text-sm text-red-500">{error}</p>
                            </motion.div>
                        )}

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                            {messages.map((msg, i) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.05 * i }}
                                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.sender === "user"
                                            ? "bg-primary/20 text-primary rounded-br-none"
                                            : "bg-accent/20 text-accent rounded-bl-none"
                                            }`}
                                    >
                                        <p className="text-sm">{msg.text}</p>
                                        <span className="text-xs opacity-70 mt-1 block">
                                            {msg.timestamp.toLocaleTimeString()}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-accent/20 text-accent px-4 py-2 rounded-lg rounded-bl-none flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span className="text-sm">AI is thinking...</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Ask AI Advisor anything..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                                disabled={loading}
                                className="flex-1 px-4 py-2 rounded-lg bg-muted/30 border border-border/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={loading}
                                className="px-4 py-2 rounded-lg bg-accent/20 text-accent hover:bg-accent/30 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.5 }}
                    className="flex gap-2 flex-wrap"
                >
                    {[
                        "Analyze my tech startup idea",
                        "Market trends in SaaS",
                        "Funding strategies",
                        "Competitor analysis",
                    ].map((action, i) => (
                        <button
                            key={i}
                            onClick={() => setInput(action)}
                            disabled={loading}
                            className="px-3 py-1.5 text-xs rounded-lg border border-border/50 text-muted-foreground hover:border-accent/50 hover:text-accent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {action}
                        </button>
                    ))}
                </motion.div>
            </div>
        </>
    );
};

export default AdvisorPage;
