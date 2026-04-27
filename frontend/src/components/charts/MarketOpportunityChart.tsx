import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts";
import { marketOpportunityData } from "@/lib/mock-data";
import { ChartSkeleton } from "@/components/dashboard/ChartSkeleton";

export function MarketOpportunityChart() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 1000); return () => clearTimeout(t); }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.4 }}
      whileHover={{ y: -1, transition: { duration: 0.2 } }}
      className="rounded-lg border border-border/20 bg-card p-6"
    >
      {!loaded && <ChartSkeleton />}
      <h3 className="text-sm font-semibold text-foreground mb-4">Market Opportunity</h3>
      <motion.div className="w-full" style={{ height: 'clamp(250px, 60vw, 400px)' }} initial={{ opacity: 0 }} animate={{ opacity: loaded ? 1 : 0 }} transition={{ duration: 0.3 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={marketOpportunityData}>
            <PolarGrid stroke="hsl(var(--border) / 0.3)" />
            <PolarAngleAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
            <PolarRadiusAxis tick={false} axisLine={false} />
            <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border) / 0.2)", borderRadius: "8px", fontSize: "12px" }} />
            <Radar name="Opportunity" dataKey="opportunity" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.15} strokeWidth={2} />
            <Radar name="Growth" dataKey="growth" stroke="hsl(262, 83%, 58%)" fill="hsl(262, 83%, 58%)" fillOpacity={0.1} strokeWidth={2} />
          </RadarChart>
        </ResponsiveContainer>
      </motion.div>
    </motion.div>
  );
}
