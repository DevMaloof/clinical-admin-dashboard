// app/staff/StaffClient.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Users, UserPlus, ChevronRight, Search, Filter,
    Mail, Phone, MoreVertical, Loader2, Shield,
    Heart, Stethoscope, Activity, Award, Clock,
    AlertCircle, CheckCircle, XCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

type Employee = {
    id: string;
    name: string;
    role: string;
    image?: string;
    email?: string;
    phone?: string;
    status?: "active" | "inactive" | "pending" | "on-leave";
    specialty?: string;
    licenseNumber?: string;
};

type Role = {
    key: string;
    label: string;
    color: string;
    count?: number;
};

export default function StaffClient() {
    const [employeesByRole, setEmployeesByRole] = useState<Record<string, Employee[]>>({});
    const [roles, setRoles] = useState<Role[]>([]);
    const [selectedRole, setSelectedRole] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const roleColors: Record<string, string> = {
        director: "from-blue-600 to-cyan-600",
        physician: "from-emerald-600 to-teal-600",
        nurse: "from-amber-600 to-orange-600",
        specialist: "from-purple-600 to-pink-600",
        technician: "from-indigo-600 to-blue-500",
        admin: "from-gray-600 to-slate-600",
        other: "from-gray-600 to-slate-600",
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [metaRes, staffRes] = await Promise.all([
                    fetch("/api/staff/meta"),
                    fetch("/api/staff")
                ]);

                if (!metaRes.ok || !staffRes.ok) throw new Error("Failed to fetch data");

                const meta = await metaRes.json();
                const staffData: Record<string, Employee[]> = await staffRes.json();

                // Enhance roles with counts and colors
                const enhancedRoles: Role[] = [
                    { key: "all", label: "All Clinical Staff", color: "from-gray-600 to-slate-600" },
                    ...(meta.roles || []).map((role: Role) => ({
                        ...role,
                        color: roleColors[role.key] || "from-gray-600 to-slate-600",
                        count: (staffData[role.key] || []).length
                    }))
                ];

                setRoles(enhancedRoles);
                setEmployeesByRole(staffData);

            } catch (err) {
                console.error(err);
                toast.error("Failed to load staff data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getRoleLabel = (key: string) =>
        roles.find((r) => r.key === key)?.label || key;

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
            case 'on-leave': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
            case 'inactive': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
            case 'pending': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'active': return <CheckCircle className="h-3 w-3" />;
            case 'on-leave': return <Clock className="h-3 w-3" />;
            case 'inactive': return <XCircle className="h-3 w-3" />;
            case 'pending': return <AlertCircle className="h-3 w-3" />;
            default: return null;
        }
    };

    const filteredEmployees = selectedRole === "all"
        ? Object.values(employeesByRole).flat()
        : (employeesByRole[selectedRole] || []);

    const searchedEmployees = filteredEmployees.filter(emp =>
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.specialty?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalEmployees = Object.values(employeesByRole).reduce((sum, arr) => sum + arr.length, 0);

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
                                    Clinical Staff Management
                                </h1>
                                <p className="text-blue-200/60 text-sm">Manage your healthcare team and practitioners</p>
                            </div>
                        </div>
                        <Badge variant="outline" className="border-blue-500/30 text-blue-300 bg-blue-500/10">
                            <Users className="h-3 w-3 mr-1" />
                            {totalEmployees} team members
                        </Badge>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-blue-200/60">Total Clinical Staff</p>
                                    <p className="text-3xl font-bold text-white">{totalEmployees}</p>
                                </div>
                                <div className="p-3 rounded-lg bg-blue-500/20">
                                    <Users className="h-6 w-6 text-blue-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-blue-200/60">On Duty Today</p>
                                    <p className="text-3xl font-bold text-white">
                                        {filteredEmployees.filter(e => e.status === 'active').length}
                                    </p>
                                </div>
                                <div className="p-3 rounded-lg bg-emerald-500/20">
                                    <Activity className="h-6 w-6 text-emerald-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-blue-200/60">Specialties</p>
                                    <p className="text-3xl font-bold text-white">{roles.length - 1}</p>
                                </div>
                                <div className="p-3 rounded-lg bg-purple-500/20">
                                    <Stethoscope className="h-6 w-6 text-purple-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-blue-200/60">On Leave</p>
                                    <p className="text-3xl font-bold text-white">
                                        {filteredEmployees.filter(e => e.status === 'on-leave').length}
                                    </p>
                                </div>
                                <div className="p-3 rounded-lg bg-amber-500/20">
                                    <Clock className="h-6 w-6 text-amber-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Left Column - Roles & Search */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-lg text-blue-200 font-semibold">Medical Roles</CardTitle>
                                <CardDescription className="text-blue-200/60">
                                    Filter by clinical specialty
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {loading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <Skeleton key={i} className="h-12 bg-white/5 rounded-lg mb-2" />
                                    ))
                                ) : (
                                    roles.map((role) => {
                                        const isActive = role.key === selectedRole;
                                        return (
                                            <button
                                                key={role.key}
                                                onClick={() => setSelectedRole(role.key)}
                                                className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${isActive
                                                        ? `bg-gradient-to-r ${role.color} text-white shadow-lg`
                                                        : "bg-white/5 hover:bg-white/10 text-blue-200"
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-white' : 'bg-blue-400/40'
                                                        }`} />
                                                    <span className="font-medium">{role.label}</span>
                                                </div>
                                                {role.key !== "all" && (
                                                    <Badge variant={isActive ? "secondary" : "outline"}
                                                        className={isActive ? "bg-white/20" : "border-white/10 text-blue-200"}>
                                                        {role.count || 0}
                                                    </Badge>
                                                )}
                                            </button>
                                        );
                                    })
                                )}
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-lg text-blue-200 font-semibold">Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button
                                    onClick={() => router.push("/staff/invite")}
                                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                                >
                                    <UserPlus className="h-4 w-4 mr-2" />
                                    Invite New Staff
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="w-full border-0 bg-white/5 text-blue-200 hover:text-white hover:bg-white/10"
                                    onClick={() => window.print()}
                                >
                                    Export Directory
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Staff List */}
                    <div className="lg:col-span-3">
                        <Card className="border-white/10 bg-white/5 backdrop-blur-sm h-full">
                            <CardHeader>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <CardTitle className="text-xl text-blue-200 font-bold">
                                            {selectedRole === "all" ? "All Clinical Staff" : getRoleLabel(selectedRole)}
                                        </CardTitle>
                                        <CardDescription className="text-blue-200/60">
                                            {searchedEmployees.length} of {filteredEmployees.length} staff members
                                        </CardDescription>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="relative flex-1 sm:flex-none sm:w-64">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-400/60" />
                                            <Input
                                                placeholder="Search staff..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-blue-200/40"
                                            />
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-blue-200 hover:text-white hover:bg-white/5"
                                        >
                                            <Filter className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {loading ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {Array.from({ length: 6 }).map((_, i) => (
                                            <Skeleton key={i} className="h-64 bg-white/5 rounded-xl" />
                                        ))}
                                    </div>
                                ) : searchedEmployees.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-4">
                                            <Users className="h-8 w-8 text-blue-400/50" />
                                        </div>
                                        <p className="text-blue-200/60 mb-2">No staff members found</p>
                                        <p className="text-sm text-blue-200/40 mb-4">
                                            {searchQuery ? "Try a different search term" : "Invite new staff to get started"}
                                        </p>
                                        <Button
                                            onClick={() => router.push("/staff/invite")}
                                            className="bg-gradient-to-r from-blue-500 to-cyan-500"
                                        >
                                            <UserPlus className="h-4 w-4 mr-2" />
                                            Invite First Staff
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {searchedEmployees.map((emp) => {
                                            const roleColor = roleColors[emp.role] || "from-gray-600 to-slate-600";
                                            return (
                                                <div
                                                    key={emp.id}
                                                    onClick={() => router.push(`/staff/${emp.id}`)}
                                                    className="group bg-white/5 border border-white/10 rounded-xl p-4 cursor-pointer hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300"
                                                >
                                                    <div className="flex items-start justify-between mb-4">
                                                        <Avatar className="h-16 w-16 border-2 border-blue-500/30">
                                                            <AvatarImage src={emp.image} />
                                                            <AvatarFallback className={`bg-gradient-to-r ${roleColor} text-white`}>
                                                                {getInitials(emp.name)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                // Handle menu
                                                            }}
                                                            className="p-2 text-blue-200 hover:text-white hover:bg-white/5 rounded-lg"
                                                        >
                                                            <MoreVertical className="h-5 w-5" />
                                                        </button>
                                                    </div>

                                                    <h3 className="font-bold text-white text-lg mb-1">{emp.name}</h3>
                                                    <div className="flex flex-wrap items-center gap-2 mb-3">
                                                        <Badge className={`bg-gradient-to-r ${roleColor} border-0 text-white`}>
                                                            {getRoleLabel(emp.role)}
                                                        </Badge>
                                                        {emp.specialty && (
                                                            <Badge variant="outline" className="border-blue-500/30 text-blue-300">
                                                                {emp.specialty}
                                                            </Badge>
                                                        )}
                                                    </div>

                                                    {emp.status && (
                                                        <div className="mb-3">
                                                            <Badge variant="outline" className={getStatusColor(emp.status)}>
                                                                <span className="flex items-center gap-1">
                                                                    {getStatusIcon(emp.status)}
                                                                    {emp.status === 'on-leave' ? 'On Leave' :
                                                                        emp.status === 'active' ? 'Active' :
                                                                            emp.status === 'pending' ? 'Pending' : 'Inactive'}
                                                                </span>
                                                            </Badge>
                                                        </div>
                                                    )}

                                                    <div className="space-y-2">
                                                        {emp.email && (
                                                            <div className="flex items-center gap-2 text-sm text-blue-200/60">
                                                                <Mail className="h-4 w-4" />
                                                                <span className="truncate">{emp.email}</span>
                                                            </div>
                                                        )}
                                                        {emp.phone && (
                                                            <div className="flex items-center gap-2 text-sm text-blue-200/60">
                                                                <Phone className="h-4 w-4" />
                                                                <span>{emp.phone}</span>
                                                            </div>
                                                        )}
                                                        {emp.licenseNumber && (
                                                            <div className="flex items-center gap-2 text-sm text-blue-200/40">
                                                                <Shield className="h-3 w-3" />
                                                                <span>License: {emp.licenseNumber}</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                                                        <span className="text-sm text-blue-200/40">View Profile</span>
                                                        <ChevronRight className="h-4 w-4 text-blue-200/40 group-hover:text-white group-hover:translate-x-1 transition-transform" />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter className="border-t border-white/10 pt-6">
                                <div className="flex items-center justify-between w-full">
                                    <p className="text-sm text-blue-200/60">
                                        Showing {Math.min(searchedEmployees.length, 9)} staff members
                                    </p>
                                    {searchedEmployees.length > 9 && (
                                        <Button
                                            variant="outline"
                                            className="border-white/10 text-blue-200 hover:text-white hover:bg-white/5"
                                            onClick={() => {/* Load more */ }}
                                        >
                                            Load More
                                        </Button>
                                    )}
                                </div>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}