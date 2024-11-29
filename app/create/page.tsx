"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { SetForm } from "@/components/flashcard/set-form";
import { Brain } from "lucide-react";

export default function CreateSet() {
    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === "loading") return;
        if (!session) {
            router.push("/login");
        }
    }, [session, status, router]);

    const handleSubmit = async (data: {
        title: string;
        description: string;
        flashcards: { question: string; answer: string }[];
    }) => {
        try {
            const res = await fetch("/api/flashcard-sets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                router.push("/");
            } else {
                const error = await res.json();
                throw new Error(error.message);
            }
        } catch (error) {
            console.error("Failed to create flashcard set:", error);
            alert(error instanceof Error ? error.message : "Failed to create flashcard set");
        }
    };

    if (status === "loading") {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            <div className="container max-w-2xl mx-auto px-4 py-16">
                <div className="text-center space-y-4 mb-8">
                    <div className="flex items-center justify-center gap-2 text-primary">
                        <Brain className="h-8 w-8" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Create New Flashcard Set</h1>
                    <p className="text-muted-foreground">
                        Design your perfect study material with custom flashcards
                    </p>
                </div>
                <SetForm onSubmit={handleSubmit} />
            </div>
        </main>
    );
}
