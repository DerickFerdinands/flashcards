"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { FlashcardViewer } from "@/components/flashcard/flashcard-viewer";
import { ReviewForm } from "@/components/flashcard/review-form";
import { FlashcardSet, Review } from "@/types/flashcard";
import { Brain } from "lucide-react";

interface StudySetClientProps {
    set: FlashcardSet;
}

export default function StudySetClient({ set }: StudySetClientProps) {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [hiddenCards, setHiddenCards] = useState<number[]>([]);
    const [existingReview, setExistingReview] = useState<Review | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (status === "loading") return;
        if (!session) {
            router.push("/login");
            return;
        }

        Promise.all([
            fetch("/api/hidden-cards").then((res) => res.json()),
            fetch(`/api/reviews?flashcardSetId=${set.id}`).then((res) => res.json()),
        ])
            .then(([hiddenCardsData, reviewData]) => {
                setHiddenCards(hiddenCardsData);
                setExistingReview(reviewData);
            })
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, [session, status, router, set.id]);

    const handleHideCard = async (cardId: number) => {
        try {
            const res = await fetch("/api/hidden-cards", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ flashcardId: cardId }),
            });

            if (res.ok) {
                setHiddenCards((prev) => [...prev, cardId]);
            } else {
                throw new Error("Failed to hide card");
            }
        } catch (error) {
            console.error("Error hiding card:", error);
            alert("Failed to hide card");
        }
    };

    const handleReviewSubmit = async (rating: number, comment: string) => {
        try {
            const res = await fetch("/api/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ flashcardSetId: set.id, rating, comment }),
            });

            if (res.ok) {
                const data = await res.json();
                setExistingReview(data);
            } else {
                throw new Error("Failed to submit review");
            }
        } catch (error) {
            console.error("Error submitting review:", error);
            alert("Failed to submit review");
        }
    };

    if (status === "loading" || isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
        );
    }

    const visibleFlashcards = set.flashcards.filter(
        (card) => !hiddenCards.includes(card.id)
    );

    return (
        <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            <div className="container max-w-4xl mx-auto px-4 py-16">
                <div className="text-center space-y-4 mb-8">
                    <div className="flex items-center justify-center gap-2 text-primary">
                        <Brain className="h-8 w-8" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">{set.title}</h1>
                    {set.description && (
                        <p className="text-muted-foreground max-w-2xl mx-auto">{set.description}</p>
                    )}
                </div>

                <div className="grid gap-8">
                    <FlashcardViewer
                        flashcards={visibleFlashcards}
                        onHideCard={handleHideCard}
                    />
                    <ReviewForm
                        flashcardSetId={set.id}
                        existingReview={existingReview}
                        onSubmit={handleReviewSubmit}
                    />
                </div>
            </div>
        </main>
    );
}
