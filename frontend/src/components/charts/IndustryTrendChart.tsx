import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { industryTrendData } from "@/lib/mock-data";
import { ChartSkeleton } from "@/components/dashboard/ChartSkeleton";

export function IndustryTrendChart() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 1000); return () => clearTimeout(t); }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      whileHover={{ y: -1, transition: { duration: 0.2 } }}
      className="rounded-lg border border-border/20 bg-card p-6"
    >
      {!loaded && <ChartSkeleton />}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Industry Trends</h3>
        <div className="flex gap-2">
          {[{ label: "AI", color: "bg-primary" }, { label: "Health", color: "bg-emerald-500" }, { label: "Fin", color: "bg-amber-500" }, { label: "Green", color: "bg-purple-500" }].map((l) => (
            <div key={l.label} className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${l.color}`} />
              <span className="text-[11px] text-muted-foreground font-medium hidden sm:inline">{l.label}</span>
            </div>
          ))}
        </div>
      </div>
      <motion.div className="w-full" style={{ height: 'clamp(250px, 60vw, 400px)' }} initial={{ opacity: 0 }} animate={{ opacity: loaded ? 1 : 0 }} transition={{ duration: 0.3 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={industryTrendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.3)" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} width={40} />
            <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border) / 0.2)", borderRadius: "8px", fontSize: "12px" }} />
            <Line type="monotone" dataKey="AI" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="HealthTech" stroke="hsl(142, 71%, 45%)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="FinTech" stroke="hsl(38, 92%, 50%)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="GreenTech" stroke="hsl(262, 83%, 58%)" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </motion.div>
  );
}
