"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Eye, EyeOff, Trash } from "lucide-react";

interface StudyControlsProps {
    currentIndex: number;
    totalCards: number;
    showAnswer: boolean;
    onPrevious: () => void;
    onNext: () => void;
    onToggleAnswer: () => void;
    onHideCard: () => void;
}

export function StudyControls({
                                  currentIndex,
                                  totalCards,
                                  showAnswer,
                                  onPrevious,
                                  onNext,
                                  onToggleAnswer,
                                  onHideCard,
                              }: StudyControlsProps) {
    return (
        <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2">
        <Button variant="outline" onClick={onPrevious}>
    <ChevronLeft className="h-4 w-4 mr-1" />
        Previous
        </Button>
        <Button variant="outline" onClick={onNext}>
        Next
        <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
        </div>
        <Button variant="secondary" onClick={onToggleAnswer}>
        {showAnswer ? (
                <>
                    <EyeOff className="h-4 w-4 mr-1" />
                    Hide Answer
                </>
) : (
        <>
            <Eye className="h-4 w-4 mr-1" />
            Show Answer
    </>
)}
    </Button>
    <Button variant="destructive" onClick={onHideCard}>
    <Trash className="h-4 w-4 mr-1" />
        Hide Card
    </Button>
    <span className="ml-auto text-sm text-muted-foreground">
        Card {currentIndex + 1} of {totalCards}
    </span>
    </div>
);
}
