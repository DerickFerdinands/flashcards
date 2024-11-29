import Link from "next/link";
import { Rating } from "@/components/ui/rating";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

interface FlashcardSetProps {
  set: {
    id: number;
    title: string;
    description?: string;
    owner: { name: string };
    averageRating: number;
  };
}

export function SetCard({ set }: FlashcardSetProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl font-semibold line-clamp-1">{set.title}</CardTitle>
        <div className="flex items-center text-sm text-muted-foreground">
          by {set.owner.name}
        </div>
      </CardHeader>
      <CardContent>
        {set.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{set.description}</p>
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <Rating value={set.averageRating} />
        <Link href={`/sets/${set.id}`}>
          <Button variant="secondary" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground">
            <BookOpen className="mr-2 h-4 w-4" />
            Study
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}