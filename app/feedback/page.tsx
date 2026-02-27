// /app/reviews/page.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import {
    Star, Search, Filter, Calendar, TrendingUp, ThumbsUp,
    MessageSquare, User, AlertCircle, BarChart3, ChevronLeft, ChevronRight,
    Heart, Activity, Shield, Stethoscope, Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type Review = {
    _id: string;
    name?: string;
    rating: number;
    comment: string;
    recommend?: boolean;
    createdAt?: string;
    response?: string;
    status?: "pending" | "approved" | "rejected";
    patientType?: string;
    department?: string;
};

export default function ReviewsManagementPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [filterRating, setFilterRating] = useState("all");
    const [filterDepartment, setFilterDepartment] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const reviewsPerPage = 12;

    useEffect(() => {
        const fetchReviews = async () => {
            setLoading(true);
            try {
                const res = await fetch("/api/reviews");
                if (!res.ok) throw new Error("Failed to fetch reviews");
                const data: Review[] = await res.json();
                setReviews(data);
            } catch (err) {
                console.error("Error fetching reviews:", err);
                toast.error("Failed to load patient feedback. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, []);

    // Calculate stats
    const stats = useMemo(() => {
        const total = reviews.length;
        const avgRating = total > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / total
            : 0;
        const recommendRate = total > 0
            ? (reviews.filter(r => r.recommend).length / total) * 100
            : 0;
        const ratingDistribution = [0, 0, 0, 0, 0]; // 1-5 stars
        reviews.forEach(r => {
            if (r.rating >= 1 && r.rating <= 5) {
                ratingDistribution[r.rating - 1]++;
            }
        });

        return { total, avgRating, recommendRate, ratingDistribution };
    }, [reviews]);

    // Filter & sort reviews
    const filteredReviews = useMemo(() => {
        let filtered = reviews.filter((r) =>
        (r.name?.toLowerCase().includes(search.toLowerCase()) ||
            r.comment.toLowerCase().includes(search.toLowerCase()))
        );

        // Filter by rating
        if (filterRating !== "all") {
            filtered = filtered.filter(r => r.rating === parseInt(filterRating));
        }

        // Filter by department
        if (filterDepartment !== "all") {
            filtered = filtered.filter(r => r.department === filterDepartment);
        }

        // Sort
        switch (sortBy) {
            case "newest":
                return filtered.sort(
                    (a, b) =>
                        new Date(b.createdAt ?? "").getTime() -
                        new Date(a.createdAt ?? "").getTime()
                );
            case "oldest":
                return filtered.sort(
                    (a, b) =>
                        new Date(a.createdAt ?? "").getTime() -
                        new Date(b.createdAt ?? "").getTime()
                );
            case "top-rated":
                return filtered.sort((a, b) => b.rating - a.rating);
            case "lowest-rated":
                return filtered.sort((a, b) => a.rating - b.rating);
            default:
                return filtered;
        }
    }, [reviews, search, sortBy, filterRating, filterDepartment]);

    // Pagination
    const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);
    const paginatedReviews = filteredReviews.slice(
        (currentPage - 1) * reviewsPerPage,
        currentPage * reviewsPerPage
    );

    const handleRespond = async (reviewId: string) => {
        const response = prompt("Enter your response to this patient feedback:");
        if (response) {
            try {
                const res = await fetch(`/api/reviews/${reviewId}/respond`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ response }),
                });

                if (res.ok) {
                    toast.success("Response sent successfully!");
                    // Refresh reviews
                    const updatedReviews = await fetch("/api/reviews").then(r => r.json());
                    setReviews(updatedReviews);
                } else {
                    toast.error("Failed to send response.");
                }
            } catch (err) {
                console.error(err);
                toast.error("Error sending response.");
            }
        }
    };

    const handleDelete = async (reviewId: string) => {
        if (!confirm("Are you sure you want to delete this patient feedback? This action cannot be undone.")) return;

        try {
            const res = await fetch(`/api/reviews/${reviewId}`, {
                method: "DELETE"
            });

            if (res.ok) {
                toast.success("Feedback deleted successfully!");
                setReviews(reviews.filter(r => r._id !== reviewId));
            } else {
                toast.error("Failed to delete feedback.");
            }
        } catch (err) {
            console.error(err);
            toast.error("Error deleting feedback.");
        }
    };

    const RatingBar = ({ count, total, stars }: { count: number; total: number; stars: number }) => {
        const percentage = total > 0 ? (count / total) * 100 : 0;
        return (
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-16">
                    <span className="text-sm text-blue-200/60">{stars}</span>
                    <Star className="h-3 w-3 text-amber-400" />
                </div>
                <div className="flex-1 relative">
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                        />
                    </div>
                </div>
                <span className="text-sm text-blue-200/60 w-8 text-right">{count}</span>
            </div>
        );
    };

    const getRatingColor = (rating: number) => {
        if (rating >= 4) return "border-emerald-500/30 text-emerald-400";
        if (rating >= 3) return "border-amber-500/30 text-amber-400";
        return "border-rose-500/30 text-rose-400";
    };

    const departments = [
        { value: "all", label: "All Departments" },
        { value: "cardiology", label: "Cardiology" },
        { value: "neurology", label: "Neurology" },
        { value: "pediatrics", label: "Pediatrics" },
        { value: "orthopedics", label: "Orthopedics" },
        { value: "primary", label: "Primary Care" },
    ];

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
                                    Patient Feedback
                                </h1>
                            </div>
                            <p className="text-blue-200/60 text-sm">Manage and analyze patient satisfaction data</p>
                        </div>
                        <Badge variant="outline" className="border-blue-500/30 text-blue-300 bg-blue-500/10">
                            <MessageSquare className="h-3 w-3 mr-1" />
                            {stats.total.toLocaleString()} responses
                        </Badge>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-blue-200/60">Average Rating</p>
                                    <div className="flex items-baseline gap-2">
                                        <p className="text-3xl font-bold text-white">
                                            {stats.avgRating.toFixed(1)}
                                        </p>
                                        <span className="text-blue-200/40">/5</span>
                                    </div>
                                </div>
                                <div className="p-3 rounded-lg bg-amber-500/20">
                                    <Star className="h-6 w-6 text-amber-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-blue-200/60">Patient Satisfaction</p>
                                    <p className="text-3xl font-bold text-white">
                                        {stats.recommendRate.toFixed(1)}%
                                    </p>
                                </div>
                                <div className="p-3 rounded-lg bg-emerald-500/20">
                                    <ThumbsUp className="h-6 w-6 text-emerald-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-blue-200/60">This Month</p>
                                    <p className="text-3xl font-bold text-white">
                                        {reviews.filter(r => {
                                            const date = new Date(r.createdAt || '');
                                            const now = new Date();
                                            return date.getMonth() === now.getMonth() &&
                                                date.getFullYear() === now.getFullYear();
                                        }).length}
                                    </p>
                                </div>
                                <div className="p-3 rounded-lg bg-blue-500/20">
                                    <Calendar className="h-6 w-6 text-blue-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-blue-200/60">NPS Score</p>
                                    <p className="text-3xl font-bold text-white">+72</p>
                                </div>
                                <div className="p-3 rounded-lg bg-purple-500/20">
                                    <Award className="h-6 w-6 text-purple-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Left Column - Filters & Distribution */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-lg text-blue-200 font-semibold">Filters</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-sm text-blue-200/60">Search Feedback</Label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-400/60" />
                                        <Input
                                            placeholder="Search patients..."
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-blue-200/40"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm text-blue-200/60">Sort By</Label>
                                    <Select value={sortBy} onValueChange={setSortBy}>
                                        <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                            <SelectValue placeholder="Sort by" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-900 border-white/10">
                                            <SelectItem value="newest">Newest First</SelectItem>
                                            <SelectItem value="oldest">Oldest First</SelectItem>
                                            <SelectItem value="top-rated">Highest Rated</SelectItem>
                                            <SelectItem value="lowest-rated">Lowest Rated</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm text-blue-200/60">Filter by Rating</Label>
                                    <Select value={filterRating} onValueChange={setFilterRating}>
                                        <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                            <SelectValue placeholder="All ratings" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-900 border-white/10">
                                            <SelectItem value="all">All Ratings</SelectItem>
                                            <SelectItem value="5">5 Stars</SelectItem>
                                            <SelectItem value="4">4 Stars</SelectItem>
                                            <SelectItem value="3">3 Stars</SelectItem>
                                            <SelectItem value="2">2 Stars</SelectItem>
                                            <SelectItem value="1">1 Star</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm text-blue-200/60">Filter by Department</Label>
                                    <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                                        <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                            <SelectValue placeholder="All departments" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-900 border-white/10">
                                            {departments.map((dept) => (
                                                <SelectItem key={dept.value} value={dept.value}>
                                                    {dept.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="pt-4 border-t border-white/10">
                                    <Button
                                        variant="ghost"
                                        className="w-full border-0 bg-white/5 text-blue-200 hover:text-white hover:bg-white/10"
                                        onClick={() => {
                                            setSearch("");
                                            setSortBy("newest");
                                            setFilterRating("all");
                                            setFilterDepartment("all");
                                            setCurrentPage(1);
                                        }}
                                    >
                                        <Filter className="h-4 w-4 mr-2" />
                                        Clear All Filters
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Rating Distribution */}
                        <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-lg text-blue-200 font-semibold">Rating Distribution</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {[5, 4, 3, 2, 1].map((stars) => (
                                    <RatingBar
                                        key={stars}
                                        stars={stars}
                                        count={stats.ratingDistribution[stars - 1]}
                                        total={stats.total || 1}
                                    />
                                ))}
                            </CardContent>
                        </Card>

                        {/* HIPAA Notice */}
                        <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-4">
                            <div className="flex items-start gap-3">
                                <Shield className="h-5 w-5 text-blue-400 mt-0.5" />
                                <div>
                                    <p className="font-medium text-white text-sm">HIPAA Compliant</p>
                                    <p className="text-xs text-blue-200/60 mt-1">
                                        All patient feedback is handled in compliance with healthcare privacy regulations.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Reviews List */}
                    <div className="lg:col-span-3">
                        <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-lg text-blue-200 font-semibold">Patient Feedback</CardTitle>
                                        <CardDescription className="text-blue-200/60">
                                            Showing {paginatedReviews.length} of {filteredReviews.length} responses
                                        </CardDescription>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            disabled={currentPage === 1}
                                            onClick={() => setCurrentPage(p => p - 1)}
                                            className="border-0 bg-white/5 text-blue-200 hover:text-white hover:bg-white/10"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>
                                        <span className="text-sm text-blue-200/60">
                                            Page {currentPage} of {totalPages}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            disabled={currentPage === totalPages}
                                            onClick={() => setCurrentPage(p => p + 1)}
                                            className="border-0 bg-white/5 text-blue-200 hover:text-white hover:bg-white/10"
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {loading ? (
                                    <div className="space-y-4">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="p-4 rounded-lg bg-white/5">
                                                <div className="flex items-start gap-3">
                                                    <Skeleton className="h-12 w-12 rounded-full bg-white/5" />
                                                    <div className="space-y-2 flex-1">
                                                        <Skeleton className="h-4 w-32 bg-white/5" />
                                                        <Skeleton className="h-3 w-24 bg-white/5" />
                                                        <Skeleton className="h-16 w-full bg-white/5" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : filteredReviews.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-4">
                                            <AlertCircle className="h-8 w-8 text-blue-400/50" />
                                        </div>
                                        <p className="text-blue-200/60 mb-2">No feedback found</p>
                                        <p className="text-sm text-blue-200/40">
                                            Try adjusting your filters or check back later
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {paginatedReviews.map((review) => (
                                            <div
                                                key={review._id}
                                                className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-all duration-300"
                                            >
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex items-start gap-3 flex-1">
                                                        <div className="flex-shrink-0">
                                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                                                                <Heart className="h-6 w-6 text-blue-400" />
                                                            </div>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <h3 className="font-semibold text-white">
                                                                    {review.name || "Anonymous Patient"}
                                                                </h3>
                                                                <Badge
                                                                    variant="outline"
                                                                    className={getRatingColor(review.rating)}
                                                                >
                                                                    {review.rating}.0
                                                                </Badge>
                                                            </div>
                                                            <div className="flex items-center gap-1 mb-3">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <Star
                                                                        key={i}
                                                                        className={`h-4 w-4 ${i < review.rating
                                                                            ? "text-amber-400 fill-amber-400"
                                                                            : "text-gray-600"
                                                                            }`}
                                                                    />
                                                                ))}
                                                            </div>
                                                            <p className="text-blue-200/80 italic leading-relaxed">
                                                                "{review.comment}"
                                                            </p>
                                                            {review.department && (
                                                                <div className="mt-2 flex items-center gap-2">
                                                                    <Badge variant="outline" className="border-blue-500/30 text-blue-300">
                                                                        <Stethoscope className="h-3 w-3 mr-1" />
                                                                        {review.department}
                                                                    </Badge>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                                    <div className="flex items-center gap-4">
                                                        {review.recommend && (
                                                            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                                                                <ThumbsUp className="h-3 w-3 mr-1" />
                                                                Would Recommend
                                                            </Badge>
                                                        )}
                                                        {review.createdAt && (
                                                            <span className="text-sm text-blue-200/40">
                                                                {new Date(review.createdAt).toLocaleDateString('en-US', {
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                    year: 'numeric'
                                                                })}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleRespond(review._id)}
                                                            className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                                                        >
                                                            <MessageSquare className="h-4 w-4 mr-1" />
                                                            Respond
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDelete(review._id)}
                                                            className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                                                        >
                                                            Delete
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                            {totalPages > 1 && (
                                <CardFooter className="border-t border-white/10 pt-6">
                                    <div className="flex items-center justify-between w-full">
                                        <p className="text-sm text-blue-200/60">
                                            Showing {(currentPage - 1) * reviewsPerPage + 1} to{" "}
                                            {Math.min(currentPage * reviewsPerPage, filteredReviews.length)} of{" "}
                                            {filteredReviews.length} responses
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={currentPage === 1}
                                                onClick={() => setCurrentPage(1)}
                                                className="border-white/10 text-blue-200 hover:text-white hover:bg-white/5"
                                            >
                                                First
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={currentPage === 1}
                                                onClick={() => setCurrentPage(p => p - 1)}
                                                className="border-white/10 text-blue-200 hover:text-white hover:bg-white/5"
                                            >
                                                Previous
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
                                                Next
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={currentPage === totalPages}
                                                onClick={() => setCurrentPage(totalPages)}
                                                className="border-white/10 text-blue-200 hover:text-white hover:bg-white/5"
                                            >
                                                Last
                                            </Button>
                                        </div>
                                    </div>
                                </CardFooter>
                            )}
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}