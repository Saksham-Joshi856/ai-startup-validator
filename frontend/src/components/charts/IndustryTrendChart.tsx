import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { industryTrendData } from "@/lib/mock-data";
import { ChartSkeleton } from "@/components/dashboard/ChartSkeleton";

export function IndustryTrendChart() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 1300); return () => clearTimeout(t); }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="gradient-border-card glass-card p-6 relative overflow-hidden"
    >
      {!loaded && <ChartSkeleton />}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold text-foreground">Industry Trends</h3>
        <div className="flex gap-3">
          {[{ label: "AI", color: "bg-primary" }, { label: "Health", color: "bg-emerald-400" }, { label: "Fin", color: "bg-amber-400" }, { label: "Green", color: "bg-accent" }].map((l) => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${l.color}`} />
              <span className="text-[10px] text-muted-foreground font-medium">{l.label}</span>
            </div>
          ))}
        </div>
      </div>
      <motion.div className="h-64" initial={{ opacity: 0 }} animate={{ opacity: loaded ? 1 : 0 }} transition={{ duration: 0.5 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={industryTrendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
            <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: "12px", boxShadow: "0 8px 32px -8px rgba(0,0,0,0.3)" }} />
            <Line type="monotone" dataKey="AI" stroke="hsl(217, 91%, 60%)" strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="HealthTech" stroke="hsl(142, 71%, 45%)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="FinTech" stroke="hsl(38, 92%, 50%)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="GreenTech" stroke="hsl(262, 83%, 58%)" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </motion.div>
  );
}
