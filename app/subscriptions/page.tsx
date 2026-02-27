// /app/subscriptions/page.tsx
"use client";

import useSWR from "swr";
import { useState, useMemo } from "react";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Mail, Trash2, Search, Users, Download,
  Calendar, Filter, CheckCircle, AlertCircle, Copy,
  ChevronLeft, ChevronRight, RefreshCw,
  Heart, Activity
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Patient = {
  _id: string;
  email: string;
  createdAt: string;
  status?: "active" | "unsubscribed" | "bounced";
  source?: string;
  lastEngagement?: string;
  preferences?: string[];
  healthInterests?: string[];
};

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch patients");
  const data = await res.json();
  return data || [];
};

export default function SubscriptionsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 20;

  const { data: patients = [], error, isLoading, mutate: refreshData } = useSWR<Patient[]>(
    "/api/subscriptions",
    fetcher,
    { refreshInterval: 10000 }
  );

  // Calculate statistics
  const stats = useMemo(() => {
    const total = patients.length;
    const active = patients.filter(p => !p.status || p.status === "active").length;
    const unsubscribed = patients.filter(p => p.status === "unsubscribed").length;
    const bounced = patients.filter(p => p.status === "bounced").length;
    const today = patients.filter(p => {
      const date = new Date(p.createdAt);
      const now = new Date();
      return date.toDateString() === now.toDateString();
    }).length;

    return { total, active, unsubscribed, bounced, today };
  }, [patients]);

  const filteredPatients = useMemo(() => {
    let filtered = patients.filter((patient: Patient) =>
      patient.email.toLowerCase().includes(search.toLowerCase())
    );

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((patient: Patient) => {
        if (statusFilter === "active") return !patient.status || patient.status === "active";
        return patient.status === statusFilter;
      });
    }

    // Sort
    filtered.sort((a: Patient, b: Patient) => {
      if (sortBy === "newest")
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === "oldest")
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortBy === "email-asc")
        return a.email.localeCompare(b.email);
      if (sortBy === "email-desc")
        return b.email.localeCompare(a.email);
      return 0;
    });

    return filtered;
  }, [patients, search, statusFilter, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);
  const paginatedPatients = filteredPatients.slice(
    (currentPage - 1) * patientsPerPage,
    currentPage * patientsPerPage
  );

  const handleDelete = async (id: string, email: string) => {
    if (!confirm(`Are you sure you want to remove ${email} from the patient list?`)) return;

    try {
      const res = await fetch("/api/subscriptions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error("Failed to delete patient");

      refreshData();
      toast.success("Patient removed successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete patient");
    }
  };

  const exportToCSV = () => {
    const headers = ["Email", "Joined Date", "Status", "Source", "Health Interests"];
    const csvData = filteredPatients.map((patient: Patient) => [
      patient.email,
      new Date(patient.createdAt).toISOString().split('T')[0],
      patient.status || "active",
      patient.source || "website",
      patient.healthInterests?.join('; ') || ''
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row: string[]) => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `patients-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast.success("Patient data exported to CSV");
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setSortBy("newest");
    setCurrentPage(1);
  };

  const refreshPatients = () => {
    refreshData();
    toast.info("Refreshing patient list...");
  };

  const copyToClipboard = (email: string) => {
    navigator.clipboard.writeText(email);
    toast.success("Email copied to clipboard");
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  const getStatusBadge = (status?: string) => {
    const variants: Record<string, string> = {
      active: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      unsubscribed: "bg-rose-500/20 text-rose-400 border-rose-500/30",
      bounced: "bg-amber-500/20 text-amber-400 border-amber-500/30"
    };

    const labels: Record<string, string> = {
      active: "Active",
      unsubscribed: "Unsubscribed",
      bounced: "Bounced"
    };

    const statusKey = status || "active";

    return (
      <Badge variant="outline" className={variants[statusKey] || "bg-gray-500/20 text-gray-400"}>
        {labels[statusKey] || "Active"}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-cyan-500/20">
                <Heart className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Patient Management
                </h1>
                <p className="text-blue-200/60 text-sm">Manage your patient database and communications</p>
              </div>
            </div>
            <Badge variant="outline" className="border-blue-500/30 text-blue-300 bg-blue-500/10">
              <Users className="h-3 w-3 mr-1" />
              {stats.total.toLocaleString()} patients
            </Badge>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-200/60">Total Patients</p>
                  <p className="text-2xl font-bold text-white">{stats.total}</p>
                </div>
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <Users className="h-5 w-5 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-200/60">Active</p>
                  <p className="text-2xl font-bold text-emerald-400">{stats.active}</p>
                </div>
                <div className="p-2 rounded-lg bg-emerald-500/20">
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-200/60">Unsubscribed</p>
                  <p className="text-2xl font-bold text-rose-400">{stats.unsubscribed}</p>
                </div>
                <div className="p-2 rounded-lg bg-rose-500/20">
                  <AlertCircle className="h-5 w-5 text-rose-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-200/60">Bounced</p>
                  <p className="text-2xl font-bold text-amber-400">{stats.bounced}</p>
                </div>
                <div className="p-2 rounded-lg bg-amber-500/20">
                  <Activity className="h-5 w-5 text-amber-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-200/60">Today</p>
                  <p className="text-2xl font-bold text-purple-400">{stats.today}</p>
                </div>
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <Calendar className="h-5 w-5 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-xl text-blue-200 font-bold">Patient Directory</CardTitle>
                <CardDescription className="text-blue-200/60">
                  View and manage your patient communications list
                </CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  onClick={exportToCSV}
                  className="border-0 bg-white/5 text-blue-200 hover:text-white hover:bg-white/10"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={refreshPatients}
                  className="border-0 bg-white/5 text-blue-200 hover:text-white"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="mb-6 space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-400/60" />
                  <Input
                    placeholder="Search patients by email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-blue-200/40"
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-blue-400" />
                      <SelectValue placeholder="Filter by status" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
                    <SelectItem value="bounced">Bounced</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10">
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="email-asc">Email A-Z</SelectItem>
                    <SelectItem value="email-desc">Email Z-A</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm text-blue-200/60">
                  Showing {paginatedPatients.length} of {filteredPatients.length} patients
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-blue-200 hover:text-white"
                >
                  Clear Filters
                </Button>
              </div>
            </div>

            {/* Loading & Error States */}
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 bg-white/5 rounded-lg" />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-rose-400" />
                <p className="text-blue-200/60 mb-2">Failed to load patients</p>
                <Button
                  variant="outline"
                  onClick={() => refreshData()}
                  className="border-white/10 text-blue-200 hover:text-white hover:bg-white/5"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              </div>
            ) : filteredPatients.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-blue-400/50" />
                </div>
                <p className="text-blue-200/60 mb-2">No patients found</p>
                <p className="text-sm text-blue-200/40 mb-4">
                  {search ? "Try adjusting your search or filters" : "No patients in database yet"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-white/10">
                <Table>
                  <TableHeader className="bg-white/5">
                    <TableRow className="border-white/10 hover:bg-transparent">
                      <TableHead className="text-blue-200 font-semibold w-12">#</TableHead>
                      <TableHead className="text-blue-200 font-semibold">Patient Email</TableHead>
                      <TableHead className="text-blue-200 font-semibold">Joined</TableHead>
                      <TableHead className="text-blue-200 font-semibold">Status</TableHead>
                      <TableHead className="text-blue-200 font-semibold">Source</TableHead>
                      <TableHead className="text-blue-200 font-semibold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedPatients.map((patient: Patient, index: number) => (
                      <TableRow key={patient._id} className="border-white/10 hover:bg-white/5">
                        <TableCell className="text-blue-200/60">
                          {(currentPage - 1) * patientsPerPage + index + 1}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-blue-500/20">
                              <Mail className="h-4 w-4 text-blue-400" />
                            </div>
                            <div>
                              <p className="font-medium text-white">{patient.email}</p>
                              {patient.lastEngagement && (
                                <p className="text-xs text-blue-200/40">
                                  Last engaged: {new Date(patient.lastEngagement).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-blue-400/60" />
                            <span className="text-blue-200">{formatDate(patient.createdAt)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(patient.status)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-white/10 text-blue-200 bg-white/5">
                            {patient.source || "Website"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(patient.email)}
                              className="h-8 px-2 text-blue-200 hover:text-white hover:bg-white/5"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => window.location.href = `mailto:${patient.email}`}
                              className="h-8 px-2 text-blue-200 hover:text-white hover:bg-white/5"
                            >
                              <Mail className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(patient._id, patient.email)}
                              className="h-8 px-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
          {totalPages > 1 && (
            <CardFooter className="border-t border-white/10 pt-6">
              <div className="flex items-center justify-between w-full">
                <p className="text-sm text-blue-200/60">
                  Page {currentPage} of {totalPages} • {filteredPatients.length} patients
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => p - 1)}
                    className="border-white/10 text-blue-200 hover:text-white hover:bg-white/5"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="px-3 py-1 text-sm bg-white/5 rounded-md text-blue-200">
                    {currentPage}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => p + 1)}
                    className="border-white/10 text-blue-200 hover:text-white hover:bg-white/5"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}