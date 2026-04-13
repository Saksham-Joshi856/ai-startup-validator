import { motion } from "framer-motion";
import { Plus, Sparkles } from "lucide-react";

export function FloatingActionButton() {
  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.5, type: "spring", stiffness: 300, damping: 20 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold text-sm shadow-[0_8px_30px_-4px_hsl(var(--glow-primary)/0.5)] hover:shadow-[0_8px_40px_-2px_hsl(var(--glow-primary)/0.6)] transition-shadow duration-300"
    >
      <Plus className="w-4 h-4" />
      <span>Validate New Idea</span>
      <Sparkles className="w-3.5 h-3.5 opacity-70" />
    </motion.button>
  );
}
