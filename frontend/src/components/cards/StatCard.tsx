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
    const duration = 1000;
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      whileHover={{
        y: -2,
        transition: { duration: 0.2 },
      }}
      className="rounded-lg border border-border/20 bg-card p-6 hover:bg-card/80 transition-colors duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <span
          className={`text-xs font-semibold px-2 py-1 rounded-md ${positive
              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
              : "bg-red-500/15 text-red-600 dark:text-red-400"
            }`}
        >
          {change}
        </span>
      </div>

      <p className="text-2xl font-bold text-foreground mb-1">
        <AnimatedNumber value={value} suffix={suffix} />
      </p>
      <p className="text-xs text-muted-foreground font-medium">{label}</p>
    </motion.div>
  );
}
