// app/api/reviews/route.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import authOptions from "../auth/[...nextauth]/options"; // Adjust the path as necessary

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        // Parse the JSON body
        const body = await request.json();
        console.log("POST /api/reviews body:", body);

        const { flashcardSetId, rating, comment } = body;

        // Validate input
        if (flashcardSetId == null || rating == null) {
            return NextResponse.json({ error: "Missing flashcardSetId or rating" }, { status: 400 });
        }

        if (typeof flashcardSetId !== "number" || typeof rating !== "number") {
            return NextResponse.json({ error: "flashcardSetId and rating must be numbers" }, { status: 400 });
        }

        if (rating < 1 || rating > 5) {
            return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
        }

        // Authenticate the user
        const session = await getServerSession(authOptions);

        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;

        // Check if the user has already reviewed this set
        const existingReview = await prisma.review.findFirst({
            where: {
                userId: userId,
                flashcardSetId: flashcardSetId,
            },
        });

        if (existingReview) {
            // Update existing review
            const updatedReview = await prisma.review.update({
                where: { id: existingReview.id },
                data: { rating, comment },
            });
            console.log("Updated Review:", updatedReview);
            return NextResponse.json(updatedReview, { status: 200 });
        } else {
            // Create new review
            const newReview = await prisma.review.create({
                data: {
                    rating,
                    comment,
                    userId: userId,
                    flashcardSetId: flashcardSetId,
                },
            });
            console.log("Created Review:", newReview);
            return NextResponse.json(newReview, { status: 201 });
        }
    } catch (error: any) {
        console.error("Error in POST /api/reviews:", error);

        // Handle JSON parsing errors
        if (error instanceof SyntaxError && "body" in error) {
            return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
        }

        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const url = new URL(request.url);
        const flashcardSetIdParam = url.searchParams.get("flashcardSetId");

        if (!flashcardSetIdParam) {
            return NextResponse.json({ error: "flashcardSetId query parameter is required" }, { status: 400 });
        }

        const flashcardSetId = parseInt(flashcardSetIdParam, 10);

        if (isNaN(flashcardSetId)) {
            return NextResponse.json({ error: "flashcardSetId must be a number" }, { status: 400 });
        }

        // Fetch the user's existing review for the specified flashcard set
        const review = await prisma.review.findFirst({
            where: {
                userId: session.user.id,
                flashcardSetId: flashcardSetId,
            },
        });

        if (!review) {
            return NextResponse.json(null, { status: 200 }); // Returning null is acceptable here
        }

        return NextResponse.json(review, { status: 200 });
    } catch (error) {
        console.error("Error in GET /api/reviews:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
