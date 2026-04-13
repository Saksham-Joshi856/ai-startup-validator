import { motion } from "framer-motion";
import { FileText } from "lucide-react";

export const ReportsPage = () => {
    const reports = [
        {
            id: 1,
            title: "AI-Powered Startup Validator",
            date: "Apr 13, 2026",
            status: "Completed",
            score: 8.5,
        },
        {
            id: 2,
            title: "Real-Time Analytics Dashboard",
            date: "Apr 12, 2026",
            status: "Completed",
            score: 7.8,
        },
        {
            id: 3,
            title: "Market Intelligence Platform",
            date: "Apr 11, 2026",
            status: "Completed",
            score: 8.2,
        },
    ];

    return (
        <>
            {/* Hero Section */}
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
                            {reports.length} Reports
                        </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        View and manage all your startup validation reports
                    </p>
                </motion.div>
            </div>

            {/* Reports Grid */}
            <div className="px-6 pb-8">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="grid gap-4"
                >
                    {reports.map((report, i) => (
                        <motion.div
                            key={report.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + i * 0.05 }}
                            className="glass-effect rounded-xl p-6 border border-primary/10 hover:border-primary/20 transition-all duration-300 cursor-pointer hover:shadow-lg"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-foreground mb-1">{report.title}</h3>
                                    <p className="text-sm text-muted-foreground">{report.date}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-primary mb-1">{report.score}</div>
                                    <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-green-500/20 text-green-600">
                                        {report.status}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Empty State */}
                {reports.length === 0 && (
                    <div className="glass-effect rounded-xl p-12 border border-primary/10 text-center">
                        <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                        <h3 className="font-semibold text-foreground mb-2">No Reports Yet</h3>
                        <p className="text-sm text-muted-foreground">
                            Create and validate ideas to generate reports
                        </p>
                    </div>
                )}
            </div>
        </>
    );
};

export default ReportsPage;
