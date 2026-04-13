import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { topIndustries } from "@/lib/mock-data";

export function InsightsPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="glass-card p-5"
    >
      <h3 className="text-sm font-semibold text-foreground mb-4">Top Performing Industries</h3>
      <div className="space-y-3">
        {topIndustries.map((item, i) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 + i * 0.08 }}
            className="flex items-center gap-3"
          >
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-foreground">{item.name}</span>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                  <TrendingUp className="w-3 h-3" />
                  {item.growth}
                </div>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.score}%` }}
                  transition={{ delay: 0.8 + i * 0.08, duration: 0.8, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                />
              </div>
            </div>
            <span className="text-xs font-mono text-muted-foreground w-8 text-right">{item.score}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
