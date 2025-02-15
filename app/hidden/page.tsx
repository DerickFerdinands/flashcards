"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Flashcard {
    id: number
    question: string
    answer: string
    flashcardSetId: number
}

export default function HiddenCards() {
    const [hiddenCards, setHiddenCards] = useState<Flashcard[]>([])

    useEffect(() => {
        fetchHiddenCards()
    }, [])

    const fetchHiddenCards = async () => {
        try {
            const response = await fetch("/api/hidden-cards")
            if (!response.ok) {
                throw new Error("Failed to fetch hidden cards")
            }
            const data = await response.json()
            setHiddenCards(data)
        } catch (error) {
            console.error("Error fetching hidden cards:", error)
        }
    }

    const unhideCard = async (flashcardId: number) => {
        try {
            const response = await fetch("/api/hidden-cards", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ flashcardId }),
            })

            if (!response.ok) {
                throw new Error("Failed to unhide card")
            }

            // Remove the unhidden card from the state
            setHiddenCards(hiddenCards.filter((card) => card.id !== flashcardId))
        } catch (error) {
            console.error("Error unhiding card:", error)
        }
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Hidden Cards</h1>
            {hiddenCards.length === 0 ? (
                <p>No hidden cards found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {hiddenCards.map((card) => (
                        <Card key={card.id}>
                            <CardHeader>
                                <CardTitle>Question: {card.question}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="mb-4">Answer: {card.answer}</p>
                                <Button onClick={() => unhideCard(card.id)}>Show Card</Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}

