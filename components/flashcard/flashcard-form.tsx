"use client";

import { Flashcard } from "@/types/flashcard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface FlashcardFormProps {
    card: Flashcard;
    index: number;
    onRemove: (index: number) => void;
    onChange: (index: number, field: keyof Flashcard, value: string) => void;
    canRemove: boolean;
}

export function FlashcardForm({ card, index, onRemove, onChange, canRemove }: FlashcardFormProps) {
    return (
        <Card className="relative group">
            <CardContent className="pt-6">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <Label htmlFor={`question-${index}`}>Question</Label>
                        <Input
                            id={`question-${index}`}
                            value={card.question}
                            onChange={(e) => onChange(index, "question", e.target.value)}
                            placeholder="Enter your question"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor={`answer-${index}`}>Answer</Label>
                        <Input
                            id={`answer-${index}`}
                            value={card.answer}
                            onChange={(e) => onChange(index, "answer", e.target.value)}
                            placeholder="Enter the answer"
                            required
                        />
                    </div>
                </div>
                {canRemove && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => onRemove(index)}
                    >
                        <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
