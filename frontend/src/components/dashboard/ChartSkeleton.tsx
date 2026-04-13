import { motion } from "framer-motion";

export function ChartSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 1.2, duration: 0.4 }}
      className="absolute inset-0 z-10 p-5 flex flex-col pointer-events-none"
    >
      <div className="h-4 w-32 rounded chart-skeleton mb-6" />
      <div className="flex-1 flex items-end gap-2">
        {[40, 65, 50, 80, 55, 70, 45].map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-t chart-skeleton"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </motion.div>
  );
}
