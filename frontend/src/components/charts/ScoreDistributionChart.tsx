import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { scoreDistributionData } from "@/lib/mock-data";
import { ChartSkeleton } from "@/components/dashboard/ChartSkeleton";

export function ScoreDistributionChart() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 1500); return () => clearTimeout(t); }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="gradient-border-card glass-card p-6 relative overflow-hidden"
    >
      {!loaded && <ChartSkeleton />}
      <h3 className="text-sm font-semibold text-foreground mb-5">Score Distribution</h3>
      <motion.div className="h-64" initial={{ opacity: 0 }} animate={{ opacity: loaded ? 1 : 0 }} transition={{ duration: 0.5 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={scoreDistributionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
            <XAxis dataKey="range" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: "12px", boxShadow: "0 8px 32px -8px rgba(0,0,0,0.3)" }} />
            <Bar dataKey="count" fill="url(#barGradient2)" radius={[6, 6, 0, 0]} />
            <defs>
              <linearGradient id="barGradient2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(217, 91%, 60%)" />
                <stop offset="100%" stopColor="hsl(262, 83%, 58%)" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </motion.div>
  );
}
