"use client"

import { useState, useEffect } from "react"

interface Set {
    id: string
    title: string
    description: string
    flashcards: { id: string; question: string; answer: string }[]
    reviews: { createdAt: string; score: number }[]
}

const useSet = (setId: string | undefined) => {
    const [set, setSet] = useState<Set | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchSet = async () => {
            if (!setId) return
            // Replace with your actual API call or data fetching logic
            const response = await fetch(`/api/sets/${setId}`)
            const data = await response.json()
            setSet(data)
            setIsLoading(false)
        }

        fetchSet()
    }, [setId])

    return { set, isLoading }
}

export { useSet }

