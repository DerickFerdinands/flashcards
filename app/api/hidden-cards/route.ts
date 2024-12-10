// app/api/hidden-cards/route.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import authOptions from "../auth/[...nextauth]/options"; // Ensure the correct path

const prisma = new PrismaClient();

// Define TypeScript interfaces for better type safety
interface HiddenCardRequestBody {
    flashcardId: number;
}

interface HiddenCard {
    id: number;
    userId: number;
    flashcardId: number;
}

export async function GET(request: Request) {
    console.log("Received GET request to /api/hidden-cards");

    const session = await getServerSession(authOptions);

    if (!session) {
        console.warn("Unauthorized access attempt to GET /api/hidden-cards");
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const existingUser = await prisma.user.findUnique({ where: { email:session.user.email } });
        const userId = existingUser?.id;
        // Fetch all hidden card IDs for the authenticated user
        const hiddenCards: HiddenCard[] = await prisma.hiddenCard.findMany({
            where: { userId: userId },
            select: { flashcardId: true },
        });

        const hiddenCardIds = hiddenCards.map((hc) => hc.flashcardId);
        console.log("Fetched hidden card IDs:", hiddenCardIds);

        return NextResponse.json(hiddenCardIds, { status: 200 });
    } catch (error) {
        console.error("Error in GET /api/hidden-cards:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    console.log("Received POST request to /api/hidden-cards");

    const session = await getServerSession(authOptions);

    if (!session) {
        console.warn("Unauthorized access attempt to POST /api/hidden-cards");
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: HiddenCardRequestBody | null = null;

    try {
        // Attempt to parse the request body
        body = await request.json();
        console.log("Request body:", body);
    } catch (error) {
        console.error("Failed to parse JSON body:", error);
        return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    if (!body) {
        console.error("Received null or undefined body");
        return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const { flashcardId } = body;

    // Validate the presence and type of flashcardId
    if (typeof flashcardId !== "number") {
        console.error("Invalid type for flashcardId:", flashcardId);
        return NextResponse.json({ error: "flashcardId must be a number" }, { status: 400 });
    }

    try {

        const existingUser = await prisma.user.findUnique({ where: { email:session.user.email } });
        const userId = existingUser?.id;
        // Check if the flashcard is already hidden by the user
        const existingHiddenCard: HiddenCard | null = await prisma.hiddenCard.findFirst({
            where: {
                userId: userId,
                flashcardId: flashcardId,
            },
        });

        if (existingHiddenCard) {
            console.warn("Flashcard is already hidden:", flashcardId);
            return NextResponse.json({ error: "Flashcard is already hidden" }, { status: 400 });
        }

        // Create a new hidden card entry
        const newHiddenCard: HiddenCard = await prisma.hiddenCard.create({
            data: {
                userId: userId,
                flashcardId: flashcardId,
            },
        });

        console.log("Created new hidden card:", newHiddenCard);

        return NextResponse.json(newHiddenCard, { status: 201 });
    } catch (error: any) {
        if (error.code === "P2002") {
            // Prisma unique constraint failed
            console.error("Unique constraint failed:", error);
            return NextResponse.json({ error: "Duplicate hidden card" }, { status: 409 });
        }
        console.error("Error in POST /api/hidden-cards:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    console.log("Received DELETE request to /api/hidden-cards");

    const session = await getServerSession(authOptions);

    if (!session) {
        console.warn("Unauthorized access attempt to DELETE /api/hidden-cards");
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: HiddenCardRequestBody | null = null;

    try {
        // Attempt to parse the request body
        body = await request.json();
        console.log("Request body:", body);
    } catch (error) {
        console.error("Failed to parse JSON body:", error);
        return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    if (!body) {
        console.error("Received null or undefined body");
        return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const { flashcardId } = body;

    // Validate the presence and type of flashcardId
    if (typeof flashcardId !== "number") {
        console.error("Invalid type for flashcardId:", flashcardId);
        return NextResponse.json({ error: "flashcardId must be a number" }, { status: 400 });
    }

    try {

        const existingUser = await prisma.user.findUnique({ where: { email:session.user.email } });
        const userId = existingUser?.id;
        // Delete the hidden card entry if it exists
        const deleted = await prisma.hiddenCard.deleteMany({
            where: {
                userId: userId,
                flashcardId: flashcardId,
            },
        });

        if (deleted.count === 0) {
            console.warn("Flashcard was not hidden:", flashcardId);
            return NextResponse.json({ error: "Flashcard was not hidden" }, { status: 400 });
        }

        console.log("Unhidden flashcard:", flashcardId);

        return NextResponse.json({ message: "Flashcard unhidden successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error in DELETE /api/hidden-cards:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
