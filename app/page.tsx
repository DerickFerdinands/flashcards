"use client";

import { useEffect, useState } from "react";
import { CreateSetButton } from "@/components/flashcard/create-set-button";
import { SetCard } from "@/components/flashcard/set-card";
import { Brain } from "lucide-react";

interface FlashcardSet {
    id: number;
    title: string;
    description?: string;
    owner: { name: string };
    averageRating: number;
}

export default function Home() {
    const [sets, setSets] = useState<FlashcardSet[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch("/api/flashcard-sets")
            .then((res) => res.json())
            .then((data) => {
                setSets(data);
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));
    }, []);

    return (
        <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            <div className="container mx-auto px-4 py-16 space-y-8">
                <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-2 text-primary">
                        <Brain className="h-12 w-12" />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight">
                        Flashcards for Effective Learning
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Create, study, and master any subject with our interactive flashcard system
                    </p>
                    <div className="pt-4">
                        <CreateSetButton />
                    </div>
                </div>

                <div className="pt-8">
                    <h2 className="text-2xl font-semibold mb-6">Popular Flashcard Sets</h2>
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="h-[200px] rounded-lg bg-muted animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {sets.map((set) => (
                                <SetCard key={set.id} set={set} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
