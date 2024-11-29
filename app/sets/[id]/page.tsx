// app/sets/[id]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface Flashcard {
    id: number;
    question: string;
    answer: string;
}

interface FlashcardSet {
    id: number;
    title: string;
    description?: string;
    flashcards: Flashcard[];
    averageRating: number;
}

export default function StudySet({ params }: { params: { id: string } }) {
    const [set, setSet] = useState<FlashcardSet | null>(null);
    const [current, setCurrent] = useState<number>(0);
    const [showAnswer, setShowAnswer] = useState<boolean>(false);
    const { data: session } = useSession();
    const [hiddenCards, setHiddenCards] = useState<number[]>([]);
    const router = useRouter();

    useEffect(() => {
        fetch(`/api/flashcard-sets/${params.id}`)
            .then((res) => res.json())
            .then((data) => setSet(data));

        if (session) {
            fetch(`/api/hidden-cards`)
                .then((res) => res.json())
                .then((data) => setHiddenCards(data));
        }
    }, [params.id, session]);

    if (!set) {
        return <div>Loading...</div>;
    }

    const visibleFlashcards = set.flashcards.filter((card) => !hiddenCards.includes(card.id));

    const handleNext = () => {
        setShowAnswer(false);
        setCurrent((prev) => (prev + 1) % visibleFlashcards.length);
    };

    const handlePrev = () => {
        setShowAnswer(false);
        setCurrent((prev) => (prev - 1 + visibleFlashcards.length) % visibleFlashcards.length);
    };

    const toggleAnswer = () => {
        setShowAnswer(!showAnswer);
    };

    return (
        <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">{set.title}</h1>
            <p className="mb-4">{set.description}</p>
    {visibleFlashcards.length === 0 ? (
        <p>No flashcards to display.</p>
    ) : (
        <div className="border p-4 rounded shadow mb-4">
        <h2 className="text-xl font-semibold">Flashcard {current + 1} of {visibleFlashcards.length}</h2>
    <p className="mt-2">{visibleFlashcards[current].question}</p>
        {showAnswer && <p className="mt-2 text-green-600">{visibleFlashcards[current].answer}</p>}
            <button onClick={toggleAnswer} className="mt-2 bg-yellow-500 text-white px-3 py-1 rounded">
            {showAnswer ? "Hide Answer" : "Show Answer"}
            </button>
            <div className="mt-4">
        <button onClick={handlePrev} className="bg-blue-500 text-white px-3 py-1 rounded mr-2">
            Previous
            </button>
            <button onClick={handleNext} className="bg-blue-500 text-white px-3 py-1 rounded">
            Next
            </button>
            </div>
            </div>
        )}
        </div>
    );
    }
