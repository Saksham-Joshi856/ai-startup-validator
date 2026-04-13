import { motion } from "framer-motion";
import { recentValidations } from "@/lib/mock-data";

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 85 ? "text-emerald-400 bg-emerald-500/10" : score >= 70 ? "text-amber-400 bg-amber-500/10" : "text-red-400 bg-red-500/10";
  return <span className={`text-xs font-mono font-semibold px-2 py-0.5 rounded-full ${color}`}>{score}</span>;
}

function IndustryTag({ industry }: { industry: string }) {
  return (
    <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
      {industry}
    </span>
  );
}

export function RecentValidations() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="glass-card p-5"
    >
      <h3 className="text-sm font-semibold text-foreground mb-4">Recent Idea Validations</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50">
              <th className="text-left text-xs text-muted-foreground font-medium pb-3">Idea</th>
              <th className="text-left text-xs text-muted-foreground font-medium pb-3">Score</th>
              <th className="text-left text-xs text-muted-foreground font-medium pb-3">Industry</th>
              <th className="text-left text-xs text-muted-foreground font-medium pb-3">Status</th>
              <th className="text-right text-xs text-muted-foreground font-medium pb-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {recentValidations.map((item, i) => (
              <motion.tr
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.05 }}
                className="border-b border-border/30 last:border-0 hover:bg-muted/30 transition-colors"
              >
                <td className="py-3 font-medium text-foreground">{item.name}</td>
                <td className="py-3"><ScoreBadge score={item.score} /></td>
                <td className="py-3"><IndustryTag industry={item.industry} /></td>
                <td className="py-3 text-muted-foreground text-xs">{item.status}</td>
                <td className="py-3 text-right text-muted-foreground text-xs font-mono">{item.date}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
