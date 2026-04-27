import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { scoreDistributionData } from "@/lib/mock-data";
import { ChartSkeleton } from "@/components/dashboard/ChartSkeleton";

export function ScoreDistributionChart() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 1000); return () => clearTimeout(t); }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.4 }}
      whileHover={{ y: -1, transition: { duration: 0.2 } }}
      className="rounded-lg border border-border/20 bg-card p-6"
    >
      {!loaded && <ChartSkeleton />}
      <h3 className="text-sm font-semibold text-foreground mb-4">Score Distribution</h3>
      <motion.div className="w-full" style={{ height: 'clamp(250px, 60vw, 400px)' }} initial={{ opacity: 0 }} animate={{ opacity: loaded ? 1 : 0 }} transition={{ duration: 0.3 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={scoreDistributionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.3)" vertical={false} />
            <XAxis dataKey="range" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} width={40} />
            <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border) / 0.2)", borderRadius: "8px", fontSize: "12px" }} />
            <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </motion.div>
  );
}
