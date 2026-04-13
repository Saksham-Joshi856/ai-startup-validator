import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts";
import { marketOpportunityData } from "@/lib/mock-data";
import { ChartSkeleton } from "@/components/dashboard/ChartSkeleton";

export function MarketOpportunityChart() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 1700); return () => clearTimeout(t); }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="gradient-border-card glass-card p-6 relative overflow-hidden"
    >
      {!loaded && <ChartSkeleton />}
      <h3 className="text-sm font-semibold text-foreground mb-5">Market Opportunity</h3>
      <motion.div className="h-64" initial={{ opacity: 0 }} animate={{ opacity: loaded ? 1 : 0 }} transition={{ duration: 0.5 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={marketOpportunityData}>
            <PolarGrid stroke="hsl(var(--border) / 0.5)" />
            <PolarAngleAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
            <PolarRadiusAxis tick={false} axisLine={false} />
            <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: "12px", boxShadow: "0 8px 32px -8px rgba(0,0,0,0.3)" }} />
            <Radar name="Opportunity" dataKey="opportunity" stroke="hsl(217, 91%, 60%)" fill="hsl(217, 91%, 60%)" fillOpacity={0.15} strokeWidth={2} />
            <Radar name="Growth" dataKey="growth" stroke="hsl(262, 83%, 58%)" fill="hsl(262, 83%, 58%)" fillOpacity={0.1} strokeWidth={2} />
          </RadarChart>
        </ResponsiveContainer>
      </motion.div>
    </motion.div>
  );
}
