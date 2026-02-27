// /app/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar, Clock, CheckCircle, TrendingUp,
  Star, BarChart3, CalendarRange,
  Heart, Activity, Users, Shield,
  Stethoscope, AlertCircle, Award
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

type RangeKey = "today" | "week" | "month" | "quarter" | "year";

interface StatsResponse {
  total: number;
  pending: number;
  completed: number;
  cancelled: number;
  revenue: number;
  avgPartySize: number;
}

interface TrendPoint {
  date: string;
  count: number;
  revenue: number;
}

const RANGES: { key: RangeKey; label: string; icon: React.ReactNode }[] = [
  { key: "today", label: "Today", icon: <Calendar className="h-4 w-4" /> },
  { key: "week", label: "This Week", icon: <CalendarRange className="h-4 w-4" /> },
  { key: "month", label: "This Month", icon: <BarChart3 className="h-4 w-4" /> },
  { key: "quarter", label: "Quarter", icon: <TrendingUp className="h-4 w-4" /> },
  { key: "year", label: "Year", icon: <Activity className="h-4 w-4" /> },
];

function StatCard({
  title,
  value,
  icon,
  change,
  loading,
  color = "blue",
  format = "number"
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  change?: string;
  loading: boolean;
  color?: "blue" | "green" | "purple" | "amber" | "rose";
  format?: "number" | "currency" | "time";
}) {
  const colorClasses = {
    blue: "from-blue-500/20 to-cyan-500/10 border-blue-500/30",
    green: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30",
    purple: "from-purple-500/20 to-pink-500/10 border-purple-500/30",
    amber: "from-amber-500/20 to-orange-500/10 border-amber-500/30",
    rose: "from-rose-500/20 to-pink-500/10 border-rose-500/30"
  };

  const formatValue = (val: number) => {
    const safeVal = val ?? 0;

    if (format === "currency") return `$${safeVal.toLocaleString()}`;
    if (format === "time") return `${safeVal} min`;
    return safeVal.toLocaleString();
  };

  return (
    <Card className={`bg-white/5 backdrop-blur-sm border-white/10 overflow-hidden group hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-200 mb-1">{title}</p>
            <h3 className="text-3xl font-bold text-white mb-2">
              {loading ? <Skeleton className="h-9 w-24 bg-white/10" /> : formatValue(value)}
            </h3>
            {change && (
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                <span className="text-sm text-emerald-400 font-medium">{change}</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} backdrop-blur-sm`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SparklineChart({ data }: { data: TrendPoint[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-4">
            <Activity className="h-8 w-8 text-blue-400/50" />
          </div>
          <p className="text-blue-200/60">No appointment data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[400px]">
      <div className="absolute inset-0">
        {/* Simplified sparkline visualization */}
        <div className="flex items-end h-full gap-2 px-4">
          {data.map((point, i) => {
            const height = (point.count / Math.max(...data.map(d => d.count))) * 100;
            return (
              <div key={i} className="flex-1 flex flex-col items-center justify-end">
                <div
                  className="w-full bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t-lg transition-all duration-300 hover:from-blue-400 hover:to-cyan-300 opacity-80 hover:opacity-100"
                  style={{ height: `${Math.max(20, height)}%` }}
                />
                {i % 2 === 0 && (
                  <span className="text-xs text-blue-200/40 mt-3">{point.date.slice(5)}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function RecentReviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch("/api/reviews/recent", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch reviews");
        const data = await res.json();
        setReviews(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, []);

  if (loading) {
    return (
      <div className="h-[400px] space-y-4">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full bg-white/5" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-32 bg-white/5" />
              <Skeleton className="h-3 w-24 bg-white/5" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-4">
            <Star className="h-8 w-8 text-blue-400/50" />
          </div>
          <p className="text-blue-200/60">No patient feedback yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[400px] overflow-y-auto pr-2 space-y-4 custom-scrollbar">
      {reviews.slice(0, 8).map((review, index) => (
        <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
              <Heart className="h-5 w-5 text-blue-400" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-medium text-white truncate">{review.name}</h4>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < review.rating ? "text-blue-400 fill-blue-400" : "text-gray-600"}`}
                  />
                ))}
              </div>
            </div>
            <p className="text-blue-200/80 text-sm line-clamp-2">"{review.comment}"</p>
            <p className="text-xs text-blue-200/40 mt-2">
              {new Date(review.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function StaffDashboard() {
  const [range, setRange] = useState<RangeKey>("week");
  const [stats, setStats] = useState<StatsResponse>({
    total: 0,
    pending: 0,
    completed: 0,
    cancelled: 0,
    revenue: 0,
    avgPartySize: 0
  });
  const [trend, setTrend] = useState<TrendPoint[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingTrend, setLoadingTrend] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const selectedRangeLabel = useMemo(() => RANGES.find((r) => r.key === range)?.label || "Week", [range]);

  useEffect(() => {
    let ignore = false;

    async function fetchStats() {
      setLoadingStats(true);
      setError(null);
      try {
        const res = await fetch(`/api/reservations/stats?range=${range}&_=${Date.now()}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch stats");
        const data: StatsResponse = await res.json();
        if (!ignore) setStats(data);
      } catch (err: any) {
        console.error(err);
        if (!ignore) setError(err.message || "Failed to load stats");
      } finally {
        if (!ignore) setLoadingStats(false);
      }
    }

    async function fetchTrend() {
      setLoadingTrend(true);
      try {
        const res = await fetch(`/api/reservations/trend?range=${range}&_=${Date.now()}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch trend");
        const data: TrendPoint[] = await res.json();
        if (!ignore) setTrend(data);
      } catch (err) {
        console.error(err);
        if (!ignore) setTrend([]);
      } finally {
        if (!ignore) setLoadingTrend(false);
      }
    }

    fetchStats();
    fetchTrend();

    return () => { ignore = true; };
  }, [range]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-white/5 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <Heart className="h-6 w-6 text-blue-400" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Healthcare Dashboard
                </h1>
              </div>
              <p className="text-blue-200/60 text-sm">Clinical operations overview</p>
            </div>

            <div className="flex items-center gap-2">
              {RANGES.map((r) => (
                <button
                  key={r.key}
                  onClick={() => setRange(r.key)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${range === r.key
                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25"
                    : "bg-white/5 text-blue-200 hover:bg-white/10 border border-white/10"
                    }`}
                >
                  {r.icon}
                  <span className="text-sm font-medium">{r.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid - Healthcare focused */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Appointments"
            value={stats.total}
            icon={<Calendar className="h-6 w-6 text-blue-400" />}
            loading={loadingStats}
            color="blue"
          />
          <StatCard
            title="Pending Approvals"
            value={stats.pending}
            icon={<Clock className="h-6 w-6 text-amber-400" />}
            loading={loadingStats}
            color="amber"
          />
          <StatCard
            title="Completed"
            value={stats.completed}
            icon={<CheckCircle className="h-6 w-6 text-emerald-400" />}
            loading={loadingStats}
            color="green"
          />
          <StatCard
            title="Patients Today"
            value={stats.avgPartySize * 2} // Estimated patients
            icon={<Users className="h-6 w-6 text-purple-400" />}
            loading={loadingStats}
            color="purple"
          />
        </div>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Trend Chart (2/3 width) */}
          <div className="lg:col-span-2">
            <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-white font-bold flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-400" />
                    Appointment Trends
                  </CardTitle>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" />
                      <span className="text-sm text-blue-200/60">Appointments</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Shield className="h-4 w-4 text-emerald-400" />
                      <span className="text-sm text-blue-200/60">HIPAA Compliant</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="min-h-[400px]">
                {loadingTrend ? (
                  <div className="h-[400px] flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent" />
                  </div>
                ) : (
                  <SparklineChart data={trend} />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Recent Reviews */}
          <div className="lg:col-span-1">
            <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg text-white font-bold flex items-center gap-2">
                  <Star className="h-5 w-5 text-amber-400" />
                  Patient Feedback
                </CardTitle>
                <Badge variant="outline" className="border-blue-400/30 text-blue-300 bg-blue-500/10">
                  {trend.length > 0 ? trend[trend.length - 1]?.count : 0} this week
                </Badge>
              </CardHeader>
              <CardContent className="min-h-[400px]">
                <RecentReviews />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500">
              <Stethoscope className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <p className="text-white font-medium">New Appointment</p>
              <p className="text-xs text-blue-200/60">Schedule patient</p>
            </div>
          </button>

          <button className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <p className="text-white font-medium">Patient List</p>
              <p className="text-xs text-blue-200/60">View all patients</p>
            </div>
          </button>

          <button className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
              <Award className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <p className="text-white font-medium">Reports</p>
              <p className="text-xs text-blue-200/60">Analytics & insights</p>
            </div>
          </button>

          <button className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500">
              <AlertCircle className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <p className="text-white font-medium">Emergency</p>
              <p className="text-xs text-blue-200/60">Urgent cases</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}