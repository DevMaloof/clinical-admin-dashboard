// /app/staff/[id]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
    ArrowLeft, Save, Trash2, Mail, Phone, Calendar,
    User, Shield, Camera, Upload, Loader2, AlertCircle,
    MoreVertical, Edit, Copy, PhoneCall, ExternalLink,
    Heart, Stethoscope, Award, Clock, FileText, Badge
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge as UIBadge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface StaffMember {
    id: string;
    name: string;
    email: string;
    phone: string;
    status: string;
    role: string;
    image: string;
    specialty?: string;
    licenseNumber?: string;
    customRole?: string;
    joinedDate?: string;
    lastActive?: string;
    notes?: string;
    education?: string;
    certifications?: string[];
}

interface Role {
    key: string;
    label: string;
}

interface Status {
    key: string;
    label: string;
}

export default function StaffDetailPage() {
    const params = useParams();
    const id = params?.id as string;
    const router = useRouter();

    const [staff, setStaff] = useState<StaffMember | null>(null);
    const [originalStaff, setOriginalStaff] = useState<StaffMember | null>(null);
    const [roles, setRoles] = useState<Role[]>([]);
    const [statuses, setStatuses] = useState<Status[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    // Fetch staff details + enums
    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const [staffRes, metaRes] = await Promise.all([
                    fetch(`/api/staff/${id}`),
                    fetch(`/api/staff/meta`),
                ]);

                if (!staffRes.ok) throw new Error("Failed to fetch staff");
                if (!metaRes.ok) throw new Error("Failed to fetch metadata");

                const staffData = await staffRes.json();
                const metaData = await metaRes.json();

                setStaff(staffData);
                setOriginalStaff(staffData);
                setRoles(metaData.roles);
                setStatuses(metaData.statuses);
            } catch (err) {
                console.error(err);
                toast.error("Error loading staff details");
            } finally {
                setLoading(false);
            }
        }

        if (id) fetchData();
    }, [id]);

    // Check for changes
    useEffect(() => {
        if (staff && originalStaff) {
            const changed = JSON.stringify(staff) !== JSON.stringify(originalStaff);
            setHasChanges(changed);
        }
    }, [staff, originalStaff]);

    const handleImageUpload = async (file: File) => {
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/staff/upload", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Upload failed");

            const data = await res.json();
            setStaff(prev => prev ? { ...prev, image: data.secure_url || data.url } : null);
            toast.success("Profile photo updated!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to upload image");
        } finally {
            setUploading(false);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!staff) return;

        setSaving(true);
        try {
            const payload = {
                ...staff,
                role: staff.role === "other" ? (staff.customRole?.trim() || "other") : staff.role,
            };

            const res = await fetch(`/api/staff/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Failed to update staff");

            toast.success(
                <div className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    <span>Staff updated successfully!</span>
                </div>
            );

            setOriginalStaff(staff);
            setHasChanges(false);
        } catch (err) {
            console.error(err);
            toast.error("Error updating staff");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this staff member? This action cannot be undone.")) return;

        try {
            const res = await fetch(`/api/staff/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete staff");

            toast.success("Staff deleted successfully");
            router.push("/staff");
        } catch (err) {
            console.error(err);
            toast.error("Error deleting staff");
        }
    };

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
            case 'active': return 'bg-emerald-500';
            case 'on-leave': return 'bg-amber-500';
            case 'inactive': return 'bg-gray-500';
            case 'pending': return 'bg-blue-500';
            default: return 'bg-gray-500';
        }
    };

    const getStatusLabel = (status: string) => {
        const statusMap: Record<string, string> = {
            'active': 'Active',
            'on-leave': 'On Leave',
            'inactive': 'Inactive',
            'pending': 'Pending Verification'
        };
        return statusMap[status] || status;
    };

    const getRoleLabel = (role: string) => {
        return roles.find(r => r.key === role)?.label || role;
    };

    if (loading) {
        return (
            <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-400" />
                    <p className="text-blue-200/60">Loading staff details...</p>
                </div>
            </div>
        );
    }

    if (!staff) {
        return (
            <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 mx-auto mb-4 text-blue-400/50" />
                    <h2 className="text-xl font-bold text-white mb-2">Staff Not Found</h2>
                    <p className="text-blue-200/60 mb-4">The staff member you're looking for doesn't exist.</p>
                    <Button onClick={() => router.push("/staff")} className="bg-gradient-to-r from-blue-500 to-cyan-500">
                        Back to Staff
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
            {/* Header */}
            <div className="border-b border-white/10 bg-white/5 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.push("/staff")}
                                className="text-blue-200 hover:text-white hover:bg-white/5"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back
                            </Button>
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                    Staff Details
                                </h1>
                                <p className="text-blue-200/60 text-sm">Manage clinical staff information</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <UIBadge className={`${getStatusColor(staff.status)} border-0 text-white`}>
                                {getStatusLabel(staff.status)}
                            </UIBadge>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-blue-200 hover:text-white hover:bg-white/5">
                                        <MoreVertical className="h-5 w-5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="bg-slate-900 border-white/10 text-white">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuSeparator className="bg-white/10" />
                                    <DropdownMenuItem onClick={() => window.location.href = `mailto:${staff.email}`}>
                                        <Mail className="h-4 w-4 mr-2" />
                                        Send Email
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => window.location.href = `tel:${staff.phone}`}>
                                        <PhoneCall className="h-4 w-4 mr-2" />
                                        Call Staff
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => navigator.clipboard.writeText(staff.email)}>
                                        <Copy className="h-4 w-4 mr-2" />
                                        Copy Email
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-white/10" />
                                    <DropdownMenuItem onClick={handleDelete} className="text-rose-400">
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete Staff
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - Profile */}
                    <div className="lg:col-span-1">
                        <Card className="border-white/10 bg-white/5 backdrop-blur-sm sticky top-8">
                            <CardContent className="p-6">
                                <div className="flex flex-col items-center text-center">
                                    <div className="relative mb-4">
                                        <Avatar className="h-32 w-32 border-4 border-blue-500/30">
                                            <AvatarImage src={staff.image} />
                                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-cyan-500 text-3xl">
                                                {getInitials(staff.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="absolute bottom-2 right-2">
                                            <Input
                                                id="image-upload"
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) handleImageUpload(file);
                                                }}
                                                className="hidden"
                                            />
                                            <Button
                                                type="button"
                                                size="icon"
                                                variant="secondary"
                                                onClick={() => document.getElementById('image-upload')?.click()}
                                                disabled={uploading}
                                                className="bg-slate-800 hover:bg-slate-700 border border-white/10"
                                            >
                                                {uploading ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Camera className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                    </div>

                                    <h2 className="text-2xl font-bold text-white mb-2">{staff.name}</h2>
                                    <UIBadge className="bg-gradient-to-r from-blue-500 to-cyan-500 border-0 mb-4">
                                        {getRoleLabel(staff.role)}
                                    </UIBadge>

                                    {staff.specialty && (
                                        <UIBadge variant="outline" className="border-blue-500/30 text-blue-300 mb-4">
                                            <Stethoscope className="h-3 w-3 mr-1" />
                                            {staff.specialty}
                                        </UIBadge>
                                    )}

                                    <div className="w-full space-y-4 mt-6">
                                        <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                                            <Mail className="h-5 w-5 text-blue-400" />
                                            <div className="flex-1 text-left">
                                                <p className="text-sm text-blue-200/60">Email</p>
                                                <p className="text-white truncate">{staff.email}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                                            <Phone className="h-5 w-5 text-blue-400" />
                                            <div className="flex-1 text-left">
                                                <p className="text-sm text-blue-200/60">Phone</p>
                                                <p className="text-white">{staff.phone || "Not provided"}</p>
                                            </div>
                                        </div>

                                        {staff.licenseNumber && (
                                            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                                                <Award className="h-5 w-5 text-purple-400" />
                                                <div className="flex-1 text-left">
                                                    <p className="text-sm text-blue-200/60">License Number</p>
                                                    <p className="text-white">{staff.licenseNumber}</p>
                                                </div>
                                            </div>
                                        )}

                                        {staff.joinedDate && (
                                            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                                                <Calendar className="h-5 w-5 text-amber-400" />
                                                <div className="flex-1 text-left">
                                                    <p className="text-sm text-blue-200/60">Joined</p>
                                                    <p className="text-white">
                                                        {new Date(staff.joinedDate).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Details Form */}
                    <div className="lg:col-span-2">
                        <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-xl font-bold text-blue-200">Edit Details</CardTitle>
                                <CardDescription className="text-blue-200/60">
                                    Update clinical staff information
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Tabs defaultValue="personal" className="w-full">
                                    <TabsList className="grid w-full grid-cols-4 bg-white/5">
                                        <TabsTrigger value="personal" className="data-[state=active]:bg-blue-500">
                                            <User className="h-4 w-4 mr-2" />
                                            Personal
                                        </TabsTrigger>
                                        <TabsTrigger value="clinical" className="data-[state=active]:bg-emerald-500">
                                            <Stethoscope className="h-4 w-4 mr-2" />
                                            Clinical
                                        </TabsTrigger>
                                        <TabsTrigger value="role" className="data-[state=active]:bg-purple-500">
                                            <Shield className="h-4 w-4 mr-2" />
                                            Role
                                        </TabsTrigger>
                                        <TabsTrigger value="notes" className="data-[state=active]:bg-amber-500">
                                            <FileText className="h-4 w-4 mr-2" />
                                            Notes
                                        </TabsTrigger>
                                    </TabsList>

                                    <form onSubmit={handleUpdate}>
                                        <TabsContent value="personal" className="space-y-6 mt-6">
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label htmlFor="name" className="text-blue-200">Full Name *</Label>
                                                    <Input
                                                        id="name"
                                                        value={staff.name}
                                                        onChange={(e) => setStaff({ ...staff, name: e.target.value })}
                                                        className="bg-white/5 border-white/10 text-white"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="email" className="text-blue-200">Email *</Label>
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        value={staff.email}
                                                        onChange={(e) => setStaff({ ...staff, email: e.target.value })}
                                                        className="bg-white/5 border-white/10 text-white"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="phone" className="text-blue-200">Phone</Label>
                                                    <Input
                                                        id="phone"
                                                        value={staff.phone}
                                                        onChange={(e) => setStaff({ ...staff, phone: e.target.value })}
                                                        className="bg-white/5 border-white/10 text-white"
                                                    />
                                                </div>
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="clinical" className="space-y-6 mt-6">
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label htmlFor="specialty" className="text-blue-200">Specialty</Label>
                                                    <Input
                                                        id="specialty"
                                                        value={staff.specialty || ""}
                                                        onChange={(e) => setStaff({ ...staff, specialty: e.target.value })}
                                                        placeholder="e.g., Cardiology, Neurology"
                                                        className="bg-white/5 border-white/10 text-white"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="license" className="text-blue-200">License Number</Label>
                                                    <Input
                                                        id="license"
                                                        value={staff.licenseNumber || ""}
                                                        onChange={(e) => setStaff({ ...staff, licenseNumber: e.target.value })}
                                                        placeholder="Medical license #"
                                                        className="bg-white/5 border-white/10 text-white"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="education" className="text-blue-200">Education</Label>
                                                    <Input
                                                        id="education"
                                                        value={staff.education || ""}
                                                        onChange={(e) => setStaff({ ...staff, education: e.target.value })}
                                                        placeholder="Medical school, residency"
                                                        className="bg-white/5 border-white/10 text-white"
                                                    />
                                                </div>
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="role" className="space-y-6 mt-6">
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label className="text-blue-200">Role *</Label>
                                                    <Select
                                                        value={staff.role}
                                                        onValueChange={(value) => setStaff({ ...staff, role: value })}
                                                    >
                                                        <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                                            <SelectValue placeholder="Select role" />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-slate-900 border-white/10">
                                                            {roles
                                                                .filter((r) => r.key.toLowerCase() !== "other")
                                                                .map((r) => (
                                                                    <SelectItem key={r.key} value={r.key}>
                                                                        {r.label}
                                                                    </SelectItem>
                                                                ))}
                                                            <SelectItem value="other">Other</SelectItem>
                                                        </SelectContent>
                                                    </Select>

                                                    {staff.role === "other" && (
                                                        <div className="mt-3">
                                                            <Input
                                                                placeholder="Specify other role"
                                                                value={staff.customRole || ""}
                                                                onChange={(e) => setStaff({ ...staff, customRole: e.target.value })}
                                                                className="bg-white/5 border-white/10 text-white"
                                                            />
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label className="text-blue-200">Status *</Label>
                                                    <Select
                                                        value={staff.status}
                                                        onValueChange={(value) => setStaff({ ...staff, status: value })}
                                                    >
                                                        <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                                            <SelectValue placeholder="Select status" />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-slate-900 border-white/10">
                                                            {statuses.map((s) => (
                                                                <SelectItem key={s.key} value={s.key}>
                                                                    <div className="flex items-center gap-2">
                                                                        <div className={`w-2 h-2 rounded-full ${getStatusColor(s.key)}`} />
                                                                        {s.key === 'on-leave' ? 'On Leave' : s.label}
                                                                    </div>
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="notes" className="space-y-6 mt-6">
                                            <div className="space-y-2">
                                                <Label className="text-blue-200">Notes</Label>
                                                <textarea
                                                    value={staff.notes || ""}
                                                    onChange={(e) => setStaff({ ...staff, notes: e.target.value })}
                                                    className="w-full h-40 bg-white/5 border border-white/10 rounded-md p-3 text-white resize-none"
                                                    placeholder="Add any notes about this staff member..."
                                                />
                                            </div>
                                        </TabsContent>

                                        <Separator className="my-6 bg-white/10" />

                                        <div className="flex items-center justify-between">
                                            {hasChanges && (
                                                <div className="flex items-center gap-2 text-amber-400 text-sm">
                                                    <AlertCircle className="h-4 w-4" />
                                                    <span>You have unsaved changes</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-3 ml-auto">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => setStaff(originalStaff)}
                                                    disabled={!hasChanges || saving}
                                                    className="border-white/10 text-blue-200 hover:text-white hover:bg-white/5"
                                                >
                                                    Reset
                                                </Button>
                                                <Button
                                                    type="submit"
                                                    disabled={!hasChanges || saving}
                                                    className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50"
                                                >
                                                    {saving ? (
                                                        <>
                                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                            Saving...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Save className="h-4 w-4 mr-2" />
                                                            Save Changes
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    </form>
                                </Tabs>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}