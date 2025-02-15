"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, LogIn, LogOut } from "lucide-react";

export function Navbar() {
    const { data: session, status } = useSession();

    return (
        <nav className="border-b bg-background">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center space-x-8">
                    <Link
                        href="/"
                        className="flex items-center space-x-2 font-semibold text-lg"
                    >
                        <BookOpen className="h-6 w-6" />
                        <span>FlashCards</span>
                    </Link>

                    {session && (
                        <div className="hidden md:flex space-x-6">
                            <Link
                                href="/my-sets"
                                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                My Sets
                            </Link>
                            <Link
                                href="/create"
                                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Create Set
                            </Link>

                            <Link
                                href="/hidden"
                                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Hidden Cards
                            </Link>
                        </div>
                    )}
                </div>

                <div className="flex items-center space-x-4">
                    {status === "loading" ? (
                        <Button variant="ghost" disabled>
                            Loading...
                        </Button>
                    ) : session ? (
                        <Button
                            variant="ghost"
                            onClick={() => signOut()}
                            className="text-sm font-medium"
                        >
                            <LogOut className="h-4 w-4 mr-2" />
                            Sign Out
                        </Button>
                    ) : (
                        <Button
                            variant="ghost"
                            onClick={() => signIn()}
                            className="text-sm font-medium"
                        >
                            <LogIn className="h-4 w-4 mr-2" />
                            Sign In
                        </Button>
                    )}
                </div>
            </div>
        </nav>
    );
}
