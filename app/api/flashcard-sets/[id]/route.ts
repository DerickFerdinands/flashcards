// app/api/flashcard-sets/[id]/route.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params; // Now `id` is accessible as params has been awaited

        // Validate the `id`
        const flashcardSetId = parseInt(id, 10);
        if (isNaN(flashcardSetId)) {
            return NextResponse.json({ error: "Invalid flashcard set ID" }, { status: 400 });
        }

        // Fetch the flashcard set from the database
        const flashcardSet = await prisma.flashcardSet.findUnique({
            where: { id: flashcardSetId },
            include: { flashcards: true, reviews: true },
        });

        if (!flashcardSet) {
            return NextResponse.json({ error: "Flashcard set not found" }, { status: 404 });
        }

        return NextResponse.json(flashcardSet, { status: 200 });
    } catch (error) {
        console.error("Error in GET /api/flashcard-sets/[id]:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
