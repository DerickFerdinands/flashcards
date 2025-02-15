"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Trash2 } from "lucide-react"
import {useToast} from "@/hooks/use-toast";


async function getFlashcardSets() {
    const res = await fetch("http://localhost:3000/api/flashcard-sets")
    if (!res.ok) {
        throw new Error("Failed to fetch flashcard sets")
    }
    return res.json()
}

async function deleteFlashcardSet(id: number) {
    const res = await fetch(`http://localhost:3000/api/flashcard-sets/${id}`, {
        method: "DELETE",
    })
    if (!res.ok) {
        throw new Error("Failed to delete flashcard set")
    }
    return res.json()
}

export default function FlashcardSetsPage() {
    const [flashcardSets, setFlashcardSets] = useState<any[]>([])
    const { toast } = useToast()

    useEffect(() => {
        getFlashcardSets().then(setFlashcardSets)
    }, [])

    const handleDelete = async (id: number) => {
        try {
            await deleteFlashcardSet(id)
            setFlashcardSets(flashcardSets.filter((set) => set.id !== id))
            toast({
                title: "Flashcard set deleted",
                description: "The flashcard set has been successfully deleted.",
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete the flashcard set. Please try again.",
                variant: "destructive",
            })
        }
    }

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-6">Flashcard Sets</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {flashcardSets.map((set) => (
                    <Card key={set.id}>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle>{set.title}</CardTitle>
                                    <CardDescription>{set.description}</CardDescription>
                                </div>
                                <Button variant="destructive" size="icon" onClick={() => handleDelete(set.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-2">
                                Created by {set.owner.name} on {new Date(set.createdAt).toLocaleDateString()}
                            </p>
                            <p className="mb-2">
                                <Badge variant="secondary">{set.flashcards.length} cards</Badge>
                                <Badge variant="secondary" className="ml-2">
                                    {set.averageRating > 0 ? `${set.averageRating.toFixed(1)} ★` : "No ratings"}
                                </Badge>
                            </p>
                            <p className="text-sm mb-4">
                                {set.reviews.length} {set.reviews.length === 1 ? "review" : "reviews"}
                            </p>
                            <Accordion type="single" collapsible>
                                <AccordionItem value="reviews">
                                    <AccordionTrigger>Show Reviews</AccordionTrigger>
                                    <AccordionContent>
                                        {set.reviews.length > 0 ? (
                                            set.reviews.map((review: any) => (
                                                <div key={review.id} className="mb-2 p-2 bg-muted rounded">
                                                    <p className="font-semibold">{review.rating} ★</p>
                                                    <p className="text-sm">{review.comment || "No comment"}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {new Date(review.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            ))
                                        ) : (
                                            <p>No reviews yet.</p>
                                        )}
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

