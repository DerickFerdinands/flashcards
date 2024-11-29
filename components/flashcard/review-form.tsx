"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Rating } from "@/components/ui/rating";
import { Review } from "@/types/flashcard";

interface ReviewFormProps {
    flashcardSetId: number;
    existingReview: Review | null;
    onSubmit: (rating: number, comment: string) => Promise<void>;
}

export function ReviewForm({ flashcardSetId, existingReview, onSubmit }: ReviewFormProps) {
    const [rating, setRating] = useState<number>(existingReview?.rating ?? 5);
    const [comment, setComment] = useState<string>(existingReview?.comment ?? "");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSubmit(rating, comment);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Leave a Review</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Rating</label>
                        <Rating value={rating} onChange={setRating} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Comment</label>
                        <Textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Share your thoughts about this flashcard set..."
                            className="resize-none"
                            rows={3}
                        />
                    </div>
                    <Button type="submit" disabled={isSubmitting}>
                        {existingReview ? "Update Review" : "Submit Review"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
