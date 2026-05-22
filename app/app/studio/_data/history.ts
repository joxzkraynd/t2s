export interface HistoryData {
  id: number
  title: string
  timestamp: string
}

export const mockHistoryData: HistoryData[] = [
  { id: 1, title: "Alpha", timestamp: "2026-05-23T11:58:00Z" }, // ~minutes ago
  { id: 2, title: "Beta", timestamp: "2026-05-23T11:45:00Z" },  // ~15 mins ago
  { id: 3, title: "Gamma", timestamp: "2026-05-23T10:30:00Z" }, // ~1.5 hours ago
  { id: 4, title: "Delta", timestamp: "2026-05-23T08:15:00Z" }, // ~4 hours ago
  { id: 5, title: "Epsilon", timestamp: "2026-05-22T15:20:00Z" },// ~1 day ago
  { id: 6, title: "Zeta", timestamp: "2026-05-21T09:00:00Z" },   // ~2 days ago
  { id: 7, title: "Eta", timestamp: "2026-05-20T14:30:00Z" },    // ~3 days ago
  { id: 8, title: "Theta", timestamp: "2026-05-18T10:00:00Z" },  // ~5 days ago
  { id: 9, title: "Iota", timestamp: "2026-05-16T08:40:00Z" },   // ~1 week ago
  { id: 10, title: "Kappa", timestamp: "2026-05-10T16:45:00Z" }, // ~2 weeks ago
  { id: 11, title: "Lambda", timestamp: "2026-05-01T10:50:00Z" },// ~3 weeks ago
  { id: 12, title: "Mu", timestamp: "2026-04-20T09:15:00Z" },    // ~1 month ago
  { id: 13, title: "Nu", timestamp: "2026-04-10T11:00:00Z" },    // ~1.5 months ago
  { id: 14, title: "Xi", timestamp: "2026-03-15T14:05:00Z" },    // ~2 months ago
  { id: 15, title: "Omicron", timestamp: "2026-02-28T09:10:00Z" },// ~3 months ago
  { id: 16, title: "Pi", timestamp: "2026-01-10T11:15:00Z" },    // ~4 months ago
  { id: 17, title: "Rho", timestamp: "2025-12-05T15:20:00Z" },   // ~5 months ago
  { id: 18, title: "Sigma", timestamp: "2025-11-20T11:25:00Z" }, // ~6 months ago
  { id: 19, title: "Tau", timestamp: "2025-09-15T14:30:00Z" },   // ~8 months ago
  { id: 20, title: "Upsilon", timestamp: "2025-07-10T09:35:00Z" },// ~10 months ago
  { id: 21, title: "Phi", timestamp: "2025-05-23T11:40:00Z" },   // ~1 year ago
  { id: 22, title: "Chi", timestamp: "2024-10-15T10:45:00Z" },   // > 1 year ago
  { id: 23, title: "Psi", timestamp: "2024-05-23T11:50:00Z" },   // ~2 years ago
  { id: 24, title: "Omega", timestamp: "2023-01-01T08:55:00Z" }, // > 3 years ago
]
