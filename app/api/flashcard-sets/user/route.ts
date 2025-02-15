import {NextResponse} from "next/server";
import {PrismaClient} from "@prisma/client";
import {getServerSession} from "next-auth/next";
import authOptions from "@/app/api/auth/[...nextauth]/options";

const prisma = new PrismaClient();

export async function GET(request: Request) {

    const session = await getServerSession(authOptions);

    console.log(session)

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const sort = searchParams.get("sort") || "rating";

    const flashcardSets = await prisma.flashcardSet.findMany({
        where: {
          ownerId: session?.user.id,
        },
        include: {
            owner: true,
            reviews: true,
            flashcards: true,
        },
    });

    console.log(flashcardSets);

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
