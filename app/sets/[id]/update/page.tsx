
import React from 'react';
import {UpdateSetForm} from "@/components/flashcard/UpdateSetForm";
import {Brain} from "lucide-react";
import {SetForm} from "@/components/flashcard/set-form";

interface Props {
    params: { id: string };
}

export default async function UpdateCardPage ({ params }: Props)  {

    const res = await fetch(`http://localhost:3000/api/flashcard-sets/${params.id}`, {
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error("Failed to fetch flashcard set");
    }

    const set = await res.json();
    return (
        <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            <div className="container max-w-2xl mx-auto px-4 py-16">
                <div className="text-center space-y-4 mb-8">
                    <div className="flex items-center justify-center gap-2 text-primary">
                        <Brain className="h-8 w-8"/>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Create New Flashcard Set</h1>
                    <p className="text-muted-foreground">
                        Design your perfect study material with custom flashcards
                    </p>
                </div>
                <UpdateSetForm initialData={set}/>
            </div>
        </main>
    );
};
