export interface Flashcard {
    id: number;
    question: string;
    answer: string;
}

export interface FlashcardSet {
    id: number;
    title: string;
    description?: string;
    flashcards: Flashcard[];
    averageRating: number;
    owner: {
        name: string;
    };
}

export interface Review {
    id: number;
    rating: number;
    comment?: string;
}
