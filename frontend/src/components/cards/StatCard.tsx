import { motion } from "framer-motion";
import { Lightbulb, TrendingUp, Flame, CheckCircle, type LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";

const iconMap: Record<string, LucideIcon> = { Lightbulb, TrendingUp, Flame, CheckCircle };

interface StatCardProps {
  label: string;
  value: number;
  change: string;
  positive: boolean;
  icon: string;
  suffix?: string;
  index: number;
}

function AnimatedNumber({ value, suffix }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const duration = 1400;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setDisplay(eased * value);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value]);

  const formatted = value % 1 !== 0 ? display.toFixed(1) : Math.round(display).toLocaleString();
  return <span>{formatted}{suffix || ""}</span>;
}

export function StatCard({ label, value, change, positive, icon, suffix, index }: StatCardProps) {
  const Icon = iconMap[icon] || Lightbulb;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.1 + 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{
        y: -6,
        scale: 1.02,
        transition: { duration: 0.25, ease: "easeOut" },
      }}
      className="gradient-border-card glass-card-glow p-6 cursor-default group"
      style={{ perspective: "800px" }}
    >
      <motion.div
        whileHover={{ rotateX: 2, rotateY: -2 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:from-primary/30 group-hover:to-accent/30 transition-all duration-300">
            <Icon className="w-5 h-5 text-primary" />
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary ai-badge-glow" />
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm ${
            positive
              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
              : "bg-red-500/15 text-red-400 border border-red-500/20"
          }`}>
            {change}
          </span>
        </div>
        <p className="text-3xl font-extrabold text-foreground tracking-tight leading-none">
          <AnimatedNumber value={value} suffix={suffix} />
        </p>
        <p className="text-xs text-muted-foreground mt-2 font-medium tracking-wide uppercase">{label}</p>
      </motion.div>
    </motion.div>
  );
}
