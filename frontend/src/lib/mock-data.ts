export const statsData = [
  { label: "Total Ideas Analyzed", value: 2847, change: "+12.5%", positive: true, icon: "Lightbulb" as const },
  { label: "Average Startup Score", value: 78.3, change: "+3.2%", positive: true, icon: "TrendingUp" as const, suffix: "/100" },
  { label: "Trending Industries", value: 24, change: "+5", positive: true, icon: "Flame" as const },
  { label: "Validation Success Rate", value: 84.7, change: "+2.1%", positive: true, icon: "CheckCircle" as const, suffix: "%" },
];

export const recentValidations = [
  { id: 1, name: "AI-Powered Legal Assistant", score: 92, industry: "LegalTech", status: "High Potential", date: "2024-01-15" },
  { id: 2, name: "Sustainable Packaging Marketplace", score: 78, industry: "GreenTech", status: "Promising", date: "2024-01-14" },
  { id: 3, name: "Remote Team Culture Platform", score: 85, industry: "HR Tech", status: "High Potential", date: "2024-01-13" },
  { id: 4, name: "Personalized Nutrition AI", score: 71, industry: "HealthTech", status: "Promising", date: "2024-01-12" },
  { id: 5, name: "Decentralized Identity Verifier", score: 63, industry: "Web3", status: "Moderate", date: "2024-01-11" },
  { id: 6, name: "AI Content Moderation Tool", score: 88, industry: "AI/ML", status: "High Potential", date: "2024-01-10" },
];

export const industryTrendData = [
  { month: "Jul", AI: 85, HealthTech: 65, FinTech: 72, GreenTech: 58 },
  { month: "Aug", AI: 88, HealthTech: 68, FinTech: 70, GreenTech: 62 },
  { month: "Sep", AI: 92, HealthTech: 72, FinTech: 75, GreenTech: 65 },
  { month: "Oct", AI: 90, HealthTech: 75, FinTech: 78, GreenTech: 70 },
  { month: "Nov", AI: 95, HealthTech: 78, FinTech: 74, GreenTech: 73 },
  { month: "Dec", AI: 98, HealthTech: 82, FinTech: 80, GreenTech: 78 },
];

export const scoreDistributionData = [
  { range: "0-20", count: 12 },
  { range: "21-40", count: 28 },
  { range: "41-60", count: 45 },
  { range: "61-80", count: 78 },
  { range: "81-100", count: 52 },
];

export const marketOpportunityData = [
  { name: "AI/ML", opportunity: 95, competition: 78, growth: 92 },
  { name: "HealthTech", opportunity: 82, competition: 65, growth: 88 },
  { name: "FinTech", opportunity: 75, competition: 85, growth: 70 },
  { name: "GreenTech", opportunity: 88, competition: 45, growth: 95 },
  { name: "EdTech", opportunity: 70, competition: 55, growth: 75 },
  { name: "Web3", opportunity: 60, competition: 72, growth: 50 },
];

export const topIndustries = [
  { name: "AI/ML", score: 95, growth: "+18%" },
  { name: "GreenTech", score: 88, growth: "+24%" },
  { name: "HealthTech", score: 82, growth: "+15%" },
  { name: "FinTech", score: 75, growth: "+8%" },
  { name: "EdTech", score: 70, growth: "+12%" },
];
