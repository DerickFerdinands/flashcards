"use client"
import {Brain} from "lucide-react";
import {CreateSetButton} from "@/components/flashcard/create-set-button";
import {SetCard} from "@/components/flashcard/set-card";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";

interface FlashcardSet {
    id: number;
    title: string;
    description?: string;
    owner: { name: string };
    averageRating: number;
}

const Page = () => {

    const router = useRouter();

    const [sets, setSets] = useState<FlashcardSet[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch("/api/flashcard-sets/user")
            .then((res) => res.json())
            .then((data) => {
                setSets(data);
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));
    }, []);

    const handleDelete = async (data: {
        id:number;
    }) => {
        try {
            const res = await fetch(`/api/flashcard-sets/${data.id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body:JSON.stringify(data),
            });

            if (res.ok) {
                router.push("/");
            } else {
                const error = await res.json();
                throw new Error(error.message);
            }
        } catch (error) {
            console.error("Failed to delete flashcard set:", error);
            alert(error instanceof Error ? error.message : "Failed to create flashcard set");
        }
    };
    return (
        <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            <div className="container mx-auto px-4 py-16 space-y-8">
                <div className="pt-8">
                    <h2 className="text-2xl font-semibold mb-6">My Flashcard Sets</h2>
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="h-[200px] rounded-lg bg-muted animate-pulse"/>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {sets.map((set) => (
                                <SetCard key={set.id} set={set} onDelete={() => handleDelete(set)} onUpdate={() => router.push(`/sets/${set.id}/update`)} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};

export default Page;
