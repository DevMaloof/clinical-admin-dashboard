// /app/offers/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
    Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from "@/components/ui/card";
import {
    Send, Mail, Target, Users, Bell, BarChart3,
    AlertCircle, CheckCircle, Loader2, Heart, Activity,
    Stethoscope, Calendar, Clock, Shield, Award
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function OffersPage() {
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [subscriberCount, setSubscriberCount] = useState<number | null>(null);
    const [sendToAll, setSendToAll] = useState(true);
    const [includeDiscount, setIncludeDiscount] = useState(false);
    const [discountCode, setDiscountCode] = useState("");

    // Fetch subscriber count on mount
    useState(() => {
        fetch("/api/subscribers/count")
            .then(res => res.json())
            .then(data => setSubscriberCount(data.count))
            .catch(() => setSubscriberCount(0));
    });

    const handleSendOffer = async () => {
        if (!subject.trim()) {
            toast.warning("Please enter a subject for your campaign.");
            return;
        }

        if (!message.trim()) {
            toast.warning("Please enter the campaign message.");
            return;
        }

        if (includeDiscount && !discountCode.trim()) {
            toast.warning("Please enter a discount code.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/email/campaigns", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    subject,
                    message,
                    sendToAll,
                    discountCode: includeDiscount ? discountCode : undefined,
                    campaignType: "healthcare"
                }),
            });

            if (res.ok) {
                const data = await res.json();
                toast.success(
                    <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-400" />
                        <span>Campaign sent to {data.sent.toLocaleString()} patients!</span>
                    </div>,
                    { duration: 5000 }
                );

                // Reset form
                setSubject("");
                setMessage("");
                setDiscountCode("");

                // Show success animation
                setTimeout(() => {
                    toast.info("Emails are being processed and will arrive shortly.");
                }, 1000);
            } else {
                const error = await res.json();
                toast.error(error.error || "Failed to send campaign.");
            }
        } catch (err) {
            console.error("Error sending campaign:", err);
            toast.error(
                <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-rose-400" />
                    <span>Network error. Please check your connection and try again.</span>
                </div>
            );
        } finally {
            setLoading(false);
        }
    };

    const generateDiscountCode = () => {
        const code = `WELLNESS${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        setDiscountCode(code);
        setIncludeDiscount(true);
        toast.info(`Health discount code generated: ${code}`);
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
            {/* Header */}
            <div className="border-b border-white/10 bg-white/5 backdrop-blur-xl">
                <div className="max-w-6xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <Heart className="h-6 w-6 text-blue-400" />
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                    Patient Communications
                                </h1>
                            </div>
                            <p className="text-blue-200/60 text-sm">Send health updates and wellness campaigns</p>
                        </div>
                        <Badge variant="outline" className="border-blue-500/30 text-blue-300 bg-blue-500/10">
                            <Users className="h-3 w-3 mr-1" />
                            {subscriberCount !== null ? `${subscriberCount.toLocaleString()} patients` : "Loading..."}
                        </Badge>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-6 py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - Form */}
                    <div className="lg:col-span-2">
                        <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                            <CardHeader>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-cyan-500/20">
                                        <Send className="h-6 w-6 text-blue-400" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl text-white font-bold">Create Health Campaign</CardTitle>
                                        <CardDescription className="text-blue-200/60">
                                            Send wellness updates and health information to patients
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <Tabs defaultValue="wellness" className="w-full">
                                    <TabsList className="grid w-full grid-cols-3 bg-white/5">
                                        <TabsTrigger value="wellness" className="text-blue-200 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                                            <Heart className="h-4 w-4 mr-2" />
                                            Wellness
                                        </TabsTrigger>
                                        <TabsTrigger value="announcement" className="text-blue-200 data-[state=active]:bg-purple-500 data-[state=active]:text-white">
                                            <Bell className="h-4 w-4 mr-2" />
                                            Announcement
                                        </TabsTrigger>
                                        <TabsTrigger value="event" className="text-blue-200 data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
                                            <Calendar className="h-4 w-4 mr-2" />
                                            Health Event
                                        </TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="wellness" className="space-y-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="subject" className="text-blue-200 flex items-center gap-2">
                                                <Mail className="h-4 w-4 text-blue-400" />
                                                Campaign Subject *
                                            </Label>
                                            <Input
                                                id="subject"
                                                placeholder="e.g., Free Health Screening This Week!"
                                                value={subject}
                                                onChange={(e) => setSubject(e.target.value)}
                                                className="bg-white/5 border-white/10 text-white h-12 text-lg placeholder:text-blue-200/40"
                                            />
                                            <p className="text-xs text-blue-200/40">
                                                Make it clear and informative - patients need to know the value.
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="message" className="text-blue-200">Campaign Message *</Label>
                                            <Textarea
                                                id="message"
                                                placeholder="Write your health message here. Include important details about the service, benefits, and call to action..."
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                className="min-h-[200px] bg-white/5 border-white/10 text-white placeholder:text-blue-200/40"
                                            />
                                            <div className="flex items-center justify-between text-xs text-blue-200/40">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                                                    <span>Supports HTML formatting for medical information</span>
                                                </div>
                                                <span>{message.length}/2000 characters</span>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label htmlFor="discount" className="text-blue-200">Include Wellness Discount</Label>
                                                    <p className="text-sm text-blue-200/60">Offer a special discount on health services</p>
                                                </div>
                                                <Switch
                                                    id="discount"
                                                    checked={includeDiscount}
                                                    onCheckedChange={setIncludeDiscount}
                                                    className="data-[state=checked]:bg-emerald-500"
                                                />
                                            </div>

                                            {includeDiscount && (
                                                <div className="space-y-2 pl-4 border-l-2 border-emerald-500/30">
                                                    <Label htmlFor="discountCode" className="text-blue-200">Discount Code</Label>
                                                    <div className="flex gap-2">
                                                        <Input
                                                            id="discountCode"
                                                            placeholder="e.g., WELLNESS25"
                                                            value={discountCode}
                                                            onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                                                            className="bg-white/5 border-white/10 text-white font-mono"
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            onClick={generateDiscountCode}
                                                            className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                                                        >
                                                            Generate
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </TabsContent>
                                </Tabs>

                                <div className="space-y-4 rounded-lg bg-white/5 p-4 border border-white/10">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-blue-500/20">
                                                <Target className="h-5 w-5 text-blue-400" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-white">Patient Audience</p>
                                                <p className="text-sm text-blue-200/60">Select who receives this health campaign</p>
                                            </div>
                                        </div>
                                        <Switch
                                            checked={sendToAll}
                                            onCheckedChange={setSendToAll}
                                            className="data-[state=checked]:bg-blue-500"
                                        />
                                    </div>
                                    <div className="pl-12">
                                        <p className="text-sm text-blue-200/80">
                                            {sendToAll
                                                ? "This campaign will be sent to all active patients in your database."
                                                : "Only patients who have opted into health communications will receive this campaign."
                                            }
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="border-t border-white/10 pt-6">
                                <div className="w-full space-y-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2 text-blue-200/60">
                                            <Shield className="h-4 w-4" />
                                            <span>HIPAA compliant communication</span>
                                        </div>
                                        <Button
                                            onClick={handleSendOffer}
                                            disabled={loading || !subject.trim() || !message.trim()}
                                            className="min-w-[180px] bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="h-4 w-4 mr-2" />
                                                    Send Campaign
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </CardFooter>
                        </Card>
                    </div>

                    {/* Right Column - Stats & Templates */}
                    <div className="space-y-6">
                        {/* Quick Stats */}
                        <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-lg text-white font-semibold">Campaign Analytics</CardTitle>
                                <CardDescription className="text-blue-200/60">
                                    Last 30 days performance
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 rounded-lg bg-emerald-500/20">
                                            <Activity className="h-4 w-4 text-emerald-400" />
                                        </div>
                                        <span className="text-sm text-blue-200">Open Rate</span>
                                    </div>
                                    <span className="font-bold text-white">68%</span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 rounded-lg bg-blue-500/20">
                                            <Target className="h-4 w-4 text-blue-400" />
                                        </div>
                                        <span className="text-sm text-blue-200">Click Rate</span>
                                    </div>
                                    <span className="font-bold text-white">42%</span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 rounded-lg bg-purple-500/20">
                                            <Award className="h-4 w-4 text-purple-400" />
                                        </div>
                                        <span className="text-sm text-blue-200">Conversion</span>
                                    </div>
                                    <span className="font-bold text-white">23%</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Templates */}
                        <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-lg text-white font-semibold">Health Templates</CardTitle>
                                <CardDescription className="text-blue-200/60">
                                    Start with a pre-written health message
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start bg-white/5 text-blue-200 hover:bg-white/10 hover:text-white"
                                    onClick={() => {
                                        setSubject("Free Blood Pressure Screening This Week");
                                        setMessage("Dear Patient,\n\nWe're offering free blood pressure screenings this week at our Dallas location. No appointment necessary. Walk-ins welcome!\n\nStay healthy,\nMaloof Health Team");
                                    }}
                                >
                                    <Heart className="h-4 w-4 mr-2" />
                                    Free Screening
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start bg-white/5 text-blue-200 hover:bg-white/10 hover:text-white"
                                    onClick={() => {
                                        setSubject("New Telehealth Appointments Available");
                                        setMessage("Dear Patient,\n\nWe're excited to announce expanded telehealth appointments. Now you can consult with our specialists from the comfort of your home.\n\nBook online today!\n\nMaloof Health Systems");
                                    }}
                                >
                                    <Stethoscope className="h-4 w-4 mr-2" />
                                    Telehealth Update
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start bg-white/5 text-blue-200 hover:bg-white/10 hover:text-white"
                                    onClick={() => {
                                        setSubject("Flu Shot Clinic - This Weekend");
                                        setMessage("Dear Patient,\n\nProtect yourself this flu season. Join us this Saturday for our flu shot clinic. Most insurances accepted. Walk-ins welcome!\n\nStay well,\nMaloof Health");
                                    }}>
                                    <Activity className="h-4 w-4 mr-2" />
                                    Flu Shot Clinic
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Tips */}
                        <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-4">
                            <div className="flex items-start gap-3">
                                <BarChart3 className="h-5 w-5 text-blue-400 mt-0.5" />
                                <div>
                                    <p className="font-medium text-white text-sm">Best Practices for Health Communications</p>
                                    <ul className="mt-2 space-y-1 text-xs text-blue-300">
                                        <li>• Send wellness tips on Monday mornings</li>
                                        <li>• Include clear appointment booking links</li>
                                        <li>• Highlight preventive care opportunities</li>
                                        <li>• Ensure HIPAA compliance in all messages</li>
                                        <li>• Add emergency contact information</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}