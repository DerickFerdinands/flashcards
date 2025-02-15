"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { Review } from "@/types/flashcard";
import {Rating} from "@/components/flashcard/rating";

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
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Leave a Review</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Rating
                        </label>
                        <Rating
                            value={rating}
                            onChange={setRating}
                            className="mt-2"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Comment
                        </label>
                        <Textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Share your thoughts about this flashcard set..."
                            className="resize-none min-h-[100px]"
                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Submitting..." : (existingReview ? "Update Review" : "Submit Review")}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
