// /app/appointments/[id]/page.tsx - Healthcare Version
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { mutate } from "swr";
import {
    Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Calendar, Clock, Users, Mail, Phone,
    CheckCircle, XCircle, CheckCheck, ArrowLeft,
    Loader2, MessageSquare, Printer, Copy,
    AlertCircle, MoreVertical, Heart,
    Stethoscope, Activity, FileText
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type Appointment = {
    id: string;
    name: string;
    email: string;
    phone: string;
    date: string;
    time: string;
    guests: number; // Number of patients
    reservationStatus: "pending" | "confirmed" | "cancelled" | "completed";
    notes?: string | null;
    specialRequests?: string;
    doctor?: string;
    department?: string;
    createdAt?: string;
    updatedAt?: string;
};

export default function AppointmentDetailPage() {
    const params = useParams();
    const id = params?.id as string | undefined;
    const router = useRouter();
    const [appointment, setAppointment] = useState<Appointment | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [activeAction, setActiveAction] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchAppointment = async () => {
            try {
                const res = await fetch(`/api/reservations/${id}`);
                if (!res.ok) throw new Error("Failed to fetch appointment");
                const data: Appointment = await res.json();
                setAppointment(data);
            } catch (err) {
                console.error("Error fetching appointment:", err);
                setAppointment(null);
                toast.error("Failed to load appointment details");
            } finally {
                setLoading(false);
            }
        };

        fetchAppointment();
    }, [id]);

    const updateStatus = async (
        status: "confirmed" | "cancelled" | "completed"
    ) => {
        if (!id) return;
        setActiveAction(status);
        setUpdating(true);

        try {
            const res = await fetch(`/api/reservations/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reservationStatus: status }),
            });

            if (!res.ok) throw new Error("Failed to update appointment");

            const updated: Appointment = await res.json();
            setAppointment(updated);

            // Refresh SWR list immediately
            mutate("/api/reservations");

            const messages = {
                confirmed: "Appointment confirmed successfully! ✅",
                cancelled: "Appointment cancelled successfully ❌",
                completed: "Appointment marked as completed ✨"
            };

            toast.success(messages[status], {
                duration: 3000,
            });
        } catch (err) {
            console.error("Error updating appointment:", err);
            toast.error("Something went wrong while updating appointment.");
        } finally {
            setUpdating(false);
            setActiveAction(null);
        }
    };

    const getStatusBadge = (status: string) => {
        const variants = {
            confirmed: "bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-0",
            cancelled: "bg-gradient-to-r from-rose-600 to-red-600 text-white border-0",
            completed: "bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-0",
            pending: "bg-gradient-to-r from-amber-600 to-orange-600 text-white border-0"
        };

        const labels = {
            confirmed: "Confirmed",
            cancelled: "Cancelled",
            completed: "Completed",
            pending: "Pending"
        };

        return (
            <Badge className={variants[status as keyof typeof variants]}>
                {labels[status as keyof typeof labels]}
            </Badge>
        );
    };

    const formatDate = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch {
            return dateStr;
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

    const handleSendConfirmation = async () => {
        if (!appointment) return;

        try {
            const res = await fetch(`/api/reservations/${id}/send-confirmation`, {
                method: "POST",
            });

            if (res.ok) {
                toast.success("Confirmation email sent successfully!");
            } else {
                toast.error("Failed to send confirmation email");
            }
        } catch (err) {
            console.error(err);
            toast.error("Error sending confirmation");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-400" />
                    <p className="text-blue-200/60">Loading appointment details...</p>
                </div>
            </div>
        );
    }

    if (!appointment) {
        return (
            <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 mx-auto mb-4 text-blue-400/50" />
                    <h2 className="text-xl font-bold text-white mb-2">Appointment Not Found</h2>
                    <p className="text-blue-200/60 mb-4">The appointment you're looking for doesn't exist.</p>
                    <Button
                        onClick={() => router.push("/appointments")}
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                    >
                        Back to Appointments
                    </Button>
                </div>
            </div>
        );
    }

    const disableApprovalButtons =
        updating ||
        ["confirmed", "cancelled", "completed"].includes(
            appointment.reservationStatus
        );

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
                                onClick={() => router.push("/appointments")}
                                className="text-blue-200 hover:text-white hover:bg-white/5"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to List
                            </Button>
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <Heart className="h-5 w-5 text-blue-400" />
                                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                        Appointment Details
                                    </h1>
                                </div>
                                <p className="text-blue-200/60 text-sm">Manage patient appointment information</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            {getStatusBadge(appointment.reservationStatus)}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-blue-200 hover:text-white hover:bg-white/5">
                                        <MoreVertical className="h-5 w-5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="bg-slate-900 border-white/10 text-white">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuSeparator className="bg-white/10" />
                                    <DropdownMenuItem onClick={handleSendConfirmation}>
                                        <Mail className="h-4 w-4 mr-2" />
                                        Send Confirmation
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => window.print()}>
                                        <Printer className="h-4 w-4 mr-2" />
                                        Print Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => navigator.clipboard.writeText(appointment.id)}>
                                        <Copy className="h-4 w-4 mr-2" />
                                        Copy ID
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-white/10" />
                                    <DropdownMenuItem
                                        onClick={() => window.location.href = `mailto:${appointment.email}`}
                                        className="text-blue-400"
                                    >
                                        <Mail className="h-4 w-4 mr-2" />
                                        Contact Patient
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
                    {/* Left Column - Patient Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold text-blue-200">Patient Information</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col items-center text-center mb-6">
                                    <Avatar className="h-20 w-20 mb-4 border-2 border-blue-500/30">
                                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-cyan-500 text-xl">
                                            {getInitials(appointment.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <h2 className="text-xl font-bold text-white">{appointment.name}</h2>
                                    <p className="text-blue-200/60 text-sm">Patient ID: {appointment.id.slice(-8)}</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                                        <Mail className="h-5 w-5 text-blue-400" />
                                        <div className="flex-1">
                                            <p className="text-sm text-blue-200/60">Email</p>
                                            <p className="text-white truncate">{appointment.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                                        <Phone className="h-5 w-5 text-blue-400" />
                                        <div className="flex-1">
                                            <p className="text-sm text-blue-200/60">Phone</p>
                                            <p className="text-white">{appointment.phone}</p>
                                        </div>
                                    </div>

                                    {appointment.createdAt && (
                                        <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                                            <Clock className="h-5 w-5 text-blue-400" />
                                            <div className="flex-1">
                                                <p className="text-sm text-blue-200/60">Created</p>
                                                <p className="text-white text-sm">
                                                    {new Date(appointment.createdAt).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Special Requests */}
                        {appointment.specialRequests && (
                            <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold text-blue-200 flex items-center gap-2">
                                        <MessageSquare className="h-5 w-5 text-blue-400" />
                                        Special Requests
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                        <p className="text-blue-200 italic">"{appointment.specialRequests}"</p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Medical Notes Placeholder */}
                        {appointment.notes && (
                            <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold text-blue-200 flex items-center gap-2">
                                        <FileText className="h-5 w-5 text-blue-400" />
                                        Medical Notes
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                        <p className="text-blue-200">{appointment.notes}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Right Column - Appointment Details & Actions */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold text-blue-200">Appointment Details</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-6">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2 text-blue-200/60">
                                                <Calendar className="h-5 w-5" />
                                                <span className="text-sm font-medium">Date & Time</span>
                                            </div>
                                            <div className="p-4 rounded-lg bg-white/5">
                                                <p className="text-xl font-bold text-white">{formatDate(appointment.date)}</p>
                                                <p className="text-lg text-blue-400">{appointment.time}</p>
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-2 mb-2 text-blue-200/60">
                                                <Users className="h-5 w-5" />
                                                <span className="text-sm font-medium">Number of Patients</span>
                                            </div>
                                            <div className="p-4 rounded-lg bg-white/5">
                                                <p className="text-3xl font-bold text-white">{appointment.guests}</p>
                                                <p className="text-sm text-blue-200/60">patients</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        {appointment.doctor && (
                                            <div>
                                                <div className="flex items-center gap-2 mb-2 text-blue-200/60">
                                                    <Stethoscope className="h-5 w-5" />
                                                    <span className="text-sm font-medium">Assigned Doctor</span>
                                                </div>
                                                <div className="p-4 rounded-lg bg-white/5">
                                                    <p className="text-lg font-semibold text-white">{appointment.doctor}</p>
                                                </div>
                                            </div>
                                        )}

                                        {appointment.department && (
                                            <div>
                                                <div className="flex items-center gap-2 mb-2 text-blue-200/60">
                                                    <Activity className="h-5 w-5" />
                                                    <span className="text-sm font-medium">Department</span>
                                                </div>
                                                <div className="p-4 rounded-lg bg-white/5">
                                                    <p className="text-lg font-semibold text-white">{appointment.department}</p>
                                                </div>
                                            </div>
                                        )}

                                        <div>
                                            <div className="flex items-center gap-2 mb-2 text-blue-200/60">
                                                <Clock className="h-5 w-5" />
                                                <span className="text-sm font-medium">Duration</span>
                                            </div>
                                            <div className="p-4 rounded-lg bg-white/5">
                                                <p className="text-lg font-semibold text-white">60 minutes</p>
                                                <p className="text-sm text-blue-200/60">Standard consultation</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Action Panel */}
                        <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold text-blue-200">Appointment Actions</CardTitle>
                                <CardDescription className="text-blue-200/60">
                                    Update the status of this patient appointment
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <Button
                                        size="lg"
                                        disabled={disableApprovalButtons}
                                        onClick={() => updateStatus("confirmed")}
                                        className={`h-20 flex-col gap-2 ${appointment.reservationStatus === 'confirmed'
                                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600'
                                            : 'bg-white/5 hover:bg-white/10'
                                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                        {activeAction === 'confirmed' ? (
                                            <Loader2 className="h-6 w-6 animate-spin" />
                                        ) : (
                                            <CheckCircle className="h-6 w-6" />
                                        )}
                                        <span className="text-sm">
                                            {appointment.reservationStatus === 'confirmed' ? 'Confirmed' : 'Confirm'}
                                        </span>
                                    </Button>

                                    <Button
                                        size="lg"
                                        disabled={disableApprovalButtons}
                                        onClick={() => updateStatus("cancelled")}
                                        className={`h-20 flex-col gap-2 ${appointment.reservationStatus === 'cancelled'
                                            ? 'bg-gradient-to-r from-rose-600 to-red-600'
                                            : 'bg-white/5 hover:bg-white/10'
                                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                        {activeAction === 'cancelled' ? (
                                            <Loader2 className="h-6 w-6 animate-spin" />
                                        ) : (
                                            <XCircle className="h-6 w-6" />
                                        )}
                                        <span className="text-sm">
                                            {appointment.reservationStatus === 'cancelled' ? 'Cancelled' : 'Cancel'}
                                        </span>
                                    </Button>

                                    <Button
                                        size="lg"
                                        disabled={updating || appointment.reservationStatus !== "confirmed"}
                                        onClick={() => updateStatus("completed")}
                                        className={`h-20 flex-col gap-2 ${appointment.reservationStatus === 'completed'
                                            ? 'bg-gradient-to-r from-blue-600 to-cyan-600'
                                            : 'bg-white/5 hover:bg-white/10'
                                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                        {activeAction === 'completed' ? (
                                            <Loader2 className="h-6 w-6 animate-spin" />
                                        ) : (
                                            <CheckCheck className="h-6 w-6" />
                                        )}
                                        <span className="text-sm">
                                            {appointment.reservationStatus === 'completed' ? 'Completed' : 'Complete'}
                                        </span>
                                    </Button>
                                </div>

                                <Separator className="my-6 bg-white/10" />

                                <div className="flex flex-wrap gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={() => window.location.href = `mailto:${appointment.email}`}
                                        className="border-white/10 text-blue-200 hover:text-white hover:bg-white/5"
                                    >
                                        <Mail className="h-4 w-4 mr-2" />
                                        Email Patient
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => window.location.href = `tel:${appointment.phone}`}
                                        className="border-white/10 text-blue-200 hover:text-white hover:bg-white/5"
                                    >
                                        <Phone className="h-4 w-4 mr-2" />
                                        Call Patient
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={handleSendConfirmation}
                                        className="border-white/10 text-blue-200 hover:text-white hover:bg-white/5"
                                    >
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Send Confirmation
                                    </Button>
                                </div>
                            </CardContent>
                            <CardFooter className="border-t border-white/10 pt-6">
                                <p className="text-sm text-blue-200/40">
                                    Last updated: {appointment.updatedAt ? new Date(appointment.updatedAt).toLocaleString() : 'N/A'}
                                </p>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}