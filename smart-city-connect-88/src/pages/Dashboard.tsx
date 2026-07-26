import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  FileText,
  Zap,
  Droplets,
  Trash2,
  Wifi,
  TreePine,
  Shield,
} from "lucide-react";

import { useEffect, useState } from "react";

const API_BASE = "http://localhost:8080/api";

const statusStyle: Record<string, string> = {
  "In Progress": "text-accent bg-accent/10 border-accent",
  "Under Review": "text-primary bg-primary/10 border-primary",
  "Resolved": "text-status-green bg-status-green/10 border-status-green",
  "Submitted": "text-status-yellow bg-status-yellow/10 border-status-yellow",
};

const priorityStyle: Record<string, string> = {
  low: "text-status-green",
  medium: "text-accent",
  high: "text-destructive",
};

export default function Dashboard() {

  const [stats, setStats] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [recentComplaints, setRecentComplaints] = useState<any[]>([]);
  const [responseStats, setResponseStats] = useState<any>({});
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const res = await fetch(`${API_BASE}/complaints/dashboard`);

      if (!res.ok) throw new Error("Failed to fetch dashboard");

      const data = await res.json();

      setStats(data.stats || []);
      setCategoryData(data.categoryData || []);
      setRecentComplaints(data.recentComplaints || []);

      setResponseStats(data.responseStats || {});

    } catch (err) {
      console.error("Dashboard Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchDashboard();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const maxCount = Math.max(...categoryData.map((c: any) => c.count || 0), 1);

  return (
    <main className="min-h-screen pt-24 pb-16 bg-background">
      <div className="container mx-auto px-4">

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin h-6 w-6" />
          </div>
        ) : (
          <>
            <div className="mb-10">
              <h1 className="text-4xl font-bold mb-2">
                City <span className="text-gradient-cyan">Dashboard</span>
              </h1>
              <p className="text-muted-foreground">
                Overview of all complaints and their resolution status across the city.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {stats.map(({ label, value, change, icon, color }: any) => {
                const Icon = iconMap[icon] || FileText;
                return (
                  <div key={label} className="card-surface rounded-xl p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`h-10 w-10 rounded-lg bg-secondary flex items-center justify-center ${color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-black text-foreground">{value ?? 0}</div>
                    <div className="text-xs text-muted-foreground mt-1">{label}</div>
                    <div className={`text-xs mt-2 ${color}`}>{change ?? ""}</div>
                  </div>
                );
              })}
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">

              {/* Category */}
              <div className="card-surface rounded-xl p-6">
                <div className="flex items-center gap-2 mb-6">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <h2 className="font-semibold">Complaints by Category</h2>
                </div>

                <div className="flex flex-col gap-4">
                  {categoryData.map((c: any) => {
                    const Icon = iconMap[c.icon] || FileText;

                    return (
                      <div key={c.category}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2 text-sm">
                            <div className={`h-6 w-6 rounded flex items-center justify-center ${c.color}/20`}>
                              <Icon className="h-3.5 w-3.5 text-foreground" />
                            </div>
                            <span className="text-foreground">{c.category}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {(c.resolved ?? 0)}/{(c.count ?? 0)}
                          </div>
                        </div>

                        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${c.color}`}
                            style={{ width: `${(c.count / maxCount) * 100}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="card-surface rounded-xl p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Clock className="h-5 w-5 text-primary" />
                  <h2 className="font-semibold">Response Time Stats</h2>
                </div>

                <div className="flex flex-col gap-4">
                  {[
                    { label: "Resolved within 24hrs", value: responseStats.within24 || 0, color: "bg-status-green" },
                    { label: "Resolved within 3 days", value: responseStats.within3d || 0, color: "bg-primary" },
                    { label: "Resolved within 7 days", value: responseStats.within7d || 0, color: "bg-accent" },
                    { label: "Still pending", value: responseStats.pending || 0, color: "bg-status-red" },
                  ].map(({ label, value, color }) => (
                    <div key={label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">{label}</span>
                        <span className="font-medium text-foreground">{value}%</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-border grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-black text-gradient-cyan">
                      {responseStats.avgDays || "—"}
                    </div>
                    <div className="text-xs text-muted-foreground">Avg. Days to Resolve</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-black text-gradient-amber">
                      {responseStats.avgHours || "—"}
                    </div>
                    <div className="text-xs text-muted-foreground">Avg. First Response</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="card-surface rounded-xl overflow-hidden">
              <div className="p-5 border-b border-border">
                <h2 className="font-semibold">Recent Complaints</h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-secondary/30">
                      {["ID", "Subject", "Category", "Status", "Priority", "Date"].map((h) => (
                        <th key={h} className="text-left text-xs font-semibold px-5 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {recentComplaints.map((row: any, i: number) => (
                      <tr key={row.id} className={`border-b ${i % 2 ? "bg-secondary/10" : ""}`}>
                        <td className="px-5 py-3 text-sm font-mono text-primary">{row.id}</td>
                        <td className="px-5 py-3 text-sm">{row.subject}</td>
                        <td className="px-5 py-3 text-sm">{row.category}</td>
                        <td className="px-5 py-3">
                          <span className={`px-2 py-1 text-xs rounded ${statusStyle[row.status]}`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <span className={`text-xs ${priorityStyle[row.priority]}`}>
                            {row.priority}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-sm">{row.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </>
        )}
      </div>
    </main>
  );
}

const iconMap: any = {
  FileText,
  CheckCircle2,
  Loader2,
  AlertTriangle,
  Zap,
  Droplets,
  Trash2,
  Wifi,
  TreePine,
  Shield,
};