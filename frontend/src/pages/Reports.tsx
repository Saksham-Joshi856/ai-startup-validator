import { motion } from "framer-motion";
import { FileText } from "lucide-react";

const Reports = () => {
    return (
        <div className="relative px-6 pt-6 pb-2">
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10"
            >
                <div className="flex items-center gap-3 mb-1">
                    <FileText className="w-6 h-6 text-primary" />
                    <h1 className="text-2xl font-extrabold text-foreground tracking-tight">My Reports</h1>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/20">
                        3 Reports
                    </span>
                </div>
                <p className="text-sm text-muted-foreground">
                    View and manage all your startup validation reports
                </p>
            </motion.div>

            <div className="mt-8 grid gap-4">
                <div className="glass-effect rounded-xl p-6 border border-primary/10">
                    <h3 className="font-semibold text-foreground mb-2">Report coming soon</h3>
                    <p className="text-sm text-muted-foreground">
                        Your validated ideas and detailed analysis reports will appear here
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Reports;
