// /app/appointments/page.tsx - Healthcare Version
"use client";

import useSWR from "swr";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search, Filter, Calendar, Users, Clock,
  MoreVertical, RefreshCw,
  Eye, Trash2, Mail, Phone, AlertCircle,
  CheckCircle, XCircle, CheckCheck, MessageSquare,
  Heart, Stethoscope, Activity
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Appointment = {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number; // Number of patients
  reservationStatus: "pending" | "confirmed" | "cancelled" | "completed";
  notes?: string;
  specialRequests?: string;
  doctor?: string;
  department?: string;
};

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch appointments");
  const data = await res.json();
  return data.appointments || [];
};

export default function AppointmentsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [activeTab, setActiveTab] = useState("all");

  const { data: appointments = [], error, isLoading, mutate: refreshData } = useSWR<Appointment[]>(
    "/api/reservations",
    fetcher,
    { refreshInterval: 10000 } // Refresh every 10 seconds
  );

  // Calculate statistics
  const stats = useMemo(() => {
    const total = appointments.length;
    const pending = appointments.filter((a: Appointment) => a.reservationStatus === "pending").length;
    const confirmed = appointments.filter((a: Appointment) => a.reservationStatus === "confirmed").length;
    const cancelled = appointments.filter((a: Appointment) => a.reservationStatus === "cancelled").length;
    const completed = appointments.filter((a: Appointment) => a.reservationStatus === "completed").length;

    return { total, pending, confirmed, cancelled, completed };
  }, [appointments]);

  const deleteAppointment = async (id: string, name: string) => {
    const confirmed = window.confirm(`Are you sure you want to delete the appointment for ${name}?`);
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/reservations/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        refreshData();
        toast.success("Appointment deleted successfully");
      } else {
        toast.error("Failed to delete appointment");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error deleting appointment");
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      confirmed: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      cancelled: "bg-rose-500/20 text-rose-400 border-rose-500/30",
      completed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      pending: "bg-amber-500/20 text-amber-400 border-amber-500/30"
    };

    const labels: Record<string, string> = {
      confirmed: "Confirmed",
      cancelled: "Cancelled",
      completed: "Completed",
      pending: "Pending"
    };

    return (
      <Badge variant="outline" className={variants[status] || "bg-gray-500/20 text-gray-400 border-gray-500/30"}>
        {labels[status] || status}
      </Badge>
    );
  };

  const formatDate = (isoDate: string) => {
    try {
      return new Date(isoDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return isoDate;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed": return <CheckCircle className="h-4 w-4 text-emerald-400" />;
      case "cancelled": return <XCircle className="h-4 w-4 text-rose-400" />;
      case "completed": return <CheckCheck className="h-4 w-4 text-blue-400" />;
      default: return <Clock className="h-4 w-4 text-amber-400" />;
    }
  };

  const filteredAppointments = useMemo(() => {
    let filtered = appointments.filter((app: Appointment) =>
      [app.name, app.email, app.phone, app.doctor || "", app.department || ""].some((field) =>
        field.toLowerCase().includes(search.toLowerCase())
      )
    );

    // Apply tab filter
    if (activeTab !== "all") {
      filtered = filtered.filter((app: Appointment) => app.reservationStatus === activeTab);
    }

    // Apply additional status filter if needed
    if (statusFilter !== "all" && activeTab === "all") {
      filtered = filtered.filter((app: Appointment) => app.reservationStatus === statusFilter);
    }

    // Sort
    filtered.sort((a: Appointment, b: Appointment) => {
      if (sortBy === "date-asc")
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === "date-desc")
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === "patients-desc")
        return b.guests - a.guests;
      if (sortBy === "patients-asc")
        return a.guests - b.guests;
      return 0;
    });

    return filtered;
  }, [appointments, search, activeTab, statusFilter, sortBy]);

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setSortBy("date-desc");
    setActiveTab("all");
  };

  const refreshAppointments = () => {
    refreshData();
    toast.info("Refreshing appointments...");
  };

  const handleRetry = () => {
    refreshData();
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <Heart className="h-6 w-6 text-blue-400" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Appointment Management
                </h1>
              </div>
              <p className="text-blue-200/60 text-sm">Manage patient appointments and scheduling</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-200/60">Total</p>
                  <p className="text-2xl font-bold text-white">{stats.total}</p>
                </div>
                <div className="p-2 rounded-lg bg-white/5">
                  <Calendar className="h-5 w-5 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-200/60">Pending</p>
                  <p className="text-2xl font-bold text-white">{stats.pending}</p>
                </div>
                <div className="p-2 rounded-lg bg-amber-500/20">
                  <Clock className="h-5 w-5 text-amber-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-200/60">Confirmed</p>
                  <p className="text-2xl font-bold text-white">{stats.confirmed}</p>
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
                  <p className="text-sm text-blue-200/60">Cancelled</p>
                  <p className="text-2xl font-bold text-white">{stats.cancelled}</p>
                </div>
                <div className="p-2 rounded-lg bg-rose-500/20">
                  <XCircle className="h-5 w-5 text-rose-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-200/60">Completed</p>
                  <p className="text-2xl font-bold text-white">{stats.completed}</p>
                </div>
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <CheckCheck className="h-5 w-5 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-xl text-blue-200 font-bold">Appointment Management</CardTitle>
                <CardDescription className="text-blue-200/60">
                  View and manage all patient appointments
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Tabs & Filters */}
            <div className="mb-6 space-y-4">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-5 bg-white/5">
                  <TabsTrigger value="all" className="text-blue-200 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                    All ({stats.total})
                  </TabsTrigger>
                  <TabsTrigger value="pending" className="text-blue-200 data-[state=active]:bg-amber-500 data-[state=active]:text-white">
                    Pending ({stats.pending})
                  </TabsTrigger>
                  <TabsTrigger value="confirmed" className="text-blue-200 data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
                    Confirmed ({stats.confirmed})
                  </TabsTrigger>
                  <TabsTrigger value="cancelled" className="text-blue-200 data-[state=active]:bg-rose-500 data-[state=active]:text-white">
                    Cancelled ({stats.cancelled})
                  </TabsTrigger>
                  <TabsTrigger value="completed" className="text-blue-200 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                    Completed ({stats.completed})
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-400/60" />
                  <Input
                    placeholder="Search patients, doctors, departments..."
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
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10">
                    <SelectItem value="date-desc">Newest First</SelectItem>
                    <SelectItem value="date-asc">Oldest First</SelectItem>
                    <SelectItem value="patients-desc">Most Patients</SelectItem>
                    <SelectItem value="patients-asc">Fewest Patients</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm text-blue-200/60">
                  Showing {filteredAppointments.length} of {appointments.length} appointments
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-blue-200 hover:text-white hover:bg-white/5"
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
                <p className="text-blue-200/60 mb-2">Failed to load appointments</p>
                <Button
                  variant="outline"
                  onClick={handleRetry}
                  className="border-white/10 text-blue-200 hover:text-white hover:bg-white/5"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              </div>
            ) : filteredAppointments.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="h-8 w-8 text-blue-400/50" />
                </div>
                <p className="text-blue-200/60 mb-2">No appointments found</p>
                <p className="text-sm text-blue-200/40 mb-4">
                  {search ? "Try adjusting your search or filters" : "No appointments have been scheduled yet"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-white/10">
                <Table>
                  <TableHeader className="bg-white/5">
                    <TableRow className="border-white/10 hover:bg-transparent">
                      <TableHead className="text-blue-200 font-semibold">Patient</TableHead>
                      <TableHead className="text-blue-200 font-semibold">Contact</TableHead>
                      <TableHead className="text-blue-200 font-semibold">Date & Time</TableHead>
                      <TableHead className="text-blue-200 font-semibold">Patients</TableHead>
                      <TableHead className="text-blue-200 font-semibold">Doctor/Dept</TableHead>
                      <TableHead className="text-blue-200 font-semibold">Status</TableHead>
                      <TableHead className="text-blue-200 font-semibold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAppointments.map((app: Appointment) => (
                      <TableRow
                        key={app.id}
                        className="border-white/10 hover:bg-white/5 cursor-pointer"
                        onClick={() => router.push(`/appointments/${app.id}`)}
                      >
                        <TableCell>
                          <div className="font-medium text-white">{app.name}</div>
                          {app.specialRequests && (
                            <div className="text-xs text-blue-200/40 truncate max-w-[200px]">
                              <MessageSquare className="h-3 w-3 inline mr-1" />
                              Special request
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-sm text-blue-200/80">
                              <Mail className="h-3 w-3" />
                              <span className="truncate max-w-[150px]">{app.email}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-blue-200/60">
                              <Phone className="h-3 w-3" />
                              <span>{app.phone}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-white">
                              <Calendar className="h-4 w-4 text-blue-400" />
                              <span>{formatDate(app.date)}</span>
                            </div>
                            <div className="flex items-center gap-1 text-blue-200/60 text-sm">
                              <Clock className="h-3 w-3" />
                              <span>{app.time}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-blue-400" />
                            <span className="font-semibold text-white">{app.guests}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {app.doctor && (
                              <div className="flex items-center gap-1 text-sm text-white">
                                <Stethoscope className="h-3 w-3 text-blue-400" />
                                <span>{app.doctor}</span>
                              </div>
                            )}
                            {app.department && (
                              <div className="flex items-center gap-1 text-xs text-blue-200/60">
                                <Activity className="h-3 w-3" />
                                <span>{app.department}</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(app.reservationStatus)}
                            {getStatusBadge(app.reservationStatus)}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/appointments/${app.id}`);
                              }}
                              className="h-8 px-2 text-blue-200 hover:text-white hover:bg-white/5"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={(e) => e.stopPropagation()}
                                  className="h-8 px-2 text-blue-200 hover:text-white hover:bg-white/5"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                className="bg-slate-900 border-white/10 text-white w-48"
                                align="end"
                              >
                                <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-white/10" />
                                <DropdownMenuItem onClick={() => window.location.href = `mailto:${app.email}`}>
                                  <Mail className="h-4 w-4 mr-2" />
                                  Send Email
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => window.location.href = `tel:${app.phone}`}>
                                  <Phone className="h-4 w-4 mr-2" />
                                  Call Patient
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-white/10" />
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteAppointment(app.id, app.name);
                                  }}
                                  className="text-rose-400"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t border-white/10 pt-6">
            <div className="flex items-center justify-between w-full">
              <p className="text-sm text-blue-200/60">
                Auto-refreshes every 10 seconds • Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={refreshAppointments}
                className="text-blue-200 border border-white/10 hover:text-white hover:bg-white/5"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Now
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}