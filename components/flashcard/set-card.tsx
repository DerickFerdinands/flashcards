"use client";

import Link from "next/link";
import { Rating } from "@/components/ui/rating";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Pencil, Trash2 } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface FlashcardSetProps {
    set: {
        id: number;
        title: string;
        description?: string;
        owner: { name: string };
        averageRating: number;
    };
    onUpdate?: (id: number) => void;
    onDelete?: (id: number) => void;
}

export function SetCard({ set, onUpdate, onDelete }: FlashcardSetProps) {
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
                <Rating value={set.averageRating} readOnly />
                <div className="flex items-center gap-2">
                    {onUpdate && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onUpdate(set.id)}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>
                    )}
                    {onDelete && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Flashcard Set</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to delete "{set.title}"? This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => onDelete(set.id)}
                                        className="bg-destructive hover:bg-destructive/90"
                                    >
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                    <Link href={`/sets/${set.id}`}>
                        <Button
                            variant="secondary"
                            size="sm"
                            className="group-hover:bg-primary group-hover:text-primary-foreground"
                        >
                            <BookOpen className="mr-2 h-4 w-4" />
                            Study
                        </Button>
                    </Link>
                </div>
            </CardFooter>
        </Card>
    );
}
