import { lazy, Suspense } from "react"
import { ChartSkeleton } from "@/components/dashboard/ChartSkeleton"

// Lazy load the chart component only when needed
const MarketOpportunityChart = lazy(() =>
    import("./MarketOpportunityChart").then(module => ({
        default: module.MarketOpportunityChart
    }))
)

export function LazyMarketOpportunityChart() {
    return (
        <Suspense fallback={<ChartSkeleton />}>
            <MarketOpportunityChart />
        </Suspense>
    )
}
