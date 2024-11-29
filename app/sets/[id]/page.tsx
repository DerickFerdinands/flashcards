import { Metadata } from "next";
import StudySetClient from "@/app/sets/[id]/StudySetClient";

interface Props {
    params: { id: string };
}

export const metadata: Metadata = {
    title: "Study Flashcards",
    description: "Study and review flashcard sets",
};

export default async function StudySetPage({ params }: Props) {
    const res = await fetch(`http://localhost:3000/api/flashcard-sets/${params.id}`, {
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error("Failed to fetch flashcard set");
    }

    const set = await res.json();

    return <StudySetClient set={set} />;
}
