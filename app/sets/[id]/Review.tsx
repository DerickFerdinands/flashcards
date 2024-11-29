// app/sets/[id]/Review.tsx

"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface ReviewProps {
    flashcardSetId: number;
}

interface ExistingReview {
    id: number;
    rating: number;
    comment?: string;
}

export default function Review({ flashcardSetId }: ReviewProps) {
    const [rating, setRating] = useState<number>(5);
    const [comment, setComment] = useState<string>("");
    const { data: session, status } = useSession();
    const [existingReview, setExistingReview] = useState<ExistingReview | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchExistingReview = async () => {
            if (!session) {
                setIsLoading(false);
                return;
            }
            try {
                const res = await fetch(`/api/reviews?flashcardSetId=${flashcardSetId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include", // Ensure cookies are included
                });
                if (!res.ok) {
                    throw new Error("Failed to fetch existing review");
                }
                const data = await res.json();
                if (data) {
                    setExistingReview(data);
                    setRating(data.rating);
                    setComment(data.comment || "");
                }
            } catch (error) {
                console.error(error);
                alert("Error fetching existing review.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchExistingReview();
    }, [session, flashcardSetId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!session) {
            alert("You must be logged in to leave a review.");
            return;
        }

        try {
            const res = await fetch("/api/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ flashcardSetId, rating, comment }),
                credentials: "include", // Ensure cookies are included
            });

            if (res.ok) {
                const data = await res.json();
                setExistingReview(data);
                alert("Review submitted successfully.");
            } else {
                const data = await res.json();
                alert(data.error || "Failed to submit review.");
            }
        } catch (error) {
            console.error("Error submitting review:", error);
            alert("An unexpected error occurred.");
        }
    };

    if (status === "loading" || isLoading) {
        return <div>Loading review...</div>;
    }

    if (!session) {
        return <p>Please login to leave a review.</p>;
    }

    return (
        <form onSubmit={handleSubmit} className="mt-4 border-t pt-4">
            <h3 className="text-lg font-semibold">Leave a Review</h3>
            <div className="mb-2">
                <label className="block mb-1">Rating</label>
                <select
                    value={rating}
                    onChange={(e) => setRating(parseInt(e.target.value))}
                    className="border px-2 py-1 rounded"
                    required
                >
                    {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>
                            {num} Star{num > 1 ? "s" : ""}
                        </option>
                    ))}
                </select>
            </div>
            <div className="mb-2">
                <label className="block mb-1">Comment</label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                    rows={3}
                />
            </div>
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                {existingReview ? "Update Review" : "Submit Review"}
            </button>
        </form>
    );
}
