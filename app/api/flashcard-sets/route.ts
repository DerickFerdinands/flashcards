// app/api/flashcard-sets/route.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import authOptions from "../auth/[...nextauth]/options"; // Adjust the path as necessary

const prisma = new PrismaClient();

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description, flashcards } = await request.json();

    if (!title || !flashcards || !Array.isArray(flashcards)) {
        return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    // Daily limit check
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const count = await prisma.flashcardSet.count({
        where: {
            owner: { email: session.user.email },
            createdAt: { gte: today },
        },
    });

    if (count >= 20) {
        return NextResponse.json({ error: "Daily flashcard set limit reached" }, { status: 403 });
    }

    const newSet = await prisma.flashcardSet.create({
        data: {
            title,
            description,
            owner: { connect: { email: session.user.email } },
            flashcards: {
                create: flashcards.map((card: any) => ({
                    question: card.question,
                    answer: card.answer,
                })),
            },
        },
        include: { flashcards: true },
    });

    return NextResponse.json(newSet, { status: 201 });
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const sort = searchParams.get("sort") || "rating";

    const flashcardSets = await prisma.flashcardSet.findMany({
        include: {
            owner: true,
            reviews: true,
            flashcards: true,
        },
    });

    // Calculate average ratings
    const setsWithRatings = flashcardSets.map((set) => {
        const avgRating =
            set.reviews.reduce((acc, review) => acc + review.rating, 0) / (set.reviews.length || 1);
        return { ...set, averageRating: avgRating };
    });

    // Sort by rating descending
    setsWithRatings.sort((a, b) => b.averageRating - a.averageRating);

    return NextResponse.json(setsWithRatings);
}
