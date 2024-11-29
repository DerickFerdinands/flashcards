"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StudyControls } from "./study-controls";
import { Flashcard } from "@/types/flashcard";

interface FlashcardViewerProps {
    flashcards: Flashcard[];
    onHideCard: (cardId: number) => Promise<void>;
}

export function FlashcardViewer({ flashcards, onHideCard }: FlashcardViewerProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);

    const handleNext = () => {
        setShowAnswer(false);
        setCurrentIndex((prev) => (prev + 1) % flashcards.length);
    };

    const handlePrevious = () => {
        setShowAnswer(false);
        setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    };

    const currentCard = flashcards[currentIndex];

    if (!currentCard) {
        return (
            <Card>
                <CardContent className="py-8">
                    <p className="text-center text-muted-foreground">No flashcards available.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Study Flashcards</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="min-h-[200px] flex flex-col justify-center">
                    <p className="text-lg font-medium mb-4">{currentCard.question}</p>
                    {showAnswer && (
                        <p className="text-lg text-primary animate-in fade-in slide-in-from-bottom-2">
                            {currentCard.answer}
                        </p>
                    )}
                </div>
                <StudyControls
                    currentIndex={currentIndex}
                    totalCards={flashcards.length}
                    showAnswer={showAnswer}
                    onPrevious={handlePrevious}
                    onNext={handleNext}
                    onToggleAnswer={() => setShowAnswer(!showAnswer)}
                    onHideCard={() => onHideCard(currentCard.id)}
                />
            </CardContent>
        </Card>
    );
}
