"use client";

import { useState } from "react";
import { Flashcard } from "@/types/flashcard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { FlashcardForm } from "./flashcard-form";

interface SetFormProps {
    onSubmit: (data: { title: string; description: string; flashcards: Flashcard[] }) => void;
}

export function SetForm({ onSubmit }: SetFormProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [flashcards, setFlashcards] = useState<Flashcard[]>([{ question: "", answer: "" }]);

    const handleAddCard = () => {
        setFlashcards([...flashcards, { question: "", answer: "" }]);
    };

    const handleRemoveCard = (index: number) => {
        setFlashcards(flashcards.filter((_, i) => i !== index));
    };

    const handleChange = (index: number, field: keyof Flashcard, value: string) => {
        setFlashcards(
            flashcards.map((card, i) => (i === index ? { ...card, [field]: value } : card))
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ title, description, flashcards });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid gap-4">
                <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter set title"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter set description"
                        className="resize-none"
                    />
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Flashcards</h2>
                    <Button type="button" variant="outline" onClick={handleAddCard}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Card
                    </Button>
                </div>
                <div className="grid gap-4">
                    {flashcards.map((card, index) => (
                        <FlashcardForm
                            key={index}
                            card={card}
                            index={index}
                            onRemove={handleRemoveCard}
                            onChange={handleChange}
                            canRemove={flashcards.length > 1}
                        />
                    ))}
                </div>
            </div>

            <Button type="submit" className="w-full">Create Set</Button>
        </form>
    );
}
